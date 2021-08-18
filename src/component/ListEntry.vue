<template>
  <div data-testid="listentry">
    <router-link v-if="entries" v-for="entry in entries" :to="`/entry/${entry.id}`" :data-testid="`linkDetailEntry${entry.id}`">{{entry.title}}</router-link>
    <button data-testid="addButton" v-stream:click="addEntry">Add</button>
  </div>
</template>

<script>
  import { filter } from 'rxjs/operators';

  import api from '../api.js';
  import { UnauthenticatedException } from '../api.js';
  import apiMixin from './apiMixin.js';

  export default {
    mixins: [ apiMixin ],

    domStreams: [ 'addEntry' ],

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

      this.addEntry.subscribe(() => {
        this.$router.push({path: '/entry/add'});
      });
    }
  }
</script>