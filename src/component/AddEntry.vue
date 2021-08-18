<template>
  <edit-entry data-testid="addentry" v-stream:cancelentry="cancelEntry" v-stream:saveentry="saveEntry"></edit-entry>
</template>

<script>
  import { concatMap } from 'rxjs/operators';

  import EditEntry from './EditEntry.vue';
  import api from '../api.js';
  import apiMixin from './apiMixin.js';

  export default {
    components: { EditEntry },

    domStreams: [ 'cancelEntry', 'saveEntry' ],

    mixins: [ apiMixin ],

    data() {
      return {};
    },

    mounted() {
      this.cancelEntry.subscribe(() => {
        this.$router.push('/entry');
      });

      const saveEntry = this.saveEntry.pipe(
        concatMap(data => {
          return api.addEntry(data)
        })
      );
      this.apiException(saveEntry)
        .subscribe(() => {
          this.$router.push('/entry');
        });
    }
  };
</script>