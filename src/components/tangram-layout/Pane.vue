<template>
  <div class="pane">
    <div
      class="header"
      :style="{
        color: theme.color,
        backgroundColor: theme.headerBgColor,
        display: showControls ? 'flex' : 'block',
      }"
      v-if="showHeader"
    >
      <div class="controller" v-show="showControls">
        <span class="close control" @click="removeNode()">×</span>
        <span class="dropdown control">
          <span>+</span>
          <div
            class="dropdown-content"
            :style="{ color: theme.color, backgroundColor: theme.headerBgColor }"
          >
            <div
              v-for="item in plugins.keys()"
              :key="plugins.get(item).name"
              :title="setTitle(item)"
              @click="addNode(item)"
            >
              {{ item }}
            </div>
          </div>
        </span>
      </div>
      <span class="title">{{ title }}</span>
    </div>

    <div
      class="content"
      :style="{ top: showHeader ? '1.6em' : '0em', backgroundColor: theme.bodyBgColor }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
export default {
  props: {
    title: { type: String, default: "" },
    nodeId: { type: String, default: "" },
    plugins: { type: Object, default: { Welcome: "" } },
    theme: {
      type: Object,
      default: {
        headerBgColor: "#1e1e1e",
        bodyBgColor: "#2d2d2d",
        color: "#c4c4c4",
      },
    },
    showControls: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
  },
  setup(props, context) {
    let showDropDown = ref(1);
    // console.log("props.plugins", props.plugins.get("Hello"));

    let setTitle = (item) => {
      return `Description: ${props.plugins.get(item).description}\nAuthor: ${
        props.plugins.get(item).author
      }\nVersion: ${props.plugins.get(item).version}`;
    };
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
    return { showDropDown, removeNode, addNode, setTitle };
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
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  flex-direction: row;
}

/* .pane > .header:hover .controller {
  color: white;
} */

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
  overflow: auto;
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
  color: #2d2d2d;
  background: #d8d8d8;
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
  padding: 2px 2px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content div:hover {
  background-color: #0060c0;
  color: white;
}
</style>
