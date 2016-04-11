window.logVisualiser.controller('logListCtrl', ['$scope', '$state', '$stateParams', '$http',
  function($scope, $state, $stateParams, $http) {
    if (!$stateParams.uid) {
      return $state.go('login');
    }
    var PAGE_SIZE = 2;
    var uid = $stateParams.uid;

    $scope.endOfRecords = false;
    $scope.logs = [];
    var criteria = {};

    $scope.updateCriteria = function(level) {
      criteria = level? {level: level} : {};
      $scope.logs = [];
      $scope.endOfRecords = false;
      $scope.search();
    };

    $scope.search = function() {
      var filterParams = '';
      if (Object.keys(criteria).length > 0) {
        for (var key in criteria) {
          filterParams += '&' + key + '=' + criteria[key];
        }
      }
      $http({
        method: 'GET',
        url: '/logs/search/' + uid + '?offset=' + $scope.logs.length + '&limit=' + PAGE_SIZE + filterParams
      }).then(function(response) {
        if (response.data.length == 0 || response.data.length < PAGE_SIZE) {
          $scope.endOfRecords = true;
        }
        if (response.data.length === 0) {
          return;
        }
        $scope.logs = $scope.logs.concat(response.data);
      }, function(err) {
        console.error(err);
      });
    };

    $scope.getLogs = function() {
      var filterParams = '';
      var baseUrl =
      $http({
        method: 'GET',
        url: '/logs/' + uid + '?offset=' + $scope.logs.length + '&limit=' + PAGE_SIZE
      }).then(function(response) {
        if (response.data.length == 0 || response.data.length < PAGE_SIZE) {
          $scope.endOfRecords = true;
        }
        if (response.data.length === 0) {
          return;
        }
        $scope.logs = $scope.logs.concat(response.data);
      }, function(err) {
        console.error(err);
      });
    };

    $scope.getLogs();
    window.scope = $scope;
  }
]);