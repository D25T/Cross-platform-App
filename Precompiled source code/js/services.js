angular.module('app.services', [])

.service('Popup', function($ionicPopup, $translate) {
	
	this.error = function(text) {
		$ionicPopup.alert({
			title: $translate.instant('ERROR'),
			subTitle: text,
			okType: 'button-royal'
		});
	};

	this.alert = function(text) {
		$ionicPopup.alert({
			title: $translate.instant('SUCCESS'),
			subTitle: text,
			okType: 'button-royal'
		});
	};

})

.service('Events', function($http, $q, $translate, Popup) {

	var events;

	this.getAll = function() {
		function loadEventsRu() {
			$http.get('http://ec2-52-28-56-159.eu-central-1.compute.amazonaws.com/ru/').then(function(response) {
				events = response.data;
				deferred.resolve(response.data);
			}, function(error) {
				Popup.error('Не удаётся установить связь с сервером.');
				deferred.resolve();
			});
		}

		function loadEventsEn() {
			$http.get('http://ec2-52-28-56-159.eu-central-1.compute.amazonaws.com/en/').then(function(response) {
				events = response.data;
				deferred.resolve(response.data);
			}, function(error) {
				Popup.error('Can not connect to the server.');
				deferred.resolve();
			});
		}

		var deferred = $q.defer();

		if ($translate.use() === 'ru') {
			loadEventsRu();
		} else {
			loadEventsEn();
		}

		return deferred.promise;
	};

	this.get = function(eventId) {
		for (var i = events.length - 1; i >= 0; i--) {
			if (events[i].id === parseInt(eventId)) {
				return events[i];
			}
		}
		return null;
	};
});