/**
 * Controller For caseworker-appointment-new
 * @module caseworker/new-appointment
 */
angular
  .module('myApp')
  .controller('CaseworkerAppointmentNewController', ['$location', '$mdDialog', 'CONSTANTS', 'UserService', function($location, $mdDialog, CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.CONSTANTS = CONSTANTS;

  // methods
  vm.selectDeliveryType = selectDeliveryType;

  activate();

  function activate() {
    if (UserService.userObject.user.agency_access_disabled || UserService.userObject.user.user_access_disabled) {
      accessDisabledDialog();
      $location.path('/caseworker-appointments-all');
    }
  }
  /**
   * This should call a method on the Appointment Object in the UserService
   * It will set the appointment_type property on the Appointment object
   * Then the user will be redirected to the next page by setDeliveryRedirect
   *
   * @function selectDeliveryType
   * @param {string} delivery_method Should be constant from the [CONSTANTS]{@link services/CONSTANTS} service.
   */
  function selectDeliveryType(delivery_method) {
    console.log(delivery_method);
    UserService.newAppointment.setDeliveryType(delivery_method);
    console.log(UserService.newAppointment);
    setDeliveryRedirect(delivery_method);
  }

  /**
   * Redirects the caseworker to the appropriate next step in the appointment creation process
   * @function setDeliveryRedirect
   * @param {string} delivery_method Should be constant from the [CONSTANTS]{@link services/CONSTANTS} service.
   */
  function setDeliveryRedirect(delivery_method) {
    if (delivery_method === CONSTANTS.DELIVERYMETHOD_PICKUP) {
      $location.path('/caseworker-appointment-location');
    }
    else {
      $location.path('/caseworker-appointment-zipcode');
    }
  }

  function accessDisabledDialog() {
    $mdDialog.show(
     $mdDialog.alert()
       .clickOutsideToClose(true)
       .title('Your Account Has Been Disabled')
       .textContent('Please contact Bridging For More Information')
       .ariaLabel('Access Disabled Alert')
       .ok('Okay')
   );
  }
}]);
