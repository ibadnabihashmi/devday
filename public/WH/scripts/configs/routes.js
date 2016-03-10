angular.module('DD').config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/account', {
            templateUrl: '/WH/views/account/profile.html'
        })
        .when('/controlPanel', {
            templateUrl: '/WH/views/controlPanel/cpanel.html'
        })
        .when('/account/shop', {
            templateUrl: '/WH/views/account/shop.html'
        })
        .when('/account/masterpiece', {
            templateUrl: '/WH/views/account/masterpiece.html'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});