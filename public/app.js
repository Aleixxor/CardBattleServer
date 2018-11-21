require('./assets/css/style.css');

import angular from 'angular';
import uirouter from '@uirouter/angularjs';

import { states, bootstrap } from './app.states';

import { main } from './components/main';
import { login } from './components/login';
import { register } from './components/register';
import { topBar } from './components/topBar';

angular 
  .module('game', [uirouter])
  .config(states)
  .run(bootstrap)
  .component('cMain', main)
  .component('cLogin', login)
  .component('cRegister', register)
  .component('cTopBar', topBar);
