export const register = {
  template: require('./register.html'),
  controller: ['$http', '$state', RegisterCtrl],
  controllerAs: 'vm'
  // bindings: {
  //   $transition$: '<'
  // }
};

let isRegistering = false;

function RegisterCtrl($http, $state) {
  const vm = this;

  vm.isPlaying = false;
  console.log($state);
  vm.onRegister = onRegister;
  vm.numberOfPages = numberOfPages;
  vm.currentPage;
  vm.pageSize = 10;
  vm.loginPage = [];
  // vm.previousPage = previousPage;
  // vm.nextPage = nextPage;
  vm.playPreview = playPreview;
  vm.preview = { audio: '', url: '' };
  vm.selectedMusic = null;
  vm.registerValue;

  this.$onInit = function() {
    // console.log('isRegistering: ' + isRegistering);
    // isRegistering = true;
    // console.log('isRegistering: ' + isRegistering);
    // vm.registerValue = vm.$transition$.params().registerValue;
    // // console.log("registerValue: " + vm.registerValue);
    // vm.currentPage = parseInt(vm.$transition$.params().currentPage);
    // // console.log("$transition$: " + vm.$transition$.params().currentPage);
    // // console.log("vm.currentPage: " + vm.currentPage);
    // onRegister();
  };

  let logins;

  atualizeResults();
  console.log(this.logins);

  // $document.on('mousemove', function (event) {
  //   atualizeResults();
  //   console.log("mouseMove");
  // });

  function atualizeResults() {
    logins = vm.logins;
  }

  function onRegister() {
    console.log(vm.registerValue);
    let login;
    $http
      .get(
        'https://localhost:5001/api/iTunes/register?term=' +
          vm.registerValue +
          '&limit=50'
      )
      .then(function(data) {
        login = data.data.logins;
        vm.logins = data.data.logins;
        changeResultPage();
      });
    return login;
  }

  // function nextPage() {
  //   vm.currentPage = vm.currentPage + 1;
  //   changeResultPage();
  // }

  // function previousPage() {
  //   vm.currentPage = vm.currentPage - 1;
  //   changeResultPage();
  // }

  function changeResultPage() {
    vm.loginPage = [];
    console.log('Current page: ' + vm.currentPage);
    for (let i = 0; i < 10 && i < vm.logins.length; i++) {
      let position = i + 10 * vm.currentPage;
      console.log(position);
      vm.loginPage.push(vm.logins[position]);
    }
    console.log('loginsPage: ');
    console.log(vm.loginPage);
  }

  function numberOfPages() {
    return Math.ceil(vm.logins.length / vm.pageSize);
  }

  (function() {
    if (vm.preview.audio.paused) {
      vm.isPlaying = false;
    } else {
      vm.isPlaying = true;
    }
  });

  function playPreview(url) {
    if (vm.preview.url == url) {
      if (vm.isPlaying == false) {
        vm.preview.audio.play();
      } else {
        vm.preview.audio.pause();
      }
      vm.isPlaying = !vm.isPlaying;
    } else {
      if (vm.isPlaying == true) {
        vm.preview.audio.pause();
      }
      vm.preview.url = url;
      vm.preview.audio = new Audio(url);
      vm.preview.audio.play();
      vm.isPlaying = true;
    }
  }
}
