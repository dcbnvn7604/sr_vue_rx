<template>
  <div data-testid="list-entry">List Entry</div>
</template>

<script>
  import { filter } from 'rxjs/operators';

  import api from '../api.js';
  import { UnauthenticatedException } from '../api.js';

  export default {
    data: function() {
      return {}
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
      ).subscribe(x => {
        
      })
    }
  }
</script>