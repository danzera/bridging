var express = require('express');
var router = express.Router();
var pool = require('../modules/database.js');
var getAvailableAppts = require('../modules/getAvailableAppts.js');
var formatters = require('../modules/formatters.js');
var formatDate = formatters.formatDate;
var formatTime = formatters.formatTime;
var formatTimeForClient = formatters.formatTimeForClient;
var formatDateForPostgres = formatters.formatDateForPostgres;
var formatSingleAppointment = formatters.formatSingleAppointment;

/**
  * @api {get} /appointments/existing Get User Appointments
  * @apiVersion 0.1.0
  * @apiName GetUserAppointments
  * @apiGroup Appointments
  * @apiDescription Get a user's existing appointments

  * @apiSuccess {Object[]} appointments   Array of appointment objects
  * @apiSuccess {Number} appointments.id   Unique ID of appointment
  * @apiSuccess {Object} appointments.client   Object with information about
      the client for whom the appointment was made
  * @apiSuccess {String} appointments.client.client_id   Unique ID of client
  * @apiSuccess {String} appointments.client.first   First name of client
  * @apiSuccess {String} appointments.client.last   Last name of client
  * @apiSuccess {String} appointments.client.street   Street address of client
  * @apiSuccess {String} appointments.client.city   City of client address
  * @apiSuccess {String} appointments.client.state   State of client address
  * @apiSuccess {Object} appointments.info   Object with information about the
      appointment
  * @apiSuccess {Number} appointments.info.appointment_number   Number to identify
      appointment in Bridging's separate database
  * @apiSuccess {String} appointments.info.start_time   Start time of appointment
  * @apiSuccess {String} appointments.info.end_time   End time of appointment
  * @apiSuccess {String} appointments.info.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.info.location_id   Unique ID of location
  * @apiSuccess {String} appointments.info.location_name   "Roseville" or "Bloomington"
  * @apiSuccess {String} appointments.info.street   Street address of location
  * @apiSuccess {String} appointments.info.city   City of location address
  * @apiSuccess {String} appointments.info.state   State of location address
  * @apiSuccess {Date} appointments.info.date  Date of appointment
  * @apiSuccess {Date} appointments.info.delivery_date  Date of delivery (if applicable)
  * @apiSuccess {String} appointments.info.status   Status of appointment
      ("confirmed" or "pending")
  * @apiSuccess {String} appointments.info.delivery_method  Delivery method ("pickup" or "delivery")
  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "id": 1,
        "client": {
          "client_id": 1,
          "first": "Jim",
          "last": "Tolliver",
          "address": "1400 Lizard Ln",
          "city": "St. Paul",
          "state": "MN"
        },
        "info": {
          "appointment_number": 4590,
          "start_time": "9:15 am",
          "end_time": "10:15 am",
          "appointment_type": "shopping",
          "delivery_method": "pickup",
          "location_id": 1,
          "location_name": "Bloomington",
          "location_address": "201 W 87th St",
          "city": "Bloomington",
          "state": "MN",
          "appointment_date": "April 21, 2017",
          "delivery_date": "April 22, 2017"
          "status": "confirmed",
        },
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/existing', function(req, res) {
  var user_id = req.user.id;
  console.log('user_id',user_id);

  pool.connect(function(connectionError, db, done) {
    if (connectionError) {
      console.log(connectionError, 'ERROR CONNECTING TO DATABASE');
      return connectionError;
    } else {
      db.query('SELECT "appointments"."id", "clients"."first", "clients"."last", "clients"."id" AS "client_id",' +
      '"clients"."street" AS "client_street", "clients"."city" AS "client_city", "clients"."state" AS "client_state",' +
      '"appointments"."confirmation_id" AS "appointment_number", "appointment_slots"."start_time",' +
      '"appointment_slots"."end_time", "appointment_types"."appointment_type",' +
      '"locations"."location" AS "location_name",  "locations"."street" AS "location_street", "locations"."city" AS "location_city",' +
      '"locations"."id" AS "location_id", "locations"."state" AS "location_state", "appointments"."appointment_date",' +
      '"appointments"."delivery_date", "statuses"."status", "delivery_methods"."delivery_method"' +
      'FROM "appointments"' +
      'JOIN "clients" ON "appointments"."client_id" = "clients"."id"' +
      'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id"' +
      'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id"' +
      'JOIN "locations" ON "appointment_slots"."location_id" = "locations"."id"' +
      'JOIN "statuses" ON "appointments"."status_id" = "statuses"."id"' +
      'JOIN "delivery_methods" ON "appointment_slots"."delivery_method_id" = "delivery_methods"."id"' +
      'WHERE "appointments"."user_id" = $1' +
      'ORDER BY "appointments"."appointment_date" ASC',
      [user_id],
      function(queryError, result){
        done();
        if (queryError) {
          console.log(queryError, 'ERROR MAKING QUERY');
        } else {
          var userAppts = result.rows;
          var formattedAppts = formatAppts(userAppts);
          res.send(formattedAppts);
        }
      });
    }
  });

  function formatAppts(userAppts) {
    var formattedAppts = userAppts.map(function(userAppt) {
      var apptObj = {id: userAppt.id};
      apptObj.client = {
        client_id: userAppt.client_id,
        first: userAppt.first,
        last: userAppt.last,
        street: userAppt.client_street,
        city: userAppt.client_city,
        state: userAppt.client_state
      };
      apptObj.info = {
        appointment_number: userAppt.appointment_number,
        start_time: formatTime(userAppt.start_time),
        end_time: formatTime(userAppt.end_time),
        appointment_type: userAppt.appointment_type,
        location_id: userAppt.location_id,
        location_name: userAppt.location_name,
        street: userAppt.location_street,
        city: userAppt.location_city,
        state: userAppt.location_state,
        date: formatDate(userAppt.appointment_date),
        status: userAppt.status,
        delivery_method: userAppt.delivery_method
      };
      if (userAppt.delivery_date) {
        apptObj.info.delivery_date = formatDate(userAppt.delivery_date);
      }
      return apptObj;
    });
    return formattedAppts;
  }
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
  * @apiSuccess {String} appointments.day   Day of week of appointment
  * @apiSuccess {String} appointments.end_time   End time of appointment
  * @apiSuccess {String} appointments.appointment_type   Type of appointment
      ("shopping" or "new bed")
  * @apiSuccess {String} appointments.delivery_method   "delivery" or "pickup"
  * @apiSuccess {String} appointments.location_name   Name of location
      ("Bloomington" or "Roseville")
  * @apiSuccess {String} appointments.street   Street address of location
  * @apiSuccess {String} appointments.city   City for address of location
    * @apiSuccess {String} appointments.state   State for address of location (2-letter abbreviation)

  * @apiSuccessExample {json} Success-Response:
      HTTP/1.1 200 OK
      [{
        "appointment_slot_id": 3,
        "appointment_type": "shopping",
        "city": "Bloomington",
        "day": "Monday",
        "date": "June 9, 2017",
        "delivery_method": "pickup",
        "end_time": "10:15 am",
        "location_name": "Bloomington",
        "start_time": "9:15 am",
        "street": "201 W 87th St",
        "state": "MN"
      }]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/available', function(req, res) {
  var params = req.query;
  var min_date = formatDateForPostgres(params.min_date);
  var max_date = formatDateForPostgres(params.max_date);
  var appointment_type = params.appointment_type;
  var delivery_method = params.delivery_method;
  var location_id = params.location_id;

  getAvailableAppts(appointment_type, delivery_method, location_id, min_date, max_date, res);
});

/**
  * @api {post} /appointments/reserve Make Appointment
  * @apiVersion 0.1.0
  * @apiName MakeAppointment
  * @apiGroup Appointments
  * @apiDescription Makes appointment & saves to database

  * @apiParam {Date} date   Date of appointment
  * @apiParam {Number} client_id   Unique id of client for whom appointment was created
  * @apiParam {Number} appointment_slot_id   Unique id of appointment slot
  * @apiParam {String} status   Whether appointment is confirmed, canceled, or pending (should pass in pending)
  * @apiSuccess {Number} appointment_id   Unique ID of appointment that has been created
  * @apiSuccessExample Success-Response:
  *   HTTP/1.1 201 Created
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.post('/reserve', function(req, res) {
  var appointment = req.body;
  console.log('appointment object from client', appointment);
  var appointment_date = formatDateForPostgres(appointment.date);
  var user_id = req.user.id;
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

// START ADMIN-ONLY APPOINTMENT ROUTES
/**
  * @api {get} /appointments/all Get All Appointments
  * @apiVersion 0.1.0
  * @apiName GetAllAppointments
  * @apiGroup Appointments
  * @apiDescription Retrieves all appointments and associated appointment information.
  *
  * @apiSuccess {Number} id Unique ID of each appointment.
  * @apiSuccess {Date} appointment_date Date for which the appointment is scheduled.
  * @apiSuccess {Date} delivery_date Tentative delivery date, if any, for the appointment.
  * @apiSuccess {Number} confirmation_id Appointment confirmation number from the "appointments" table.
  * @apiSuccess {Number} appointment_slot_id Unique ID corresponding to an entry in the "appointment_slots" table.
  * @apiSuccess {String} appointment_type Appointment type - corresponds to an entry in the "appointment_types" table.
  * @apiSuccess {String} start_time Appointment start time - corresponds to the "appointment_slot_id" row in the "appointment_slots" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency associated with each appointment.
  * @apiSuccess {String} name Name of the agency associated with each appointment.
  * @apiSuccess {Number} user_id Unique ID of the user associated with each appointment.
  * @apiSuccess {String} user_fist First name of the user associated with each appointment.
  * @apiSuccess {String} user_last Last name of the user associated with each appointment.
  * @apiSuccess {Number} client_id Unique ID of the client associated with each appointment.
  * @apiSuccess {String} client_fist First name of the client associated with each appointment.
  * @apiSuccess {String} client_last Last name of the client associated with each appointment.
  * @apiSuccess {Number} status_id Unique ID corresponding to an entry in the "statuses" table.
  * @apiSuccess {String} status Appointment status - corresponds to the "status_id" row in the "statuses" table.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/all', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database on /appointments/all GET route:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('SELECT "appointments"."id", "appointments"."appointment_date", "appointments"."delivery_date", "appointments"."confirmation_id", "appointments"."appointment_slot_id", "appointment_types"."appointment_type", "locations"."location" AS "location_name", "delivery_methods"."delivery_method", "appointment_slots"."start_time", "appointment_slots"."end_time","users"."agency_id", "agencies"."name", "appointments"."user_id", "users"."first" AS "user_first", "users"."last" AS "user_last", "appointments"."client_id", "clients"."first" AS "client_first", "clients"."last" AS "client_last", "appointments"."status_id", "statuses"."status" ' +
                        'FROM "appointments" ' +
                        'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id" ' +
                        'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id" ' +
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                        'JOIN "users" ON "appointments"."user_id" = "users"."id" ' +
                        'JOIN "agencies" ON "users"."agency_id" = "agencies"."id" ' +
                        'JOIN "clients" ON "appointments"."client_id" = "clients"."id" ' +
                        'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
                        'JOIN "statuses" ON "appointments"."status_id" = "statuses"."id";',
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /appointments/all GET route:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful GET from /appointments/all route:', result.rows);
              var allAppointmentsArray = result.rows;
              allAppointmentsArray.forEach(function(appointmentObj) {
                appointmentObj.start_time = formatTimeForClient(appointmentObj.start_time);
                appointmentObj.end_time = formatTimeForClient(appointmentObj.end_time);
              });
              res.send(allAppointmentsArray);
            }
          }); // end query callback
        } // end if-else
      }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});
/**
  * @api {get} /appointments/pending Get All Pending Appointments
  * @apiVersion 0.1.0
  * @apiName GetPendingAppointments
  * @apiGroup Appointments
  * @apiDescription Retrieves all appointments with a status of "pending" and associated appointment information.
  *
  * @apiSuccess {Number} id Unique ID of each appointment.
  * @apiSuccess {Date} appointment_date Date for which the appointment is scheduled.
  * @apiSuccess {Date} delivery_date Tentative delivery date, if any, for the appointment.
  * @apiSuccess {Number} confirmation_id Appointment confirmation number from the "appointments" table.
  * @apiSuccess {Number} appointment_slot_id Unique ID corresponding to an entry in the "appointment_slots" table.
  * @apiSuccess {String} appointment_type Appointment type - corresponds to an entry in the "appointment_types" table.
  * @apiSuccess {String} start_time Appointment start time - corresponds to the "appointment_slot_id" row in the "appointment_slots" table.
  * @apiSuccess {Number} agency_id Unique ID of the agency associated with each appointment.
  * @apiSuccess {String} name Name of the agency associated with each appointment.
  * @apiSuccess {Number} user_id Unique ID of the user associated with each appointment.
  * @apiSuccess {String} user_fist First name of the user associated with each appointment.
  * @apiSuccess {String} user_last Last name of the user associated with each appointment.
  * @apiSuccess {Number} client_id Unique ID of the client associated with each appointment.
  * @apiSuccess {String} client_fist First name of the client associated with each appointment.
  * @apiSuccess {String} client_last Last name of the client associated with each appointment.
  * @apiSuccess {Number} status_id Unique ID corresponding to an entry in the "statuses" table.
  * @apiSuccess {String} status Appointment status - corresponds to the "status_id" row in the "statuses" table.
  *
  * @apiErrorExample {json} Get Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/pending', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var status = 'pending';
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database on /appointments/pending GET route:', err);
        res.sendStatus(500);
      } else { // we connected
        database.query('SELECT "appointments"."id", "appointments"."appointment_date", "appointments"."delivery_date", "appointments"."confirmation_id", "appointments"."appointment_slot_id", "appointment_types"."appointment_type",  "locations"."location" AS "location_name", "delivery_methods"."delivery_method", "appointment_slots"."start_time", "appointment_slots"."end_time", "users"."agency_id", "agencies"."name", "appointments"."user_id", "users"."first" AS "user_first", "users"."last" AS "user_last", "appointments"."client_id", "clients"."first" AS "client_first", "clients"."last" AS "client_last", "appointments"."status_id", "statuses"."status" ' +
                        'FROM "appointments" ' +
                        'JOIN "appointment_slots" ON "appointments"."appointment_slot_id" = "appointment_slots"."id" ' +
                        'JOIN "appointment_types" ON "appointment_slots"."appointment_type_id" = "appointment_types"."id" ' +
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                        'JOIN "users" ON "appointments"."user_id" = "users"."id" ' +
                        'JOIN "agencies" ON "users"."agency_id" = "agencies"."id" ' +
                        'JOIN "clients" ON "appointments"."client_id" = "clients"."id" ' +
                        'JOIN "statuses" ON "appointments"."status_id" = "statuses"."id" ' +
                        'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
                        'WHERE "status_id" = (SELECT "id" FROM "statuses" WHERE "status" = $1);',
                       [status],
          function(queryErr, result) { // query callback
            done(); // release connection to the pool
            if (queryErr) {
              console.log('error making query on /appointments/pending GET route:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('successful GET from /appointments/pending route:', result.rows);
              var pendingAppointmentsArray = result.rows;
              pendingAppointmentsArray.forEach(function(appointmentObj) {
                appointmentObj.start_time = formatTimeForClient(appointmentObj.start_time);
                appointmentObj.end_time = formatTimeForClient(appointmentObj.end_time);
              });
              res.send(pendingAppointmentsArray);
            }
          }); // end query callback
        } // end if-else
      }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {get} /appointments/:appointment_id Get a Specific Appointment
  * @apiVersion 0.1.0
  * @apiName GetAppointment
  * @apiGroup Appointments
  * @apiDescription Gets specified appointment from the database.
  *
  * @apiParam {Number} appointment_id Unique ID of the appointment in the "appointments" table.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Delete Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/:appointment_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_id = req.params.appointment_id;
    console.log('getting appointment details for ', appointment_id);
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('SELECT "appointments"."id" AS "appointment_id", "appointments"."confirmation_id",' +
        '"appointments"."created_date", "appointments"."appointment_date",' +
        '"appointments"."delivery_date", "statuses"."status",' +
        '"appointments"."appointment_slot_id", "appointment_types"."appointment_type",' +
        '"days"."name" AS "day", "delivery_methods"."delivery_method",' +
        '"locations"."location" AS "location_name", "appointment_slots"."start_time",' +
        '"appointment_slots"."end_time", "appointments"."user_id",' +
        '"users"."email" AS "user_email", "users"."first" AS "user_first",' +
        '"users"."last" AS "user_last", "users"."day_phone" AS "user_day_phone",' +
        '"users"."ext" AS "user_day_phone_ext", "users"."agency_id",' +
        '"agencies"."name" AS "agency_name", "agencies"."bridging_agency_id",' +
        '"agencies"."primary_first", "agencies"."primary_last",' +
        '"agencies"."primary_job_title", "agencies"."primary_business_phone",' +
        '"agencies"."primary_business_phone_ext", "agencies"."primary_email",' +
        '"appointments"."client_id", "clients"."first" AS "client_first",' +
        '"clients"."last" AS "client_last", "clients"."dob" AS "client_dob",' +
        '"clients"."street", "clients"."city", "clients"."state",' +
        '"clients"."zip_code", "race_ethnicity"."race_ethnicity" ' +
                        'FROM "appointments" ' +
                        'JOIN "statuses" ON "statuses"."id" = "appointments"."status_id" ' +
                        'JOIN "appointment_slots" ON "appointment_slots"."id" = "appointments"."appointment_slot_id" ' +
                        'JOIN "appointment_types" ON "appointment_types"."id" = "appointment_slots"."appointment_type_id" ' +
                        'JOIN "days" ON "days"."id" = "appointment_slots"."day_id" ' +
                        'JOIN "delivery_methods" ON "delivery_methods"."id" = "appointment_slots"."delivery_method_id" ' +
                        'JOIN "locations" ON "locations"."id" = "appointment_slots"."location_id" ' +
                        'JOIN "users" ON "users"."id" = "appointments"."user_id" ' +
                        'JOIN "agencies" ON "agencies"."id" = "users"."agency_id" ' +
                        'JOIN "clients" ON "clients"."id" = "appointments"."client_id" ' +
                        'LEFT JOIN "race_ethnicity" ON "race_ethnicity"."id" = "clients"."race_ethnicity_id" ' +
                        'WHERE "appointments"."id" = $1;', [appointment_id],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful GET from /appointments/:appointment_id', result);
              console.log('result.rows =', result.rows);
              console.log('result.rows[0] =', result.rows[0]);
              var apptInfo = formatSingleAppointment(result.rows[0]);
              res.send(apptInfo);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

/**
  * @api {put} /appointments/update/:appointment_id/:status Update Appointment Status
  * @apiVersion 0.1.0
  * @apiName UpdateAppointmentStatus
  * @apiGroup Appointments
  * @apiDescription Updates status of an appointment in database
  *
  * @apiParam {Number} appointment_id Mandatory Unique ID of the appointment being updated.
  * @apiParam {String} status Mandatory Status the appointment should be set to - corresponds to entry in the "statuses" table
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/update/:appointment_id/:status', function(req, res) {
  console.log('params', req.params);
  var appointment_id = req.params.appointment_id;
  var status = req.params.status;
    pool.connect(function(err, database, done) {
    if (err) { // connection error
      console.log('error connecting to the database:', err);
      res.sendStatus(500);
    } else { // we connected
      database.query('UPDATE "appointments" ' +
                      'SET "status_id" = (SELECT "id" FROM "statuses" WHERE "status" = $2) ' +
                      'WHERE "id" = $1;',
                      [appointment_id, status],
        function(queryErr, result) { // query callback
          done(); // release connection to the pool
          if (queryErr) {
            console.log('error making query on /appointments/update/:appointment_id/:status PUT', queryErr);
            res.sendStatus(500);
          } else {
            console.log('successful update in "appointments"', result);
            res.sendStatus(200);
          }
        }); // end query
      } // end if-else
    }); // end pool.connect
});

/**
  * @api {put} /appointments/update/deliverydate Update Appointment Delivery Date
  * @apiVersion 0.1.0
  * @apiName UpdateAppointmentDeliveryDate
  * @apiGroup Appointments
  * @apiDescription Updates delivery date of an appointment in the database.
  *
  * @apiParam {Number} appointment_id Mandatory Unique ID of the appointment being updated.
  * @apiParam {Date} delivery_date Mandatory Delivery date of the appointment.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Not found error
  *    HTTP/1.1 404 Not found
*/
router.put('/update/deliverydate', function(req, res) {
  console.log('Update Delivery Date: ', req.body);
  var appointment_id = req.body.appointment_id;
  var delivery_date = formatDateForPostgres(req.body.delivery_date);
    pool.connect(function(err, database, done) {
    if (err) { // connection error
      console.log('error connecting to the database:', err);
      res.sendStatus(500);
    } else { // we connected
      database.query('UPDATE "appointments" ' +
                      'SET "delivery_date" = $2 ' +
                      'WHERE "id" = $1;',
                      [appointment_id, delivery_date],
        function(queryErr, result) { // query callback
          done(); // release connection to the pool
          if (queryErr) {
            console.log('error making query on /appointments/update/deliverydate PUT', queryErr);
            res.sendStatus(500);
          } else {
            console.log('successful update in "appointments"', result);
            res.sendStatus(200);
          }
        }); // end query
      } // end if-else
    }); // end pool.connect
});

