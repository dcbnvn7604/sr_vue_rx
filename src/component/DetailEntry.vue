<template>
  <div>
    <div data-testid="detailentry" v-if="!editting">
      <div v-if="entry">{{entry.id}}</div>
      <div v-if="entry">{{entry.title}}</div>
      <div v-if="entry">{{entry.content}}</div>
      <button data-testid="editButton" type="button" v-stream:click="clickEdit">Cancel</button>
    </div>
    <edit-entry v-else :entry="entry" v-stream:cancelentry="cancelEntry"></edit-entry>
  </div>
</template>

<script>
  import { filter } from 'rxjs/operators';

  import api from '../api.js';
  import { UnauthenticatedException } from '../api.js';
  import EditEntry from './EditEntry.vue';

  export default {
    components: { EditEntry },

    domStreams: ['clickEdit', 'cancelEntry'],

    data() {
      return {
        entry: null,
        editting: false
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
      this.clickEdit.subscribe(() => {
        this.editting = true;
      });
      this.cancelEntry.subscribe(() => {
        this.editting = false;
      });
    }
  }
</script>