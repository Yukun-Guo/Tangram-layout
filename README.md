# Tangram-layout, A Vue3 split & drag layout

![Tangram-layout](public/Animation.gif)

## Get started

### 1. clone this repository

    ```bash 
    git clone https://github.com/Yukun-Guo/Tangram
    ```

### 2. install dependencies

    ```bash
    npm install
    ```

### 3. run the demo

    ```bash 
    npm run dev
    ```

## use `Tangram-layout` in your project

### 1. Copy the src/components/`tangram-layout` folder to your project, create `plugins` folder in your project. these two folders must be in the same level

### 2. Put the components you want to show in the `plugins` folder, and create a `tangram.plugin.config.json` file to register the components. Each component must store in a folder

An example of `tangram.plugin.config.json`:

    ```json
        {
            "ComponentName": {
                "dir": "path/of/the/component.vue",
                "description": "Short description of the component",
            },
            "Hello": {
                "dir": "HelloWorld/HelloWorld.vue",
                "description": "This is a test component Hello World2"
            },
            ...
        }
    ```

### 3. A full example

```typescript
    <script setup lang="ts">

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
    name: "Pane 1", // title of the pane
    layout: "horizontal", // layout of the pane (horizontal or vertical)
    relativePosition: 1, // relative position of the pane (1: left/top, 2: right/bottom)
    twinID: undefined, // twinID of the pane (if the pane is split, it will have a twin)
    minSize: 0, //pixels
    vNode: "Hello", // name of the component
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
        theme.value = { //custom theme
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
        :layout="layout_tree" // tree of the layout
        :plugins="pluginConfigs" // plugin configs
        :theme="theme" // theme
        :showHeader="showHeader" // show header of the pane
        :showControls="showControls" // show controls of the pane
    />
    </template>

    <style>
    ...
    </style>
```
