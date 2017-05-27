angular
  .module('myApp')
  .controller('AdminDefaultEditController', ['UserService',
      function(UserService) {
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
  vm.defaultSlot = UserService.defaultSlot;
  vm.viewDefaultSlot = UserService.viewDefaultSlot;
  // vm.updateDefaultSlot = updateDefaultSlot;

}]);
