'use strict';

/**
 * @ngdoc function
 * @name IcandoitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the IcandoitApp
 */
angular.module('IcandoitApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {

      $scope.loginData = $localStorage.getObject('userinfo','{}');

      $scope.doLogin = function() {
          if($scope.rememberMe)
             $localStorage.storeObject('userinfo',$scope.loginData);

          AuthService.login($scope.loginData);

          ngDialog.close();

      };

      $scope.openRegister = function () {
          ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
      };

  }])

 .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {

      $scope.register={};
      $scope.loginData={};

      $scope.doRegister = function() {

          AuthService.register($scope.registration);

          ngDialog.close();

      };
 }])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthService', function ($scope, $state, $rootScope, ngDialog, AuthService) {

      $scope.loggedIn = false;
      $scope.username = '';

      if(AuthService.isAuthenticated()) {
          $scope.loggedIn = true;
          $scope.username = AuthService.getUsername();
      }

      $scope.openLogin = function () {
          ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:'LoginController' });
      };

      $scope.logOut = function() {
         AuthService.logout();
          $scope.loggedIn = false;
          $scope.username = '';
      };

      $rootScope.$on('login:Successful', function () {
          $scope.loggedIn = AuthService.isAuthenticated();
          $scope.username = AuthService.getUsername();
      });

      $rootScope.$on('registration:Successful', function () {
          $scope.loggedIn = AuthService.isAuthenticated();
          $scope.username = AuthService.getUsername();
      });

      $scope.stateis = function(curstate) {
         return $state.is(curstate);
      };

  }])

