<template>
  <div data-testid="detailentry">
    <div v-if="entry">{{entry.id}}</div>
    <div v-if="entry">{{entry.title}}</div>
    <div v-if="entry">{{entry.content}}</div>
  </div>
</template>

<script>
  import { filter } from 'rxjs/operators';

  import api from '../api.js';
  import { UnauthenticatedException } from '../api.js';

  export default {
    data() {
      return {
        entry: null
      }
    },

    mounted() {
      const fetchDetailEntry = api.detailEntry();
      fetchDetailEntry.pipe(
        filter(x => x instanceof UnauthenticatedException)
      ).subscribe(x => {
        this.$router.push({ path: '/login' });
      });
      fetchDetailEntry.pipe(
        filter(x => !(x instanceof UnauthenticatedException))
      ).subscribe(entry => {
        this.entry = entry;
      });
    }
  }
</script>