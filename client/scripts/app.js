'use strict';

/**
 * @ngdoc overview
 * @name IcandoitApp
 * @description
 * # IcandoitApp
 *
 * Main module of the application.
 */
angular
  .module('IcandoitApp', [ 'ngResource', 'ui.router', 'ngDialog', 'lbServices' ])
  .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html'
                    }

                }
            })
            .state('skills', {
                url:'/skills',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content':{
                        templateUrl : 'views/skills.html',
                        controller  : 'SkillsCtrl'
                    }
                }
            })
            .state('achievements', {
                url:'/achievements',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content':{
                        templateUrl : 'views/achievements.html',
                        controller  : 'AchievmentsCtrl'
                    }
                }
            });

            $urlRouterProvider.otherwise('/');
    });
