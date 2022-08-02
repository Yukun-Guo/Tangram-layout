<template>
  <div class="welcome">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    let msg = "Tangram UI Layout builder";
    return { msg };
  },
});
</script>

<style scoped>
.welcome {
  font-size: x-large;
  padding: 20%;
  height: 100%;
}
</style>
