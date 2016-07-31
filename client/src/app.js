import angular from 'angular'
import 'angular-ui-router'

angular.module('olympics',["ui.router"])
.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise('/sports');

  $stateProvider
  .state('sports', {
    url: '/sports',
    templateUrl: 'sports/sports-nav.html',
    resolve: {
      sportsService: function($http){
        return $http.get('/sports');
      }
    },
    controller: function(sportsService,$location){
      this.sports = sportsService.data;

      this.isActive = function(sport){
        let pathRegex = /sports\/(\w+)/;
        let match = pathRegex.exec($location.path());
        if (match === null || match.length === 0) return false;
        let selectedSportName = match[1];
        return sport === selectedSportName;
      }
    },
    controllerAs: 'sportsCtrl'
  })
  .state('sports.medals',{
    url: '/:sportsName',
    templateUrl: 'sports/sports-medals.html',
    resolve: {
      sportService: function($http, $stateParams){
        return $http.get('/sports/'+$stateParams.sportsName);
      }
    },
    controller: function(sportService){
      this.sport = sportService.data;
    },
    controllerAs: 'sportCtrl'
  })
  .state('sports.new', {
    url: '/:sportsName/medal/new',
    templateUrl: 'sports/new-medal.html',
    controller: function($stateParams, $state, $http){
      this.sportsName = $stateParams.sportsName;
      this.saveMedal = function(medal){
        $http({method: 'POST', url: 'sports/'+this.sportsName+'/medals', data: {medal}}).then(function(){
          $state.go('sports.medals',{sportsName: $stateParams.sportsName});
        })
      };
    },
    controllerAs: 'newMedalCtrl'
  })
})
