var moment = require('moment');
var pool = require('../modules/database.js');
var formatters = require('./formatters.js');
var formatDate = formatters.formatDate;
var formatTime = formatters.formatTime;

function getAvailableAppts(appointment_type, delivery_method, location_id, min_date, max_date, res) {
  getApptSlots(appointment_type, delivery_method, location_id, min_date, max_date, res);
}

function getApptSlots(appointment_type, delivery_method, location_id, min_date, max_date, res) {
  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT "appointment_slots"."id" AS "appointment_slot_id", "appointment_slots"."num_allowed",' +
      '"appointment_slots"."start_time", "appointment_slots"."end_time",' +
      '"locations"."location" AS "location_name", "locations"."street", "locations"."city",' +
      '"locations"."state", "appointment_types"."appointment_type",' +
      '"delivery_methods"."delivery_method", "days"."name" AS "day" FROM "appointment_slots"' +
      'JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"' +
      'JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"' +
      'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"' +
      'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
      'WHERE "appointment_types"."appointment_type" = $1' +
      'AND "delivery_methods"."delivery_method" = $2' +
      'AND "locations"."id" = $3',
      [appointment_type, delivery_method, location_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log(queryError, 'ERROR MAKING QUERY');
        } else {
          var apptSlots = result.rows;
          var apptSlotIds = apptSlots.map(function(apptSlot) {
            return apptSlot.appointment_slot_id;
          });
          return countExistingAppts(apptSlotIds, apptSlots, min_date, max_date, res);
        }
      });
    }
  });
}

// apptSlots is an array of appointment_slot_ids
// min_date & max_date are dates that act as inclusive bounds of the date range to be searched
function countExistingAppts(apptSlotIds, apptSlots, min_date, max_date, res) {
  return pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT "appointments"."appointment_date", "appointment_slots"."id" AS "appointment_slot_id", COUNT(*)' +
        'FROM "appointments"' +
        'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"' +
        'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
        'WHERE "appointments"."appointment_slot_id" = ANY($1::int[])' +
        'AND "appointments"."appointment_date" >= $2' +
        'AND "appointments"."appointment_date" <= $3' +
        'AND ("appointments"."status_id" =' +
        '(SELECT "id" FROM "statuses" WHERE "status" = $4)' +
        'OR "appointments"."status_id" =' +
        '(SELECT "id" FROM "statuses" WHERE "status" = $5))' +
        'GROUP BY "appointments"."appointment_date", "appointment_slots"."id"',
      [apptSlotIds, min_date, max_date, 'pending', 'confirmed'],
      function(queryError, result){
          done();
          if (queryError) {
            console.log(queryError, 'ERROR MAKING QUERY');
          } else {
            var existingApptCounts = result.rows;
            return getOverrides(min_date, max_date, apptSlotIds, apptSlots, existingApptCounts, res);
          }
        });
      }
    });
}

function getOverrides(min_date, max_date, apptSlotIds, apptSlots, existingApptCounts, res) {
  return pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT * FROM "overrides"' +
      'WHERE "override_date" >= $1' +
      'AND "override_date" <= $2',
      [min_date, max_date],
      function(queryError, result){
          done();
          if (queryError) {
            console.log(queryError, 'ERROR MAKING QUERY');
          } else {
            var overrides = result.rows;
            console.log('overrides',overrides);
            return fillOutDateRange(min_date, max_date, apptSlots, existingApptCounts, overrides, res);
          }
        });
      }
  });
}

