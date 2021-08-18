<template>
  <edit-entry data-testid="addentry" v-stream:cancelentry="cancelEntry"></edit-entry>
</template>

<script>
  import EditEntry from './EditEntry.vue';

  export default {
    components: { EditEntry },

    domStreams: [ 'cancelEntry' ],

    data() {
      return {};
    },

    mounted() {
      this.cancelEntry.subscribe(() => {
        this.$router.push('/entry');
      });
    }
  };
</script>