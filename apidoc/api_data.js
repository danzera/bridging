define({ "api": [  {    "type": "delete",    "url": "/agencies/:agency_id",    "title": "Delete Agency",    "version": "0.1.0",    "name": "DeleteAgency",    "group": "Agencies",    "description": "<p>Deletes specified agency from the database.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "agency_id",            "description": "<p>Unique ID of the new agency.</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Delete Error:",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/agencies.js",    "groupTitle": "Agencies"  },  {    "type": "get",    "url": "/agencies",    "title": "Get All Agencies",    "version": "0.1.0",    "name": "GetAgencies",    "group": "Agencies",    "description": "<p>Retrieves all agencies high-leavel information from the &quot;agencies&quot; table of the database.</p>",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the agency.</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "bridging_agency_id",            "description": "<p>Agency ID from the Bridging Access Database.</p>"          },          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "access_disabled",            "description": "<p>Current agency status. True = access disabled.</p>"          }        ]      }    },    "error": {      "examples": [        {          "title": "Get Error:",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/agencies.js",    "groupTitle": "Agencies"  },  {    "type": "get",    "url": "/agencies/:agency_id",    "title": "Get One Agency",    "version": "0.1.0",    "name": "GetAgency",    "group": "Agencies",    "description": "<p>Retrieve a specific agency's information from the &quot;agencies&quot; table of the database.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "agency_id",            "description": "<p>Agency's unique ID that is stored in the database.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the agency.</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "bridging_agency_id",            "description": "<p>Agency ID from the Bridging Access Database</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "primary_first",            "description": "<p>First name of agency's primary contact.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "primary_last",            "description": "<p>Last name of agency's primary contact.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "primary_business_phone",            "description": "<p>Business phone number of agency's primary contact.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "primary_business_phone_ext",            "description": "<p>Business phone number extension of agency's primary contact.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "primary_mobile_phone",            "description": "<p>Mobile phone number of agency's primary contact.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "primary_email",            "description": "<p>E-mail address of agency's primary contact.</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "beds_allowed_option_id",            "description": "<p>Number corresponding to the &quot;beds_allowed_options&quot; table.</p>"          },          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "access_disabled",            "description": "<p>Current agency status. True = access disabled.</p>"          }        ]      }    },    "error": {      "examples": [        {          "title": "Get Error:",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/agencies.js",    "groupTitle": "Agencies"  },  {    "type": "post",    "url": "/agencies",    "title": "Add a New Agency",    "version": "0.1.0",    "name": "PostAgency",    "group": "Agencies",    "description": "<p>Adds a new agency's information to the &quot;agencies&quot; table in the database.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Mandatory Name of the new agency.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "bridging_agency_id",            "description": "<p>Mandatory Agency ID from the Bridging Access Database</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_first",            "description": "<p>Optional First name of new agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_last",            "description": "<p>Optional Last name of new agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_business_phone",            "description": "<p>Optional Business phone number of new agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_business_phone_ext",            "description": "<p>Optional Business phone number extension of new agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_mobile_phone",            "description": "<p>Optional Mobile phone number of new agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_email",            "description": "<p>Optional E-mail address of new agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "beds_allowed_option_id",            "description": "<p>Mandatory Number corresponding to the &quot;beds_allowed_options&quot; table.</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "optional": false,            "field": "access_disabled",            "description": "<p>Mandatory Current agency status. True = access disabled.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "agency_id",            "description": "<p>Unique ID of the new agency.</p>"          }        ]      }    },    "error": {      "examples": [        {          "title": "Post Error:",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/agencies.js",    "groupTitle": "Agencies"  },  {    "type": "put",    "url": "/agencies/:agency_id",    "title": "Update Agency",    "version": "0.1.0",    "name": "UpdateAgency",    "group": "Agencies",    "description": "<p>Updates specified properties for an agency.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of the agency.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "bridging_agency_id",            "description": "<p>Agency ID from the Bridging Access Database</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_first",            "description": "<p>First name of agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_last",            "description": "<p>Last name of agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_business_phone",            "description": "<p>Business phone number of agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_business_phone_ext",            "description": "<p>Business phone number extension of agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_mobile_phone",            "description": "<p>Mobile phone number of agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "primary_email",            "description": "<p>E-mail address of agency's primary contact.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "beds_allowed_option_id",            "description": "<p>Number corresponding to the &quot;beds_allowed_options&quot; table.</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "optional": false,            "field": "access_disabled",            "description": "<p>Current agency status. True = access disabled.</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Update Error:",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/agencies.js",    "groupTitle": "Agencies"  },  {    "type": "get",    "url": "/appointments/available",    "title": "Get Available Appointments",    "version": "0.1.0",    "name": "GetAvailableAppointments",    "group": "Appointments",    "description": "<p>Get appointment objects that match the parameters and still have available spots left</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Date",            "optional": false,            "field": "min_date",            "description": "<p>Earliest date in range to be checked</p>"          },          {            "group": "Parameter",            "type": "Date",            "optional": false,            "field": "max_date",            "description": "<p>Latest date in range to be checked</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "appointment_type",            "description": "<p>Type of appointment (&quot;shopping&quot; or &quot;new bed&quot;)</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "delivery_method",            "description": "<p>Method of delivery (&quot;delivery&quot; or &quot;pickup&quot;)</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "location_id",            "description": "<p>Unique ID of location (database ID for Bloomington or for Roseville)</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "appointments",            "description": "<p>Array of appointment objects</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "appointments.appointment_slot_id",            "description": "<p>Unique ID of appointment slot</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "appointments.date",            "description": "<p>Date of appointment</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.start_time",            "description": "<p>Start time of appointment</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.end_time",            "description": "<p>End time of appointment</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.appointment_type",            "description": "<p>Type of appointment (&quot;shopping&quot; or &quot;new bed&quot;)</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.delivery_method",            "description": "<p>&quot;delivery&quot; or &quot;pickup&quot;</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.location_name",            "description": "<p>Name of location (&quot;Bloomington&quot; or &quot;Roseville&quot;)</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.location_address",            "description": "<p>Address of location</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n[{\n  \"appointment_slot_id\": 3,\n  \"date\": \"June 9, 2017\",\n  \"start_time\": \"9:15 am\",\n  \"end_time\": \"10:15 am\",\n  \"appointment_type\": \"shopping\",\n  \"delivery_method\": \"pickup\",\n  \"location_name\": \"Bloomington\",\n  \"location_address\": \"201 W 87th St, Bloomington, MN\",\n}]",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "List error",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/appointments.js",    "groupTitle": "Appointments"  },  {    "type": "get",    "url": "/appointments/existing/:user_id",    "title": "Get User Appointments",    "version": "0.1.0",    "name": "GetUserAppointments",    "group": "Appointments",    "description": "<p>Get a user's existing appointments</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "user_id",            "description": "<p>User's unique ID</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "appointments",            "description": "<p>Array of appointment objects</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "appointments.id",            "description": "<p>Unique ID of appointment</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "appointments.client",            "description": "<p>Object with information about the client for whom the appointment was made</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.client.first",            "description": "<p>First name of client</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.client.last",            "description": "<p>Last name of client</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.client.address",            "description": "<p>Address of client</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "appointments.info",            "description": "<p>Object with information about the appointment</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "appointments.info.appointment_number",            "description": "<p>Number to identify appointment in Bridging's separate database</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.info.start_time",            "description": "<p>Start time of appointment</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.info.end_time",            "description": "<p>End time of appointment</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.info.appointment_type",            "description": "<p>Type of appointment (&quot;shopping&quot; or &quot;new bed&quot;)</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.info.location_name",            "description": "<p>&quot;Roseville&quot; or &quot;Bloomington&quot;</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "appointments.info.location_address",            "description": "<p>Address of location</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "appointments.info.date",            "description": "<p>Date of appointment</p>"          },          {            "group": "Success 200",            "type": "Date",            "optional": false,            "field": "appointments.info.delivery_date",            "description": "<p>Date of delivery (if applicable)</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n[{\n  \"id\": 1,\n  \"client\": {\n    \"first\": \"Jim\",\n    \"last\": \"Tolliver\",\n    \"address\": \"1400 Lizard Ln, St. Paul, MN\"\n  },\n  \"info\": {\n    \"appointment_number\" : 4590,\n    \"start_time\": \"9:15 am\",\n    \"end_time\": \"10:15 am\",\n    \"appointment_type\": \"shopping\",\n    \"delivery_method\": \"pickup\",\n    \"location_name\": \"Bloomington\",\n    \"location_address\": \"201 W 87th St, Bloomington, MN\",\n    \"appointment_date\": \"4/21/17\",\n    \"delivery_date\": \"4/22/17\"\n    \"status\": \"confirmed\",\n  },\n}]",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "List error",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/appointments.js",    "groupTitle": "Appointments"  },  {    "type": "post",    "url": "/appointments/reserve",    "title": "Make Appointment",    "version": "0.1.0",    "name": "MakeAppointment",    "group": "Appointments",    "description": "<p>Makes appointment &amp; saves to database</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Date",            "optional": false,            "field": "date",            "description": "<p>Date of appointment</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "start_time",            "description": "<p>Start time of appointment</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "end_time",            "description": "<p>End time of appointment</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "user_id",            "description": "<p>Unique id of user creating the appointment</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "client_id",            "description": "<p>Unique id of client for whom appointment was created</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "appointment_slot_id",            "description": "<p>Unique id of appointment slot</p>"          },          {            "group": "Parameter",            "type": "Date",            "optional": false,            "field": "appointment_date_added",            "description": "<p>Date on which appointment was created (current date)</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>Whether appointment is confirmed, canceled, or pending (should pass in pending)</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "appointment_id",            "description": "<p>Unique ID of appointment that has been created</p>"          }        ]      }    },    "error": {      "examples": [        {          "title": "List error",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/appointments.js",    "groupTitle": "Appointments"  },  {    "type": "put",    "url": "/appointments/existing",    "title": "Update Appointment",    "version": "0.1.0",    "name": "UpdateAppointment",    "group": "Appointments",    "description": "<p>Updates status of an appointment in database</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "appointment_id",            "description": "<p>Unique ID of appointment</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>Status of appointment (&quot;confirmed&quot;, &quot;pending&quot;, or &quot;canceled&quot;)</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Not found error",          "content": "HTTP/1.1 404 Not found",          "type": "json"        }      ]    },    "filename": "server/routes/appointments.js",    "groupTitle": "Appointments"  },  {    "type": "post",    "url": "/clients",    "title": "Add a client",    "version": "0.1.0",    "name": "PostClient",    "group": "Clients",    "description": "<p>Saves a client's information to database</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "first",            "description": "<p>First name of client</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "last",            "description": "<p>Last name of client</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "address",            "description": "<p>Address of client</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "client_id",            "description": "<p>Unique ID of client that has been added</p>"          }        ]      }    },    "error": {      "examples": [        {          "title": "Post error",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/clients.js",    "groupTitle": "Clients"  },  {    "type": "put",    "url": "/clients/:client_id",    "title": "Update client",    "version": "0.1.0",    "name": "UpdateClient",    "group": "Clients",    "description": "<p>Changes specified properties for a client and changes them to new values</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Object[]",            "optional": false,            "field": "updates",            "description": "<p>Array of objects with updates to properties of the client</p>"          },          {            "group": "Parameter",            "type": "Object",            "optional": false,            "field": "updates.update",            "description": "<p>Update object</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "update.key",            "description": "<p>Property of client to be updated (e.g &quot;first&quot;)</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "update.value",            "description": "<p>New value for property (e.g. &quot;Vivian&quot;)</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n   updates: [\n    {\n      \"key\": \"first\",\n      \"value\": \"Vivian\"\n    },\n    {\n      \"key\": \"address\",\n      \"value\": \"1907 Glenwood Dr, Ham Lake, MN\"\n    }\n  ]\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "Not found error",          "content": "HTTP/1.1 404 Not found",          "type": "json"        }      ]    },    "filename": "server/routes/clients.js",    "groupTitle": "Clients"  },  {    "type": "get",    "url": "/rules/zip/:zip_code",    "title": "Get locations for ZIP code",    "version": "0.1.0",    "name": "GetZipLocation",    "group": "Rules",    "description": "<p>Determines which location(s) should be available to a user given the client's ZIP code</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "zip_code",            "description": "<p>ZIP code of client seeking appointment</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "locations",            "description": "<p>Array of location objects representing the Bridging locations at which the user is permitted make an appointment</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "locations.location",            "description": "<p>Object containing the location's name and address</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "locations.location.name",            "description": "<p>Name of location (&quot;Bloomington or Roseville&quot;)</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "locations.location.address",            "description": "<p>Address of location</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"name\": \"Roseville\",\n    \"address\": \"1730 Terrace Dr, Roseville, MN\",\n  }\n]",          "type": "json"        }      ]    },    "error": {      "examples": [        {          "title": "List error",          "content": "HTTP/1.1 500 Internal Server Error",          "type": "json"        }      ]    },    "filename": "server/routes/rules.js",    "groupTitle": "Rules"  }] });
