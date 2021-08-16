<template>
  <div data-testid="listentry">
    <router-link v-if="entries" v-for="entry in entries" :to="`/entry/${entry.id}`" :data-testid="`linkDetailEntry${entry.id}`">{{entry.title}}</router-link>
  </div>
</template>

<script>
  import { filter } from 'rxjs/operators';

  import api from '../api.js';
  import { UnauthenticatedException } from '../api.js';

  export default {
    data: function() {
      return {
        entries: null
      }
    },

    mounted() {
      const fetchListEntry = api.listEntry();
      fetchListEntry.pipe(
        filter(x => x instanceof UnauthenticatedException)
      ).subscribe(x => {
        this.$router.push({ path: '/login' })
      });
      fetchListEntry.pipe(
        filter(x => !(x instanceof UnauthenticatedException))
      ).subscribe(entries => {
        this.entries = entries
      });
    }
  }
</script>