/**
  * @api {delete} /appointments/:appointment_id Delete Appointment
  * @apiVersion 0.1.0
  * @apiName DeleteAppointment
  * @apiGroup Appointments
  * @apiDescription Deletes specified appointment from the database.
  *
  * @apiParam {Number} appointment_id Unique ID of the appointment in the "appointments" table.
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  * @apiErrorExample Delete Error:
  *    HTTP/1.1 500 Internal Server Error
*/
router.delete('/:appointment_id', function(req, res) {
  if (req.isAuthenticated()) { // user is authenticated
    var appointment_id = req.params.appointment_id;
    pool.connect(function(err, database, done) {
      if (err) { // connection error
        console.log('error connecting to the database:', err);
      } else { // we connected
        database.query('DELETE FROM "appointments" WHERE "id" = $1;', [appointment_id],
          function(queryErr, result) { // query callback
            done();
            if (queryErr) {
              console.log('error making query:', queryErr);
              res.sendStatus(500);
            } else {
              console.log('sucessful deletion from /appointments/:appointment_id', result);
              res.sendStatus(200);
            }
        }); // end query callback
      } // end DB connection if-else
    }); // end pool.connect
  } else { // user not authenticated
    res.sendStatus(401);
  }
});

// END ADMIN-ONLY APPOINTMENT ROUTES

module.exports = router;
