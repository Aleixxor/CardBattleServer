import { Visualizer } from '@uirouter/visualizer';

export const states = [
  "$stateProvider",
  "$urlServiceProvider",
  ($stateProvider, $urlServiceProvider) => {
    const states = [
      {
        name: "game",
        redirectTo: "game.topBar"
      },
      {
        name: "game.topBar",
        url: "/topBar",
        component: "cTopBar",
        redirectTo: "game.topBar.main"
      },
      {
        name: "game.topBar.main",
        url: "",
        component: "cMain"
      },
      {
        name: "game.topBar.register",
        url: "/register",
        component: "cRegister"
      },
      {
        name: "game.topBar.login",
        url: "/login",
        component: "cLogin"
      }
    ];
    states.forEach(state => $stateProvider.state(state));
    $urlServiceProvider.rules.otherwise({ state: "game" });
  }
];

export const bootstrap = [
  "$uiRouter", 
  ($uiRouter) => {
    $uiRouter.plugin(Visualizer);
  }
];