'use strict';

/**
 * @ngdoc service
 * @name smileyPlantApp.deviceManager
 * @description
 * # deviceManager
 * Service in the smileyPlantApp.
 */
angular
	.module('smileyPlantApp')
	.service('deviceManager', ['$http', '$window', '$q', function($http, $window, $q){
	var device;

	this.getDeviceData = function(){
		var defer = $q.defer();
		var httpPromise = $http.get('/api/devicestate/Water Pump');//scripts/device.json');//
		httpPromise.then(function(result){
			var data = result.data;
			device = data;
			defer.resolve(device);
		}, function(err){
			console.log(err);
		});
		return defer.promise;
	};

	this.startDevice = function(){
		$http.post('/api/start', {}).success(function(response){
			console.log(response);
		}).error(function(err){
			console.log(err);
		});
	};

	this.stopDevice = function(){
		$http.post('/api/stop', {}).success(function(response){
			console.log(response);
		}).error(function(err){
			console.log(err);
		});
	};

}]);