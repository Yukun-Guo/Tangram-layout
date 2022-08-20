// import {
//     defineAsyncComponent,
//     shallowRef,
//     VNode,
// } from "vue";

interface PluginObject {
    name: string;
    component: any;
    dir?: string;
    icon?: string;
    description?: string;
    version?: string;
    author?: string;
}

// const importPluginComponents = (pluginsDir: String, pluginConfigs: any) => {
//     let pluginComponents = shallowRef(new Map<String, PluginObject>());
//     Object.keys(pluginConfigs).forEach((element) => {
//         pluginComponents.value.set(
//             element,
//             {
//                 name: element,
//                 component: defineAsyncComponent(
//                     () => import(/* @vite-ignore */ `${pluginsDir}/${pluginConfigs[element].dir}`)
//                 ),
//                 dir: pluginConfigs[element].dir,
//                 description: pluginConfigs[element].description,
//                 version: pluginConfigs[element].version,
//                 author: pluginConfigs[element].author,
//                 icon: pluginConfigs[element].icon,
//             }
//         );
//     });
//     return pluginComponents;
// }



export type { PluginObject }

// export { importPluginComponents };