.controller('AchievmentsCtrl', ['$scope', '$rootScope', 'Customer', 'Achievement', 'ngDialog', function ($scope, $rootScope, Customer, Achievement, ngDialog) {
    $scope.showContent = false;
    $scope.message = "Loading ...";


    function toDate(dateStr) {
        var parts = dateStr.split("/");
        return new Date(parts[2], parts[0]-1, parts[1]);
    }

    function getAchievements() {
        if ($rootScope.currentUser) {
        Customer.achievements({id:$rootScope.currentUser.id, "filter":
            {"include":{"relation":"skills"}}
            })
            .$promise.then(
            function (response) {
                $scope.achievements = response;
                console.log("Got achievements from server: ", $scope.achievements)
                $scope.showContent = true;
                //$scope.directions[0].profiles[0].competences[0].skills[0].exp = 100;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        }
        else{
            $scope.message = "You are not logged in"
        }
    };
    getAchievements()

    $scope.addNewAchievement = function (){
        $scope.editingAchievement = false;
        $scope.newAchiv = {};
        ngDialog.open({ template: 'views/newachiv.html', scope: $scope, className: 'ngdialog-theme-default', controller:"AchievmentsCtrl" });
        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            console.log('ngDialog opened: ' + $dialog.attr('id'));
            $( function() {
              $( "#datepicker" ).datepicker();
            } );
        });

    };
    $scope.editAchievement = function (achiv){
        $scope.editingAchievement = true;
        $scope.newAchiv = {name:achiv.name, id:achiv.id };
        ngDialog.open({ template: 'views/newachiv.html', scope: $scope, className: 'ngdialog-theme-default', controller:"AchievmentsCtrl" });
        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            console.log('ngDialog opened: ' + $dialog.attr('id'));
            $( function() {
              $( "#datepicker" ).datepicker();
//              $( "#datepicker" ).datepicker({ dateFormat: 'dd-mm-yy' });
//              $( "#datepicker" ).datepicker('setDate', new Date(2008,9,3));
            } );
        });

    }
    ;$scope.postAchievement = function() {
          console.log($scope.newAchiv);
          console.log(toDate($scope.newAchiv.date));
        if(!$scope.editingAchievement){
          Customer.achievements.create({id:$rootScope.currentUser.id}, {"name":$scope.newAchiv.name, "date":toDate($scope.newAchiv.date)})
            .$promise.then(
            function (response) {
                console.log("Achievement created:  ", response)
                getAchievements();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        } else {
             Customer.achievements.updateById({id:$rootScope.currentUser.id, fk:$scope.newAchiv.id}, {"name":$scope.newAchiv.name, "date":toDate($scope.newAchiv.date)})
            .$promise.then(
            function (response) {
                console.log("Achievement updated:  ", response)
                getAchievements();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        }
          ngDialog.close();
    };
    $scope.removeAchievement = function(achiv){
        if(confirm("Removing achievement: "+achiv.name)){
        Customer.achievements.destroyById({id:$rootScope.currentUser.id, fk:achiv.id})
            .$promise.then(
            function (response) {
                console.log("Achievement deleted:  ", response)
                getAchievements();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    };

    }])

.controller('SkillsCtrl', ['$scope', '$rootScope', 'Customer', 'Competence', 'Skill', function ($scope, $rootScope, Customer, Competence, Skill) {
    $scope.showContent = false;
    $scope.message = "Loading ...";

    function getDirections() {
        if ($rootScope.currentUser) {
        Customer.directions({id:$rootScope.currentUser.id, "filter":
            {"include":{"relation":"profiles", "scope": {"include":{"relation":"competences","scope":{"include":"skills"}}}}}
            })
            .$promise.then(
            function (response) {
                $scope.directions = response;
                console.log("Got directions from server: ", $scope.directions)
                $scope.showContent = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        }
        else{
            $scope.message = "You are not logged in"
        }
    };
    getDirections()

    $scope.editCompetence = function(index) {
        //alert("Editing competence: "+ index);
        $scope.editingCompetence = index;
    };

    $scope.saveCompetence = function(competence) {
        //alert("Saving competence: "+ competence.id);
        Competence.prototype$updateAttributes({id: competence.id}, competence, function (instance) {
			console.log(instance);
		});
        competence.skills.forEach(function(entry){
            Skill.prototype$updateAttributes({id: entry.id}, entry, function (instance) {
			console.log(instance);
    		});
        });
        $scope.editingCompetence = null;
        getDirections();
    };

    $scope.addNewSkill = function(id){
        ("Adding new skill to competence "+id);
        var newName = prompt("Please enter name of the skill");
		if (newName) {
			Customer.skills.create({id:$rootScope.currentUser.id}, {"name":newName, "competenceId":id})
            .$promise.then(
            function (response) {
                console.log("Skill created:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
		};
    };

    $scope.removeSkill = function(id){
        if(confirm("Removing skill: "+id)){
		Customer.skills.destroyById({id:$rootScope.currentUser.id, fk:id})
            .$promise.then(
            function (response) {
                console.log("Skill deleted:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    };

    $scope.addNewCompetence = function(id){
        var newName = prompt("Please enter name of the competence");
		if (newName) {
			Customer.competences.create({id:$rootScope.currentUser.id}, {"name":newName, "profileId":id})
            .$promise.then(
            function (response) {
                console.log("Competence created:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
		};
    };

    $scope.removeCompetence = function(id){
        if(confirm("Removing competence: "+id)) {
		Customer.competences.destroyById({id:$rootScope.currentUser.id, fk:id})
            .$promise.then(
            function (response) {
                console.log("Competence deleted:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    };
    $scope.addNewProfile = function(direction){
        alert("Adding new profile to direction "+direction.name);
        var newName = prompt("Please enter name of the profile");
		if (newName) {
			Customer.profiles.create({id:$rootScope.currentUser.id}, {"name":newName, "directionId":direction.id})
            .$promise.then(
            function (response) {
                console.log("Profile created:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
		};
    };

    $scope.removeProfile = function(profile){
        if(confirm("Removing profile: "+profile.name)) {
		Customer.profiles.destroyById({id:$rootScope.currentUser.id, fk:profile.id})
            .$promise.then(
            function (response) {
                console.log("Profile deleted:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    };

    $scope.addNewDirection = function(){
        var newName = prompt("Please enter name of the direction");
		if (newName) {
			Customer.directions.create({id:$rootScope.currentUser.id}, {"name":newName})
            .$promise.then(
            function (response) {
                console.log("Direction created:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
		};
    };

    $scope.removeDirection = function(direction){
        if(confirm("Removing direction: "+direction.name)) {
		Customer.directions.destroyById({id:$rootScope.currentUser.id, fk:direction.id})
            .$promise.then(
            function (response) {
                console.log("Direction deleted:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    };

    $scope.editDirection = function(id){
        var newName = prompt("Please enter name of the direction");
        if (newName) {
            Customer.directions.updateById({id:$rootScope.currentUser.id, fk: id}, {"name":newName})
            .$promise.then(
            function (response) {
                console.log("Direction updated:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    }

    $scope.editProfile = function(id){
        var newName = prompt("Please enter new name of the profile");
        if (newName) {
            Customer.profiles.updateById({id:$rootScope.currentUser.id, fk: id}, {"name":newName})
            .$promise.then(
            function (response) {
                console.log("Profile updated:  ", response)
                getDirections();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            });
        };
    }


    $scope.log = function(){
        console.log($scope.data);
    };
}])

;
