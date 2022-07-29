<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import TangramLayout from "./components/TangramLayout.vue";
import { createTree, TreeNode, insertChild, removeChild } from "./utils/tree";
import pluginConfigs from "./plugins/plugin.config.json";
let layout_tree = createTree();

let node1: TreeNode = {
  ID: "1",
  name: "Pane 1",
  layout: "horizontal",
  resizable: true,
  relativePosition: 1,
  twinID: undefined,
  minSize: 20,
  vNode: "Hello",
};
let node2: TreeNode = {
  ID: "2",
  name: "Pane 2",
  layout: "horizontal",
  resizable: true,
  relativePosition: 1,
  twinID: node1.ID,
  minSize: 20,
  vNode: "Hello",
};
let node3: TreeNode = {
  ID: "3",
  name: "Pane Pane Pane Pane Pane Pane Pane3",
  layout: "vertical",
  resizable: true,
  relativePosition: 0,
  twinID: node2.ID,
  minSize: 50,
  vNode: "Hello2",
};
let node4: TreeNode = {
  ID: "4",
  name: "Pane 4",
  layout: "vertical",
  resizable: true,
  relativePosition: 0,
  twinID: node2.ID,
  minSize: 20,
  vNode: "Hello",
};
let node5: TreeNode = {
  ID: "5",
  name: "Pane 5",
  layout: "horizontal",
  resizable: true,
  relativePosition: 1,
  twinID: node2.ID,
  minSize: 20,
  vNode: "Hello",
};
let node6: TreeNode = {
  ID: "6",
  name: "Pane 6",
  layout: "horizontal",
  resizable: true,
  relativePosition: 0,
  twinID: node3.ID,
  minSize: 40,
  vNode: "Hello",
};
let node7: TreeNode = {
  ID: "7",
  name: "Pane 7",
  layout: "horizontal",
  resizable: true,
  relativePosition: 0,
  twinID: node5.ID,
  minSize: 20,
  vNode: "Hello",
};
let node8: TreeNode = {
  ID: "8",
  name: "Pane 8",
  layout: "vertical",
  resizable: true,
  relativePosition: 0,
  twinID: node2.ID,
  minSize: 20,
  vNode: "Hello",
};
let node9: TreeNode = {
  ID: "9",
  name: "Pane 9",
  layout: "vertical",
  resizable: true,
  relativePosition: 0,
  twinID: node7.ID,
  minSize: 20,
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
// removeChild(layout_tree, "4");
// console.log(pluginConfigs);
</script>

<template>
  <TangramLayout :layout="layout_tree" :plugins="pluginConfigs" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
}
body {
  min-height: 80vh;
  height: 80vh;
}
</style>
