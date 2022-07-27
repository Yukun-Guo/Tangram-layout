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
import Hello from "./HelloWorld.vue";
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
    let dragMoveState = reactive({
      dragMoveNodeName: null,
      dragTargetNodeID: null,
      dragMoveNodeID: null,
      layout: "horizontal",
      relativePosition: 1,
    });
    let drag = null;
    let previewDiv = h("div", { class: "preview" }, []);

    let dragw = ref(1);
    let dragh = ref(1);
    let dragDiv = h(
      "div",
      {
        // class: "drag" + (drag ? "dragging" : ""),
        style: {
          width: dragw,
          height: dragh,
          transformOrigin: drag ? drag.offset.x + "px " + drag.offset.y + "px" : "",
        },
      },
      [dragMoveState.dragMoveNodeName]
    );

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
        nodeId: node.ID,
        class: "leaf view",
        targetView: "view-" + node.ID,
        style: { "flex-basis": `${node.proportion}%` },
        onmousedown: node.ID !== "treeRoot" ? onViewDragStart : "",
      };
    };

    let getTargetPosInfo = (event: MouseEvent, targetRect: DOMRect, gap: number) => {
      let layout = null;
      let relativePosition = null;
      if (!targetRect) return { layout, relativePosition };
      gap = gap || 0.3;
      var gapW = targetRect.width * gap;
      var gapH = targetRect.height * gap;
      var tPos = {
        x: event.clientX - targetRect.left,
        y: event.clientY - targetRect.top,
      };

      var pos = [
        tPos.y - gapH,
        targetRect.height - gapH - tPos.y,
        tPos.x - gapW,
        targetRect.width - gapW - tPos.x,
      ];
      var min = 0;
      var idx = -1;
      pos.forEach((v, i) => {
        if (v < min) {
          min = v;
          idx = i;
        }
      });
      switch (idx) {
        case 0:
          layout = "vertical";
          relativePosition = 0;
          break;
        case 1:
          layout = "vertical";
          relativePosition = 1;
          break;
        case 2:
          layout = "horizontal";
          relativePosition = 0;
          break;
        case 3:
          layout = "horizontal";
          relativePosition = 1;
          break;
        default:
          layout = null;
          relativePosition = null;
          break;
      }
      return { layout, relativePosition };
    };

    let onViewDragStart = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const nodeIdAttr = event.target.hasAttribute("nodeId");
      const dragAttr = event.target.hasAttribute("pane-drag");
      if (!nodeIdAttr && !dragAttr) return;

      var el = event.target;
      const nodeId = el.getAttribute("nodeId");
      dragMoveState.dragMoveNodeID = nodeId;
      dragMoveState.dragMoveNodeName = rLayout[nodeId].name;
      console.log(nodeId);

      event.preventDefault();
      event.stopPropagation();

      const trect = el.getBoundingClientRect();
      console.log(trect);
      console.log(event.clientX);

      // drag = {
      //   nodeName: node,
      //   offset: {x: e.clientX - trect.left, y: e.clientY - trect.top}
      // }

      document.addEventListener("mousemove", onViewDrag);
      document.addEventListener("mouseup", onViewDrop);
    };

    let onViewDrag = (event: MouseEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      // drag.over = null; // reset over
      var viewDom = document.elementFromPoint(event.clientX, event.clientY);

      // find parent
      // var viewDom = el;
      for (
        ;
        viewDom && viewDom.matches && !viewDom.matches(".view");
        viewDom = viewDom.parentNode
      ) {}
      let targetDomRect = null;
      dragMoveState.dragTargetNodeID = null;
      if (viewDom instanceof HTMLElement) {
        // skip if parent is not an HTMLElement
        dragMoveState.dragTargetNodeID = viewDom.getAttribute("nodeId");
        targetDomRect = viewDom.getBoundingClientRect();
      }
      let tarPosInfo = getTargetPosInfo(event, targetDomRect);
      dragMoveState.layout = tarPosInfo.layout;
      dragMoveState.relativePosition = tarPosInfo.relativePosition;
      dragw = "20px";
      dragh = "20px";
      console.log(dragMoveState);
    };

    let onViewDrop = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (
        dragMoveState.dragMoveNodeID !== dragMoveState.dragTargetNodeID &&
        dragMoveState.layout
      ) {
        let tmpNode = rLayout[dragMoveState.dragMoveNodeID];
        tmpNode.twinID = dragMoveState.dragTargetNodeID;
        tmpNode.layout = dragMoveState.layout;
        tmpNode.relativePosition = dragMoveState.relativePosition;
        moveChild(rLayout, tmpNode);
      }

      // {
      //   ID: dragMoveNodeID,
      //   name: rLayout[dragMoveNodeID].name,
      //   isShow: true,
      //   layout: "horizontal",
      //   relativePosition: 1,
      //   twinID: dragTargetNodeID,
      // }

      document.removeEventListener("mousemove", onViewDrag);
      document.removeEventListener("mouseup", onViewDrop);
    };

    const walk = (Node: TreeNode): VNode => {
      let split: VNode;

      if (Node.children.length >= 1) {
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
          Node.ID !== "treeRoot"
            ? h(Pane, { title: Node.name }, [h(Node.vNode, {}, [])])
            : h("div", { class: "emptyLayout" }, ["Empty Layout"]),
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
              // insertChild(rLayout, {
              //   ID: "1",
              //   name: "Pane 1",
              //   layout: "horizontal",
              //   resizable: true,
              //   relativePosition: 1,
              //   twinID: undefined,
              //   minSize: 20,
              //   vNode: Hello,
              // });
              moveChild(rLayout, {
                ID: "4",
                name: "New Panel 4",
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
        previewDiv,
        dragDiv,
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

.emptyLayout {
  margin-top: 20%;
  color: gray;
}
.leaf {
  background-color: chartreuse;
  border: 1px;
  border-style: dotted;
  border-color: black;
  overflow: overlay;
}

.layout-container,
.split {
  background: transparent;
}

.layout-container > * {
  margin: 4px;
  box-sizing: border-box;
}

/* all views */
.layout-container .view {
  border: solid 1px transparent;
  transition: all 0.3s;
}

/* preview */
.layout-container > .preview {
  background: rgba(155, 155, 155, 0.4);
  border: dashed 1px #666;
  transition: all 0.3s;
}

/* drag layer */
.layout-container > .drag {
  display: block;
  transform: scale(1) translate(0%, 0%);
  transition: transform 0.3s;
}

.layout-container > .drag.dragging {
  opacity: 0.5;
  box-shadow: 0 0 20px 4px rgba(0, 0, 0, 0.4);
  transform: scale(0.5) translate(0%, 0%);
}
</style>
