export const topBar = {
  template: require('./topBar.html'),
  controller: ['$state', TopBarCtrl],
  controllerAs: 'vm'
};

function TopBarCtrl($state) {
  const vm = this;
  vm.topBar = '';
  this.$onInit = function() {
    console.log('$onInit');
  };
}
