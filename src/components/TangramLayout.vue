<script lang="ts">
import { defineComponent, ref, reactive, h, VNode, computed } from "vue";
import {
  TreeNode,
  Stump,
  createTree,
  getTreeSize,
  removeChild,
  insertChild,
  moveChild,
} from "../utils/tree";

import Pane from "./Pane.vue";
import Splitter from "./Splitter.vue";
// import "./style.css";

export default defineComponent({
  name: "TangramLayout",
  props: {
    layout: {
      default: createTree(),
    },
    minSize: {
      default: 0,
    },
  },

  setup(props, context) {
    let rLayout = reactive(props.layout);

    let splitProps = (node: TreeNode) => {
      let cssClass = ["split", node.layout, node.resizable ? "resizable" : ""];
      return {
        id: node.ID,
        class: cssClass,
        style: { "flex-basis": `${node.proportion}%` },
      };
    };

    let leafProps = (node: TreeNode) => {
      return {
        id: node.ID,
        class: "leaf view",
        targetView: "view-" + node.ID,
        style: { "flex-basis": `${node.proportion}%` },
        mousedown: onViewDragStart,
      };
    };
    // TODO:
    let onViewDragStart = (event: MouseEvent) => {};

    const walk = (Node: TreeNode): VNode => {
      let split: VNode;
      if (Node.children.length > 1) {
        // this is a branch node
        let subSplit: VNode[] = [];

        for (let i = 0; i < Node.children.length; i++) {
          const child1 = Node.children[i];
          const child2 = Node.children[i + 1];

          subSplit.push(walk(rLayout[child1]));
          subSplit.push(
            h(Splitter, {
              onSplitResize,
              leftChildId: child1,
              rightChildId: child2,
              leftChildMinSize: rLayout[child1].minSize,
              rightChildMinSize: child2 === undefined ? 1 : rLayout[child2].minSize,
              resizable: Node.resizable,
              dir: Node.layout,
            })
          );
        }
        subSplit.pop();
        split = h("div", splitProps(Node), subSplit);
      } else {
        // create a new leaf node
        split = h("div", leafProps(Node), [
          h(Pane, { title: Node.name }, () => {
            return "contentcontentcontentcontentcontentcontentcontentcontentcontentcontent";
          }),
        ]);
      }
      return split;
    };

    const onSplitResize = (splitInfo: {
      p: number;
      childID1: string;
      childID2: string;
    }) => {
      var totalP =
        rLayout[splitInfo.childID1].proportion + rLayout[splitInfo.childID2].proportion;

      var leftP = Math.min(
        Math.max(totalP * splitInfo.p, props.minSize),
        totalP - props.minSize
      );
      // console.log("totalP " + totalP);

      // console.log(leftP);

      rLayout[splitInfo.childID1].proportion = leftP;
      rLayout[splitInfo.childID2].proportion = totalP - leftP;
    };

    //    context.expose({ rLayout });
    return () =>
      h("div", { style: { height: "100%" } }, [
        h(
          "button",
          {
            onClick: () => {
              moveChild(rLayout, {
                ID: "4",
                isShow: true,
                layout: "horizontal",
                relativePosition: 1,
                twinID: "3",
              });
            },
          },
          ["addnode"]
        ),
        walk(rLayout.treeRoot),
      ]);
  },
});
</script>

<style scoped>
#treeRoot {
  /* display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  overflow: hidden;
  position: relative; */
  height: 100%;
}

/* .split {
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
}*/
.leaf {
  background-color: chartreuse;
  border: 1px;
  border-style: dotted;
  border-color: black;
  overflow: overlay;
}

/*.split.resizable.vertical > .splitter {
  cursor: row-resize;
  width: 10px;
}

.split.resizable.horizontal > .splitter {
  cursor: col-resize;
  height: 10px;
} */
</style>
