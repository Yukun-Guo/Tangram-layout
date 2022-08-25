<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref, shallowRef, defineAsyncComponent } from "vue";
import {
  TangramLayout,
  createTree,
  TreeNode,
  insertChild,
  PluginObject,
} from "./components/tangram-layout";

import HelloWorld from "./components/plugins/HelloWorld/HelloWorld.vue";
import HelloWorld2 from "./components/plugins/HelloWorld2/HelloWorld2.vue";
import HelloWorld3 from "./components/plugins/HelloWorld3/HelloWorld3.vue";

// import plugins
import pluginConfigs from "./components/plugins/tangram.plugin.config.json";

// create tree for tangram layout
let layout_tree = createTree();

let node1: TreeNode = {
  ID: "1",
  name: "Pane 1", // title of the pane
  layout: "horizontal", // layout of the pane (horizontal or vertical)
  relativePosition: 1, // relative position of the pane (1: left/top, 2: right/bottom)
  twinID: undefined, // twinID of the pane (if the pane is split, it will have a twin)
  minSize: 0, //pixels
  vNode: "Hello", //the component instance or the name of the component
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
      theme.value = "dark"; //built-in theme dark
      break;
    case 2:
      theme.value = "light"; //built-in theme light
      break;
    default:
      theme.value = {
        //custom theme
        split: { bgColor: "black" },
        pane: { headerBgColor: "black", bodyBgColor: "gray", color: "yellow" },
      };
  }
};
// // async register plugins
// const importPluginComponents = (pluginsDir: String, pluginConfigs: any) => {
//   let pluginComponents = shallowRef(new Map<String, PluginObject>());
//   Object.keys(pluginConfigs).forEach((element) => {
//     pluginComponents.value.set(element, {
//       name: element,
//       component: defineAsyncComponent(
//         () => import(/* @vite-ignore */ `${pluginsDir}/${pluginConfigs[element].dir}`)
//       ),
//       description: pluginConfigs[element].description,
//       version: pluginConfigs[element].version,
//       author: pluginConfigs[element].author,
//       icon: pluginConfigs[element].icon,
//     });
//   });
//   return pluginComponents;
// };
// let plugins = importPluginComponents("./components/plugins", pluginConfigs);

// register plugins
let plugins = new Map<String, PluginObject>();
plugins.set("Hello", {
  name: "Hello",
  component: HelloWorld,
  description: "...",
  version: "xxx",
  author: "...",
});
plugins.set("Hello2", {
  name: "Hello2",
  component: HelloWorld2,
  description: "...",
  version: "xxx",
  author: "...",
});
plugins.set("Hello3", {
  name: "Hello3",
  // async import component
  component: HelloWorld3,
  description: "...",
  version: "xxx",
  author: "...",
});
</script>

<template>
  <button @click="showHeader = !showHeader">showHeader ({{ showHeader }})</button>
  <button @click="showControls = !showControls">showControls ({{ showControls }})</button>
  <button @click="changeTheme">Change Theme ({{ themeID }})</button>
  <TangramLayout
    :layout="layout_tree"
    :pluginComponents="plugins"
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
