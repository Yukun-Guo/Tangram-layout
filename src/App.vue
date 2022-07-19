<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import TangramLayout from "./components/TangramLayout.vue";
import { createTree, TreeNode, insertChild } from "./utils/tree";

let layout_tree = createTree();

let node1: TreeNode = {
  ID: "1",
  isShow: false,
  layout: "horizontal",
  relativePosition: 1,
  twinID: undefined,
};
let node2: TreeNode = {
  ID: "2",
  isShow: false,
  layout: "vertical",
  relativePosition: 1,
  twinID: node1.ID,
};
let node3: TreeNode = {
  ID: "3",
  isShow: false,
  layout: "horizontal",
  relativePosition: 0,
  twinID: node1.ID,
};
let node4: TreeNode = {
  ID: "4",
  isShow: false,
  layout: "vertical",
  relativePosition: 0,
  twinID: node2.ID,
};
let node5: TreeNode = {
  ID: "5",
  isShow: false,
  layout: "horizontal",
  relativePosition: 1,
  twinID: node2.ID,
};
let node6: TreeNode = {
  ID: "6",
  isShow: false,
  layout: "horizontal",
  relativePosition: 0,
  twinID: node3.ID,
};
let node7: TreeNode = {
  ID: "7",
  isShow: false,
  layout: "horizontal",
  relativePosition: 0,
  twinID: node5.ID,
};
let node8: TreeNode = {
  ID: "8",
  isShow: false,
  layout: "vertical",
  relativePosition: 0,
  twinID: node2.ID,
};
insertChild(layout_tree, node1);
insertChild(layout_tree, node2);
insertChild(layout_tree, node3);
insertChild(layout_tree, node4);
insertChild(layout_tree, node5);
insertChild(layout_tree, node6);
insertChild(layout_tree, node7);
insertChild(layout_tree, node8);
</script>

<template>
  <TangramLayout :layout="layout_tree" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
