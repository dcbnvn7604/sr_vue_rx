<template>
  <div data-testid="listentry">
    <router-link v-if="entries" v-for="entry in entries" :to="`/entry/${entry.id}`" :data-testid="`linkDetailEntry${entry.id}`">{{entry.title}}</router-link>
  </div>
</template>

<script>
  import { filter } from 'rxjs/operators';

  import api from '../api.js';
  import { UnauthenticatedException } from '../api.js';
  import apiMixin from './apiMixin.js';

  export default {
    mixins: [ apiMixin ],

    data: function() {
      return {
        entries: null
      }
    },

    mounted() {
      this.apiException(api.listEntry())
        .subscribe(entries => {
          this.entries = entries
        });
    }
  }
</script>