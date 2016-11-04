'use strict';

/**
 * @ngdoc service
 * @name smileyPlantApp.userManager
 * @description
 * # userManager
 * Service in the smileyPlantApp.
 */
angular
	.module('smileyPlantApp')
	.service('userManager', ['$http', '$window', '$q', function($http, $window, $q){
	
	var userAuthenticated = false;
	var user;
		
	this.loadUserData = function(){
		var defer = $q.defer();
		var httpPromise = $http.get('/userinfo');//scripts/user.json
		/*var httpPromise = $http({
			method: 'GET',
			url: '/userinfo'
		}).then(function successCallback(response){
			console.log(response);
			userAuthenticated = true;
		}, function errorCallback(response){
			$window.location = '/login';
		});*/

		httpPromise.then(function(result){
			var data = result.data;
			user = data;
			userAuthenticated = true;
			defer.resolve(user);
		}, function(err){
			$window.location = '/login';
		});
		return defer.promise;
	};

	this.isAuthenticated = function(){
		return userAuthenticated;
	};

}]);