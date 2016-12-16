'use strict';

/**
 * @ngdoc function
 * @name smileyPlantApp.controller:UsercontrollerCtrl
 * @description
 * # UsercontrollerCtrl
 * Controller of the smileyPlantApp
 */
 angular.module('smileyPlantApp')
 	.controller('UsercontrollerCtrl', ['userManager', 
 		function(userManager){
	 		var vm = this;
	 		vm.heading = "Water your plants";
	 		
	 		var promise = userManager.loadUserData();
	 		promise.then(function(data){
	 			vm.userdata = data;
	 			console.log('added user data to $scope' + data.user_name + ', ' + data.email);
	 			console.log('auth: ' + userManager.isAuthenticated());
	 		},function(){
	 			console.log('error in UsercontrollerCtrl');
	 		});

 	}]);