var express = require('express');
var router = express.Router();
var passport = require('passport');
var moment = require('moment');

var pool = require('../modules/database.js');

/**
  * @api {get} /appointments/existing/:user_id Get User Appointments
  * @apiVersion 0.1.0
  * @apiName GetUserAppointments
  * @apiGroup Appointments
  * @apiDescription Get a user's existing appointments

  * @apiParam {Number} user_id User's unique ID
  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccess {Number} appointments.id   Unique ID of appointment
  * @apiSuccess {Object} appointments.client   Object with information about
      the client for whom the appointment was made
  * @apiSuccess {String} appointments.client.first   First name of client
  * @apiSuccess {String} appointments.client.last   Last name of client
  * @apiSuccess {String} appointments.client.address   Address of client
  * @apiSuccess {Object} appointments.info   Object with information about the
      appointment
  * @apiSuccess {Number} appointments.info.appointment_number   Number to identify
      appointment in Bridging's separate database
  * @apiSuccess {String} appointments.info.start_time   Start time of appointment
  * @apiSuccess {String} appointments.info.end_time   End time of appointment
  * @apiSuccess {String} appointments.info.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.info.location_name   "Roseville" or "Bloomington"
  * @apiSuccess {String} appointments.info.location_address   Address of location
  * @apiSuccess {Date} appointments.info.date  Date of appointment
  * @apiSuccess {Date} appointments.info.delivery_date  Date of delivery (if applicable)
  * @apiSuccess {String} appointments.info.delivery_date    Status of appointment
      ("confirmed" or "pending")
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "id": 1,
        "client": {
          "first": "Jim",
          "last": "Tolliver",
          "address": "1400 Lizard Ln, St. Paul, MN"
        },
        "info": {
          "appointment_number" : 4590,
          "start_time": "9:15 am",
          "end_time": "10:15 am",
          "appointment_type": "shopping",
          "delivery_method": "pickup",
          "location_name": "Bloomington",
          "location_address": "201 W 87th St, Bloomington, MN",
          "appointment_date": "4/21/17",
          "delivery_date": "4/22/17"
          "status": "confirmed",
        },
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/existing/:user_id', function(req, res) {
  // TODO: add code
});

/**
  * @api {get} /appointments/available Get Available Appointments
  * @apiVersion 0.1.0
  * @apiName GetAvailableAppointments
  * @apiGroup Appointments
  * @apiDescription Get appointment objects that match the parameters and still
    have available spots left

  * @apiParam {Date} min_date   Earliest date in range to be checked
  * @apiParam {Date} max_date   Latest date in range to be checked
  * @apiParam {String} appointment_type   Type of appointment ("shopping" or "new bed")
  * @apiParam {String} delivery_method  Method of delivery ("delivery" or "pickup")
  * @apiParam {Number} location_id  Unique ID of location (database ID for
                                    Bloomington or for Roseville)
  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccess {Number} appointments.appointment_slot_id   Unique ID of appointment slot
  * @apiSuccess {Date} appointments.date  Date of appointment
  * @apiSuccess {String} appointments.start_time   Start time of appointment
  * @apiSuccess {String} appointments.end_time   End time of appointment
  * @apiSuccess {String} appointments.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.delivery_method   "delivery" or "pickup"
  * @apiSuccess {String} appointments.location_name   Name of location
      ("Bloomington" or "Roseville")
  * @apiSuccess {String} appointments.location_address   Address of location

  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "appointment_slot_id": 3,
        "date": "June 9, 2017",
        "start_time": "9:15 am",
        "end_time": "10:15 am",
        "appointment_type": "shopping",
        "delivery_method": "pickup",
        "location_name": "Bloomington",
        "location_address": "201 W 87th St, Bloomington, MN",
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/available', function(req, res) {
  var params = req.query;
  var min_date = params.min_date;
  var max_date = params.max_date;
  var appointment_type = params.appointment_type;
  var delivery_method = params.delivery_method;
  var location_id = params.location_id;

  function getAvailableAppointments(appointment_type, delivery_method, location_id) {
    pool.connect(function(connectionError, db, done) {
      if (connectionError) {
        console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
        res.sendStatus(500);
      } else {
        db.query('SELECT "appointment_slots"."id", "appointment_slots"."num_allowed",' +
        '"appointment_slots"."start_time", "appointment_slots"."end_time",' +
        '"locations"."location", "locations"."street", "locations"."city",' +
        '"locations"."state", "appointment_types"."appointment_type",' +
        '"delivery_methods"."delivery_method", "days"."name" FROM "appointment_slots"' +
        'JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"' +
        'JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"' +
        'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"' +
        'JOIN "days" ON "appointment_slots"."day_id" = "days"."id"' +
        'WHERE "appointment_types"."appointment_type" = $1' +
        'AND "delivery_methods"."delivery_method" = $2' +
        'AND "locations"."id" = $3',
        [appointment_type, delivery_method, location_id], // <array>).then
        function(queryError, result){
          done();
          if (queryError) {
            console.log(queryError, 'ERROR MAKING QUERY');
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  }

  function countExistingAppointments() {}
});

/**
  * @api {post} /appointments/reserve Make Appointment
  * @apiVersion 0.1.0
  * @apiName MakeAppointment
  * @apiGroup Appointments
  * @apiDescription Makes appointment & saves to database

  * @apiParam {Date} date   Date of appointment
  * @apiParam {String} start_time   Start time of appointment
  * @apiParam {String} end_time   End time of appointment
  * @apiParam {Number} user_id   Unique id of user creating the appointment
  * @apiParam {Number} client_id   Unique id of client for whom appointment was created
  * @apiParam {Number} appointment_slot_id   Unique id of appointment slot
  * @apiParam {Date} appointment_date_added   Date on which appointment was created (current date)
  * @apiParam {String} status   Whether appointment is confirmed, canceled, or pending (should pass in pending)
  * @apiSuccess {Number} appointment_id   Unique ID of appointment that has been created
  * @apiSuccessExample Success-Response:
  *   HTTP/1.1 201 Created
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/reserve', function(req, res) {
  console.log(req.body);
  var appointment = req.body;
  var appointment_date = moment(appointment.date).format('M/D/YYYY');
  var user_id = appointment.user_id;
  var client_id = appointment.client_id;
  var appointment_slot_id = appointment.appointment_slot_id;
  var created_date = new Date();
  var status = appointment.status;

  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log('ERROR CONNECTING TO DATABASE');
      res.sendStatus(500);
    } else {
      db.query('INSERT INTO "appointments" ("appointment_slot_id", "user_id", \
       "client_id", "created_date", "appointment_date", "status_id")  \
      VALUES ($1, $2, $3, $4, $5, (SELECT "id" FROM "statuses" \
      WHERE "status" = $6)) RETURNING "id"',
      [appointment_slot_id, user_id, client_id, created_date, appointment_date, status],
      function(queryError, result){
        done();
        if (queryError) {
          console.log('ERROR MAKING QUERY', queryError);
          res.sendStatus(500);
        } else {
          res.send(result.rows[0]);
        }
      });
    }
  });
});

/**
  * @api {put} /appointments/existing Update Appointment
  * @apiVersion 0.1.0
  * @apiName UpdateAppointment
  * @apiGroup Appointments
  * @apiDescription Updates status of an appointment in database

  * @apiParam {Number} appointment_id  Unique ID of appointment
  * @apiParam {String} status  Status of appointment ("confirmed", "pending", or "canceled")
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/existing', function(req, res) {
  // TODO: add code
});

// START ADMIN-ONLY APPOINTMENT ROUTES


// END ADMIN-ONLY APPOINTMENT ROUTES

module.exports = router;
