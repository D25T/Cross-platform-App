angular.module('app.filters', [])
.filter('dateToISO', function() {
	return function(date) {
		date = new Date(date).toISOString();
		return date;
	};
});