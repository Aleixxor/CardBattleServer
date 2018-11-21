export const login = {
  template: require('./login.html'),
  controller: ['$http', '$state', LoginCtrl],
  controllerAs: 'vm'
  // bindings: {
  //   $transition$: '<'
  // }
};

function LoginCtrl($http, $state) {
  const vm = this;
  vm.onLogin = onLogin;
  vm.openPage = openPage;

  this.$onInit = function() {
    console.log('$onInit');
    // vm.trackId = vm.$transition$.params().trackId;
    // $http
    //   .get('https://localhost:5001/api/iTunes/register?term=' + vm.trackId)
    //   .then(function(res) {
    //     console.log(res.data.logins[0]);
    //     vm.selectedMusic = res.data.logins[0];
    //     vm.currentPage = 0;
    //   });
  };

  function openPage(url) {
    console.log(vm.selectedMusic.trackViewUrl);
    window.open(url);
  }

  function onLogin() {
    console.log(vm.loginParams);
    if (vm.loginParams != undefined) {
      if (
        vm.loginParams.username != undefined &&
        vm.loginParams.username != ''
      ) {
        if (
          vm.loginParams.password != undefined &&
          vm.loginParams.password != ''
        ) {
          console.log('OK. Send to API.');
        } else {
          console.log('Empty password');
        }
      } else {
        console.log('Empty username');
      }
    } else {
      console.log('Both empty');
    }
  }
}
