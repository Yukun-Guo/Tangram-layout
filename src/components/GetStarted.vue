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
    let msg = "Tangram UI Layout builder";
    let showMsg = () => {
      console.log(msg);
    };
    return { msg, showMsg };
  },
});
</script>

<style scoped>
.hello {
  color: #cccccc;
  background-color: #1e1e1e;
  font-size: x-large;
  padding: 20%;
  height: 100%;
}
</style>
