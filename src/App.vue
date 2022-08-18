<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";
import {
  TangramLayout,
  createTree,
  TreeNode,
  insertChild,
  removeChild,
} from "./components/tangram-layout";
// import plugins
import pluginConfigs from "./components/plugins/tangram.plugin.config.json";

// create tree for tangram layout
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
  layout: "horizontal",
  relativePosition: 1,
  twinID: node2.ID,
  minSize: 0,
  vNode: "Hello2",
};
let node4: TreeNode = {
  ID: "4",
  name: "Pane 4",
  layout: "vertical",
  relativePosition: 1,
  twinID: node2.ID,
  minSize: 0,
  vNode: "Hello",
};
insertChild(layout_tree, node1);
insertChild(layout_tree, node2);
insertChild(layout_tree, node3);
insertChild(layout_tree, node4);

let showControls = ref(true);
let showHeader = ref(true);
let theme: any = ref("dark");
let themeID = ref(1);

let changeTheme = () => {
  themeID.value++;
  themeID.value = themeID.value % 3;
  switch (themeID.value) {
    case 1:
      theme.value = "dark";
      break;
    case 2:
      theme.value = "light";
      break;
    default:
      theme.value = {
        split: { bgColor: "black" },
        pane: { headerBgColor: "black", bodyBgColor: "gray", color: "yellow" },
      };
  }
};
</script>

<template>
  <button @click="showHeader = !showHeader">showHeader ({{ showHeader }})</button>
  <button @click="showControls = !showControls">showControls ({{ showControls }})</button>
  <button @click="changeTheme">Change Theme ({{ themeID }})</button>
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
