angular.module('myApp')
  .constant('CONSTANTS', {
    APPOINTMENT_STATUS_CANCELED: 'canceled',
    APPOINTMENT_STATUS_PENDING: 'pending',
    APPOINTMENT_STATUS_CONFIRMED: 'confirmed',
    APPOINTMENT_TYPE_SHOPPING: 'shopping',
    APPOINTMENT_TYPE_BED: 'new bed',
    DELIVERYMETHOD_PICKUP: 'pickup',
    DELIVERYMETHOD_DELIVERY: 'delivery',
    LOCATION_BLOOMINGTON: {
      location_id: 1,
      location_name: 'Bloomington',
      street: '201 W 87th St.',
      city: 'Bloomington',
      state: 'MN',
      zip_code: '55420'
    },
    LOCATION_ROSEVILLE: {
      location_id: 2,
      location_name: 'Roseville',
      street: '1730 Terrace Dr.',
      city: 'Roseville',
      state: 'MN',
      zip_code: '55113'
    },
    USER_TYPE_ADMIN: 1,
    USER_TYPE_CASEWORKER: 2

});
