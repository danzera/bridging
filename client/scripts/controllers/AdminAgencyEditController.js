angular
  .module('myApp')
  .controller('AdminAgencyEditController', ['$http', '$location', '$mdDialog',
      '$document', 'UserService',
      function($http, $location, $mdDialog, $document, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agency = UserService.agency;
  vm.viewAgency = UserService.viewAgency;
  vm.editAgency = editAgency;
  vm.deleteAgency = deleteAgency;

  //Saves edits made to Agency record in the admin-agency-edit view
  function editAgency(agency) {
    console.log('Save changes clicked: ', agency);
    $http.put('/agencies/', agency).then(function() {
      console.log('saves edits', agency);
      $location.path('/admin-agency-overview');
      alert('Your edits to ' + agency.name + ' have been saved.');
    });
  }

//Deletes selected Agency from the admin-agency-edit view
  function deleteAgency(agency) {
    console.log('Delete clicked: ', agency);
    if(confirm('Are you sure you want to delete ' + agency.name + '?')) {
      $http.delete('/agencies/' + agency.id).then(function() {
        console.log('Deleted Agency: ', agency.id);
        $location.path('/admin-agency-overview');
        alert(agency.name + ' has been deleted.');
        });
    } else {
      $location.path('/admin-agency-edit');
    }
  }

}]);
