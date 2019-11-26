angular.module('app.translate', ['pascalprecht.translate'])

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

	var translationsEN = {
		//Menu
		MENU: 'Menu',
		EVENTS: 'Events',
		SETTINGS: 'Settings',
		ABOUT: 'About',
		//Events
		REFRESH: 'Refresh...',
		STARTS: 'Starts',
		ENDS: 'Ends',
		DETAILS: 'Details',
		//Event
		CONTACT_ORGANIZER: 'Contact Organizer',
		ADD_TO_CALENDAR: 'Add to Calendar',
		//Map
		MAP: 'Map',
		//Settings
		LANGUAGE: 'Language',
		ENGLISH: 'English',
		RUSSIAN: 'Russian',
		//About
		APP_NAME: 'Higher School of Economics Events',
		COPYRIGHT: '© 2016 Higher School of Economics',
		DESCRIPTION: 'Project is being developed as part of "Tools of Programming" course',
		ADVISER: 'Adviser: Vostrikov A. V.',
		//Pupups
		ERROR: 'Error',
		SUCCESS: 'Success!',
		CALENDAR_EVENT_ADDED_SUCCESSFULY: 'The event has been added to your calendar.',
		CALENDAR_EVENT_ADD_ERROR: 'Can not create an event in your calendar.'
	};
	var translationsRU = {
		//Menu
		MENU: 'Меню',
		EVENTS: 'Мероприятия',
		SETTINGS: 'Настройки',
		ABOUT: 'О приложении',
		//Events
		REFRESH: 'Обновить...',
		STARTS: 'Начало:',
		ENDS: 'Окончание:',
		DETAILS: 'Подробнее',
		//Event
		CONTACT_ORGANIZER: 'Связаться с организатором',
		ADD_TO_CALENDAR: 'Добавить в календарь',
		//Map
		MAP: 'Карта',
		//Settings
		LANGUAGE: 'Язык',
		ENGLISH: 'Английский',
		RUSSIAN: 'Русский',
		//About
		APP_NAME: 'Мероприятия Высшей Школы Экономики',
		COPYRIGHT: '© 2016 Национальный Исследовательский Университет Высшая Школа Экономики',
		DESCRIPTION: 'Проект выполняется в рамках курса "Иснструментальные средства программирования"',
		ADVISER: 'Преподаватель: Востриков А. В.',
		//Popups
		ERROR: 'Ошибка',
		SUCCESS: 'Успех!',
		CALENDAR_EVENT_ADDED_SUCCESSFULY: 'Мероприятие было успешно добавлено в календарь.',
		CALENDAR_EVENT_ADD_ERROR: 'Не удаётся добавить мероприятие в календарь.'
	};

	$translateProvider
		.translations('en', translationsEN)
		.translations('ru', translationsRU)
		.preferredLanguage('ru')
		.fallbackLanguage('ru');
});

