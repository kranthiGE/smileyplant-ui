'use strict';

/**
 * @ngdoc function
 * @name smileyPlantApp.controller:DeviceControllerCtrl
 * @description
 * # DeviceControllerCtrl
 * Controller of the smileyPlantApp
 */
 angular.module('smileyPlantApp')
 	.controller('DeviceconrollerCtrl', ['deviceManager', 
 		function(deviceManager){ 			
 			console.log("hi");
 			var vm = this;

 			var promise = deviceManager.getDeviceData();
	 		promise.then(function(data){
	 			vm.devicedata = data;
	 			console.log('device data retrieved: ' + data);
	 		},function(){
	 			console.log('error in retrieving device data');
	 		});
 	}]);