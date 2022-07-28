<template>
  <div class="pane">
    <div class="header">
      <div class="controller">
        <span class="close" @click="removeNode()">×</span>
        <span class="add" @click="addNode()">+</span>
      </div>
      <span class="title">{{ title }}</span>
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: { type: String, default: "" },
    nodeId: { type: String, default: "" },
  },
  setup(props, context) {
    let test = () => {
      alert("test");
    };

    let removeNode = () => {
      context.emit("removeNode", props.nodeId);
    };
    let addNode = () => {
      context.emit("addNode", {
        name: "test",
        twinID: props.nodeId,
        vNode: `<div>test</div>`,
      });
    };
    return { test, removeNode, addNode };
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
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  height: 18px;
  padding: 3px;
  color: white;
  overflow: hidden;
  background-color: #35363a;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /*
added
 */
  display: flex;
  flex-direction: row;
}

.pane > .header:hover>~.controller > * {
  color: white;
}

.pane > .header > .controller {
  margin-right: auto;
}

.pane > .header > .title {
  margin-right: auto;
}

.pane > .header > .controller > * {
  height: 0.9em;
  color: grey;
  overflow: auto;
  background-color: #35363a;
  border-style: solid;
  border-radius: 3px;
  border-width: 0px;
  border-color: grey;
  font-size: 14px;
  padding: 0px 2px 2px 2px;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: initial;
  margin-right: 2px;
}

.pane > .header > .controller > .add:hover {
  color: white;
  background-color: #858585;
}
.pane > .header > .controller > .close:hover {
  color: white;
  background-color: red;
}

.pane > .content {
  position: absolute;
  top: 1.6em;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  pointer-events: initial;
}
</style>
