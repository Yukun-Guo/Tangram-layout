<template>
  <div class="hello">
    {{ msg }}
    <button @click="showMsg()">show message</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    let msg = "Hello World!";
    let showMsg = () => {
      alert(msg);
    };
    return { msg, showMsg };
  },
});
</script>

<style scoped>
.hello {
  background-color: "blue";
}
</style>
