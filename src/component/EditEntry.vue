<template>
  <div data-testid="editentry">
    <form>
      <input data-testid="titleInput" type="text" name="title" v-model="title" />
      <input data-testid="contentInput" type="text" name="content" v-model="content" />
      <button data-testid="cancelButton" type="button" v-stream:click="clickCancel">Cancel</button>
      <button data-testid="saveButton" type="button" v-stream:click="clickSave">Cancel</button>
    </form>
  </div>
</template>

<script>
  export default {
    domStreams: ['clickSave', 'clickCancel'],

    props: ['entry'],

    data() {
      return {
        title: this.entry ? this.entry.title : null,
        content: this.entry ? this.entry.content : null
      }
    },

    mounted() {
      this.clickCancel.subscribe(() => {
        this.$emit('cancelentry');
      });
    }
  };
</script>