function fillOutDateRange(min_date, max_date, apptSlots, existingApptCounts, overrides, res) {
  var apptsAvailable = [];
  var date = min_date;
  while (date <= max_date) {
    var slotsForDate = [];
    var overridesForDate = checkForOverrides(date, overrides);
    if(overridesForDate) {
      slotsForDate = overridesForDate;
    } else {
      slotsForDate = findRelevant(apptSlots, date);
    }

    for (var i = 0; i < slotsForDate.length; i++) {
      var apptSlot = {};
      var isAvailable = checkAvailability(slotsForDate[i], date, existingApptCounts);
      if (isAvailable){
        apptSlot.date = formatDate(date);
        apptSlot.appointment_slot_id = slotsForDate[i].appointment_slot_id;
        apptSlot.num_allowed = slotsForDate[i].num_allowed;
        apptSlot.start_time = formatTime(slotsForDate[i].start_time);
        apptSlot.end_time = formatTime(slotsForDate[i].end_time);
        apptSlot.location_name = slotsForDate[i].location_name;
        apptSlot.street = slotsForDate[i].street;
        apptSlot.city = slotsForDate[i].city;
        apptSlot.state = slotsForDate[i].state;
        apptSlot.appointment_type = slotsForDate[i].appointment_type;
        apptSlot.delivery_method = slotsForDate[i].delivery_method;
        apptSlot.day = slotsForDate[i].day;
        apptsAvailable.push(apptSlot);
      }
    }
    date = moment(date).add(1, 'days').format('YYYY-MM-DD');
  }
  res.send(apptsAvailable);
}

function findRelevant(apptSlots, date) {
  var momentOfDate = moment(date);
  var day = momentOfDate.format('dddd');
  var slotList = apptSlots.filter(function(apptSlot) {
    return apptSlot.day === day;
  });
  return slotList;
}

// function checkAndPush(apptSlot, apptsAvailable) {
//   var apptAvailable;
//   var isAvailable = checkAvailability(apptSlot, date, existingApptCounts, res);
//   if (isAvailable) {
//     apptSlot.date = formatDate(date);
//     apptSlot.start_time = formatTime(apptSlot.start_time);
//     apptSlot.end_time = formatTime(apptSlot.end_time);
//     apptsAvailable.push(apptSlot);
//   }
// }

// checks to see if an appt slot on a particular date is still available
// (i.e. not completely filled) and returns true if it is
function checkAvailability(apptSlot, date, existingApptCounts) {
  console.log('existingApptCounts', existingApptCounts);
  for (var i = 0; i < existingApptCounts.length; i++) {
    var appt = existingApptCounts[i];
    console.log('*******IN CHECK AVAILABILITY********');
    console.log('appt', appt);
    console.log('appt.appointment_date', appt.appointment_date);
    console.log('date', date);
    console.log('appt.appointment_slot_id', apptSlot.appointment_slot_id);
    if (appt.appointment_slot_id == apptSlot.appointment_slot_id && compareDates(appt.appointment_date, date)) {
      console.log('date match:', appt.appointment_date, date);
      console.log('slot match:', appt.appointment_slot_id, apptSlot.id);
      if (appt.count < apptSlot.num_allowed) {
        return true;
      } else {
        return false;
      }
    }
  }
  return true;
}

function compareDates(appointmentDate, date) {
    //Convert date string from appointment object to a Javascript Date
    console.log('in compareDates');
    appointmentDate = new Date (appointmentDate);
    date = new Date(date);
    // console.log('appointmentDate:', appointmentDate.getDate(), 'date:', date.getDate());
    // console.log('dates match?', appointmentDate.getDate() == date.getDate(),
    //   appointmentDate.getMonth() == date.getMonth(),
    //   appointmentDate.getFullYear() == date.getFullYear());
    // return (appointmentDate.getDate() == date.getDate()
    //   && appointmentDate.getMonth() == date.getMonth()
    //   && appointmentDate.getFullYear() == date.getFullYear());
    var match = appointmentDate.toISOString().substr(0,10) == date.toISOString().substr(0,10);
    console.log('is it a match?', match);
    return (match);
    //Return a comparison of the two dates.
}

function checkForOverrides(date, overrides) {
  if (overrides.length > 0) {
    return overrides.filter(function(row) {
      return new Date(row.override_date) == new Date(date);
    });
  } else {
    return false;
  }
}

module.exports = getAvailableAppts;
