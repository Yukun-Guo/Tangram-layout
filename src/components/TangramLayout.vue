<script lang="ts">
import { NO } from "@vue/shared";
import { defineComponent, ref, reactive, h, VNode, computed } from "vue";
import {
  Stump,
  createTree,
  getTreeSize,
  removeChild,
  insertChild,
  moveChild,
} from "../utils/tree";
import { TreeNode } from "../utils/types";

export default defineComponent({
  name: "TangramLayout",
  props: {
    layout: {
      default: createTree(),
    },
  },
  setup(props, context) {
    let rLayout = reactive(props.layout);

    let splitProps = (node: TreeNode) => {
      switch (node.layout) {
        case "vertical":
          return {
            id: node.ID,
            class: `split ${node.layout}`,
            style: { width: `${node.proportion}%` },
          };
        default:
          return {
            id: node.ID,
            class: `split ${node.layout}`,
            style: { height: `${node.proportion}%` },
          };
      }
    };

    let leafProps = (node: TreeNode) => {
      switch (node.layout) {
        case "vertical":
          return {
            id: node.ID,
            class: "leaf",
            style: { height: `${node.proportion}%` },
          };
        default:
          return {
            id: node.ID,
            class: "leaf",
            style: { width: `${node.proportion}%` },
          };
      }
    };

    const walk = (Node: TreeNode): VNode => {
      console.log(Node);
      let split: VNode;
      if (Node.children.length > 1) {
        // this is a branch node
        let subSplit: VNode[] = [];
        Node.children.forEach((child) => {
          subSplit.push(walk(rLayout[child]));
        });
        split = h("div", splitProps(Node), subSplit);
      } else {
        // this is a leaf node
        split = h("div", leafProps(Node), `${Node.ID}`);
      }

      return split;
    };
    context.expose({ rLayout });
    return () => walk(rLayout.treeRoot);
  },
});
</script>

<style scoped>
.split {
  display: flex;
  flex: 1;
  height: 100%;

  background-color: aqua;
}
.split.vertical {
  flex-direction: column;
}

.split.horizontal {
  flex-direction: row;
}
.leaf {
  background-color: chartreuse;
  margin: 3%;
}
</style>
