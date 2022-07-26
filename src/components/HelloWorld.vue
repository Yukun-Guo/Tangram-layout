<template>
  <div class="hello">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    let msg = "Hello World!";

    return { msg };
  },
});
</script>

<style scoped>
.hello {
  background-color: "blue";
}
</style>
