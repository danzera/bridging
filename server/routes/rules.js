var express = require('express');
var router = express.Router();
/**
  * @api {get} /rules/zip/:zip_code Get locations for ZIP code
  * @apiVersion 0.1.0
  * @apiName GetZipLocation
  * @apiGroup Rules
  * @apiDescription Determines which location(s) should be available to a user
  *    given the client's ZIP code
  *
  * @apiParam {Number} zip_code   ZIP code of client seeking appointment
  * @apiSuccess {Object[]} locations   Array of location objects representing
  *    the Bridging locations at which the user is permitted make an appointment
  * @apiSuccess {Object} locations.location   Object containing the location's name and address
  * @apiSuccess {String} locations.location.name   Name of location ("Bloomington
  *    or Roseville")
  * @apiSuccess {String} locations.location.address   Address of location
  * @apiSuccessExample {json} Success-Response:
  *    HTTP/1.1 200 OK
  *    [
  *      {
  *        "name": "Roseville",
  *        "address": "1730 Terrace Dr, Roseville, MN",
  *      }
  *    ]
  * @apiErrorExample {json} List error
  *    HTTP/1.1 500 Internal Server Error
*/
router.get('/zip/:zip_code', function(req, res) {
  // TODO: add code
});

module.exports = router;
