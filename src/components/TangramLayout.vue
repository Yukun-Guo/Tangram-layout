<script lang="ts">
import { NO } from "@vue/shared";
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
        class: "leaf",
        style: { "flex-basis": `${node.proportion}%` },
      };
    };

    // let startResize = (event: MouseEvent) => {
    //   if (!this.resizable || event.button !== 0) return;
    //   event.stopPropagation();
    //   event.preventDefault();
    //   this.state.resizing = true;

    //   const drag = (event) => {
    //     if (event.button !== 0) return;
    //     const h = this.dir === "horizontal";
    //     var splitter =
    //       (h ? this.$el.children[1].clientWidth : this.$el.children[1].clientHeight) / 2;
    //     var parentRect = this.$el.getBoundingClientRect();
    //     var splitSize = h
    //       ? ((event.x - parentRect.left - splitter) / this.$el.clientWidth) * 100
    //       : ((event.y - parentRect.top - splitter) / this.$el.clientHeight) * 100;
    //     this.state.split = splitSize + "%";
    //     this.$emit("onSplitResize", event, this, this.state.split);
    //   };
    //   const drop = (event) => {
    //     if (event.button !== 0) return;
    //     this.state.resizing = false;
    //     document.removeEventListener("mousemove", drag);
    //     document.removeEventListener("mouseup", drop);
    //   };
    //   document.addEventListener("mousemove", drag);
    //   document.addEventListener("mouseup", drop);
    // };

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
              resizable: Node.resizable,
              dir: Node.layout,
            })
          );
        }
        subSplit.pop();
        split = h("div", splitProps(Node), subSplit);
      } else {
        // this is a leaf node
        split = h("div", leafProps(Node), [
          h("div", {}, "header"),
          h(Pane, { title: Node.ID }, ["content"]),
        ]);
      }
      return split;
    };

    const onSplitResize = (part: MouseEvent) => {
      console.log("@@@@@ event " + part.x + "  " + part.y);
    };

    //    context.expose({ rLayout });
    return () => walk(rLayout.treeRoot);
  },
});
</script>

<style scoped>
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
