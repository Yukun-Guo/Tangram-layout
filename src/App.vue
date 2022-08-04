<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";
import TangramLayout from "./components/TangramLayout.vue";
import { createTree, TreeNode, insertChild, removeChild } from "./utils/tree";
import pluginConfigs from "./plugins/plugin.config.json";
let layout_tree = createTree();

let node1: TreeNode = {
  ID: "1",
  name: "Pane 1",
  layout: "horizontal",
  relativePosition: 1,
  twinID: undefined,
  minSize: 0, //pixels
  vNode: "Hello",
};
let node2: TreeNode = {
  ID: "2",
  name: "Pane 2",
  layout: "horizontal",
  relativePosition: 1,
  twinID: node1.ID,
  minSize: 0,
  vNode: "Hello",
};
let node3: TreeNode = {
  ID: "3",
  name: "Pane3",
  layout: "vertical",
  relativePosition: 0,
  twinID: node2.ID,
  minSize: 0,
  vNode: "Hello2",
};
let node4: TreeNode = {
  ID: "4",
  name: "Pane 4",
  layout: "vertical",
  relativePosition: 0,
  twinID: node2.ID,
  minSize: 0,
  vNode: "Hello",
};
let node5: TreeNode = {
  ID: "5",
  name: "Pane 5",
  layout: "horizontal",
  relativePosition: 1,
  twinID: node2.ID,
  minSize: 0,
  vNode: "Hello",
};
let node6: TreeNode = {
  ID: "6",
  name: "Pane 6",
  layout: "horizontal",
  relativePosition: 0,
  twinID: node3.ID,
  minSize: 0,
  vNode: "Hello",
};
let node7: TreeNode = {
  ID: "7",
  name: "Pane 7",
  layout: "horizontal",
  relativePosition: 0,
  twinID: node5.ID,
  minSize: 0,
  vNode: "Hello",
};
let node8: TreeNode = {
  ID: "8",
  name: "Pane 8",
  layout: "vertical",
  relativePosition: 0,
  twinID: node2.ID,
  minSize: 0,
  vNode: "Hello",
};
let node9: TreeNode = {
  ID: "9",
  name: "Pane 9",
  layout: "vertical",
  relativePosition: 0,
  twinID: node7.ID,
  minSize: 0,
  vNode: "Hello",
};
insertChild(layout_tree, node1);
insertChild(layout_tree, node2);
insertChild(layout_tree, node3);
insertChild(layout_tree, node4);
insertChild(layout_tree, node5);
insertChild(layout_tree, node6);
insertChild(layout_tree, node7);
insertChild(layout_tree, node8);
insertChild(layout_tree, node9);

let showControls = ref(true);
let showHeader = ref(true);
let theme = ref("dark");
let changeTheme = () => {
  switch (theme.value) {
    case "dark":
      theme.value = "light";
      break;
    default:
      theme.value = "dark";
  }
};
</script>

<template>
  <button @click="showHeader = !showHeader">showHeader ({{ showHeader }})</button>
  <button @click="showControls = !showControls">showControls ({{ showControls }})</button>
  <button @click="changeTheme">Change Theme ({{ theme }})</button>
  <TangramLayout
    :layout="layout_tree"
    :plugins="pluginConfigs"
    :theme="theme"
    :showHeader="showHeader"
    :showControls="showControls"
  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 20px; */
  height: 100%;
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
}
body {
  min-height: 90vh;
  height: 90vh;
}
button {
  margin: 3px;
}
</style>
