<template>
  <div class="site-content">
    Hello {{message}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      message: 'Hello World!'
    };
  }
});
</script>

<style lang="scss" scoped>
.site-content {
  color: hsl(220, 100%, 25%);
}
</style>