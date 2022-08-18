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
      console.log(msg);
    };
    return { msg, showMsg };
  },
});
</script>

<style scoped>
.hello {
  background-color: "blue";
  color: #cccccc;
}
</style>
