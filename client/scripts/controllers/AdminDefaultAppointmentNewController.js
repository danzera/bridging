angular
  .module('myApp')
  .controller('AdminDefaultAppointmentNewController', ['$http', '$location', 'UserService',
      function($http, $location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.locations = UserService.locations;
  vm.getLocations = UserService.getLocations;
  vm.days = UserService.days;
  vm.getDays = UserService.getDays;
  vm.types = UserService.types;
  vm.getTypes = UserService.getTypes;
  vm.methods = UserService.methods;
  vm.getMethods = UserService.getMethods;
  vm.init = init;
  vm.default = {};
  vm.createDefault = createDefault;

//Initializes all get routes to populate the form for creating a
//default appointment slot
  function init() {
    vm.getLocations();
    vm.getDays();
    vm.getTypes();
    vm.getMethods();
  }

  //Creates/Posts a default appointment slot
  function createDefault() {
    console.log('Button to create default clicked: ', vm.default);
    $http.post('/schedule/default', vm.default).then(function() {
      $location.path('/admin-appointments-default');
      alert('The new DEFAULT Appointment Slot has been added.');
    });
  }

}]);
