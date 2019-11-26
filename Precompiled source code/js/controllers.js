angular.module('app.controllers', [])

.controller('AppCtrl', function($scope) {})

.controller('EventsCtrl', function($scope, Events, $timeout) {

  $scope.refresh = function() {
  	$timeout(function() {
      Events.getAll().then(function(events) {
        $scope.events = events;
        $scope.$broadcast('scroll.refreshComplete');
      });
  	}, 1000);
  };

  $scope.refresh();

})

.controller('EventCtrl', function($scope, $stateParams, $ionicModal, $translate, $filter, $cordovaCalendar, Events, Popup) {

  $scope.event = Events.get($stateParams.eventId);

  $scope.openMap = function(location) {
  	$ionicModal.fromTemplateUrl('templates/map.html', {
  		scope: $scope,
  		animation: 'slide-in-up'
  	}).then(function(map) {
      $scope.markerProperties = {
        balloonContentHeader: $scope.event.title,
        balloonContentBody: $scope.event.location,
        balloonContentFooter: $translate.instant('STARTS') + ' ' + $filter('date')(new Date($scope.event.starts), 'd.M.yyyy, H:mm') + '<br>' + $translate.instant('ENDS') + ' ' + $filter('date')(new Date($scope.event.ends), 'd.M.yyyy, H:mm')
      };
      $scope.mapCenter = [55.75396, 37.620393];
      $scope.mapZoom = 8;
  		$scope.map = map;
  		$scope.map.show();
  	});
  };

  $scope.closeMap = function() {
  	$scope.map.remove();
  };

  $scope.contactOrganizer = function() {
    cordova.plugins.email.open({
      to: $scope.event.contactEmail,
      subject: $scope.event.title
    });
  };

  $scope.addToCalendar = function() {
    $cordovaCalendar.createEvent({
      title: $scope.event.title,
      location: $scope.event.location,
      notes: $scope.event.shortDescription,
      startDate: new Date($scope.event.starts),
      endDate: new Date($scope.event.ends)
    }).then(function(result) {
      Popup.alert($translate.instant('CALENDAR_EVENT_ADDED_SUCCESSFULY'));
    }, function(error) {
      Popup.error($translate.instant('CALENDAR_EVENT_ADD_ERROR'));
    });
  };

})

.controller('SettingsCtrl', function($scope, $translate) {

  $scope.settings = {
    language: $translate.use()
  };

  $scope.changeLanguage = function() {
    $translate.use($scope.settings.language);
  };
  
});
