<template>
  <div class="pane">
    <div class="header">
      <div class="controller">
        <span class="close control" @click="removeNode()">×</span>
        <span class="dropdown control">
          <span>+</span>
          <div class="dropdown-content">
            <div v-for="item in Object.keys(plugins)" :key="item" @click="addNode(item)">
              {{ item }}
            </div>
          </div>
        </span>
      </div>
      <span class="title">{{ title }}</span>
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  props: {
    title: { type: String, default: "" },
    nodeId: { type: String, default: "" },
    plugins: { type: Object, default: { Welcome: "" } },
  },
  setup(props, context) {
    let plugins = props.plugins;
    let showDropDown = ref(1);
    let removeNode = () => {
      context.emit("removeNode", props.nodeId);
    };
    let addNode = (nodeID) => {
      let text;
      let nodeName = prompt("Please give a name to the new View:", nodeID);
      if (nodeName === null) return;
      switch (nodeName.trim()) {
        case "":
          alert("Name can't be empty");
          break;
        default:
          context.emit("addNode", {
            name: nodeName.trim(),
            twinID: props.nodeId,
            vNode: nodeID,
          });
      }
    };
    return { showDropDown, removeNode, addNode };
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
  color: #c4c4c4;
  overflow: hidden;
  background-color: #2d2d2d;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  display: flex;
  flex-direction: row;
}

.pane > .header:hover ~ .controller > * {
  color: white;
}

.pane > .header > .controller {
  /* position: relative; */
  pointer-events: auto;
  /* display: inline-block; */
  margin-right: auto;
}

.pane > .header > .title {
  margin-right: auto;
}

.pane > .header > .controller > .control {
  height: 0.9em;
  color: #c5c5c5;
  overflow: auto;
  background-color: #2d2d2d;
  border-style: solid;
  border-radius: 3px;
  border-width: 0px;
  border-color: grey;
  font-size: 14px;
  padding: 0px 2px 0px 2px;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: initial;
  margin-right: 2px;
}

/* Dropdown Content (Hidden by Default) */
.pane > .header > .controller > .dropdown > .dropdown-content {
  display: none;
  position: absolute;
  background-color: #363636;
  padding: 4px;
  text-align: left;

  min-width: 80px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-item {
  padding: 2px;
}

.pane > .header > .controller > .dropdown:hover .dropdown-content {
  display: block;
}

.pane > .header > .controller > .dropdown:hover {
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

/* Divs inside the dropdown */
.dropdown-content div {
  color: white;
  padding: 2px 2px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content div:hover {
  background-color: #04395e;
}
</style>
