import Vue from 'vue';
import VueRx from 'vue-rx';

import api from '../src/api';

api.setHost('localhost');

Vue.use(VueRx)