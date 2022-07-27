<template>
  <div class="pane">
    <div class="header">
      {{ title }}
    </div>
    <span @click="test()">x</span>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: { type: String, default: "" },
  },
  setup(props) {
    let test = () => {
      console.log("test");
    };
    return { test };
  },
};
</script>
<style scoped>
.pane {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;

  height: 100%;
  width: 100%;
  flex-direction: column;
  pointer-events: none;
}

.pane > .header {
  height: 0.9em;
  padding: 3px;
  margin-right: 50px;
  color: white;
  overflow: hidden;

  background-color: #35363a;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.pane > .content {
  position: absolute;
  top: 3.3em;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  pointer-events: initial;
}
</style>
