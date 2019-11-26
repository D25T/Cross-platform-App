angular.module('app.config', [])

.config(function($ionicConfigProvider) {
	$ionicConfigProvider.backButton.previousTitleText(false).text('');
});