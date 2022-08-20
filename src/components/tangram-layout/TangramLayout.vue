<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  reactive,
  h,
  VNode,
  shallowRef,
  computed,
  Ref,
} from "vue";
import {
  TreeNode,
  createTree,
  getTreeSize,
  removeChild,
  insertChild,
  moveChild,
} from "./tree";

import Pane from "./Pane.vue";
import Splitter from "./Splitter.vue";
import GetStarted from "./GetStarted.vue";

export default defineComponent({
  name: "TangramLayout",
  props: {
    layout: {
      default: createTree(),
    },
    pluginComponents: {
      default: {},
    },
    theme: {
      type: Object,
      default: "dark",
    },
    showHeader: {
      default: true,
    },
    showControls: {
      default: true,
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
    let themeColor = computed(() => {
      let split: { bgColor: any } = { bgColor: "white" };
      let pane: { headerBgColor: any; bodyBgColor: any; color: any } = {
        headerBgColor: "white",
        bodyBgColor: "white",
        color: "black",
      };
      // let treeRoot = {};
      if (typeof props.theme === "string") {
        switch (props.theme) {
          case "dark":
            split.bgColor = "#1e1e1e";
            pane.headerBgColor = "#1e1e1e";
            pane.bodyBgColor = "#2d2d2d";
            pane.color = "#c4c4c4";
            break;
          default:
            // "light":
            split.bgColor = "#fefefe";
            pane.headerBgColor = "#fefefe";
            pane.bodyBgColor = "#ececec";
            pane.color = "#2d2d2d";
        }
      } else {
        split = props.theme.split;
        pane = props.theme.pane;
      }

      return { split, pane };
    });

    //Dynamically load components
    // const pluginComponents = shallowRef(new Map<String, any>());
    // Object.keys(props.plugins).forEach((element) => {
    //   pluginComponents.value.set(
    //     element,
    //     defineAsyncComponent(() => import(`../plugins/${props.plugins[element].dir}`))
    //   );
    // });
    // pluginComponents.value.set("GetStarted", GetStarted);

    const previewRef = ref() as Ref<HTMLElement>; //dragging preview
    const dragRef = ref() as Ref<HTMLElement>; //dragging node thumbnail

    let splitProps = (node: TreeNode) => {
      let cssClass = ["split", node.layout]; //, node.resizable ? "resizable" : ""
      return {
        id: node.ID,
        class: cssClass,
        style: {
          "background-color": themeColor.value.split.bgColor,
          "flex-basis": `${node.proportion}%`,
        },
      };
    };

    let paneProps = (node: TreeNode) => {
      return {
        id: node.ID,
        nodeId: node.ID,
        class: "leaf view",
        targetView: "view-" + node.ID,
        style: {
          // "background-color": themeColor.value.pane.bodyBgColor,
          // color: themeColor.value.pane.color,
          "flex-basis": `${node.proportion}%`,
        },
        onmousedown: node.ID !== "treeRoot" ? onViewDragStart : "",
      };
    };

    let getTargetPosInfo = (
      event: MouseEvent,
      targetRect: DOMRect,
      gap: number = 0.3
    ) => {
      let layout = null;
      let relativePosition = null;
      let pIdx = -1;
      if (!targetRect) {
        return { layout, relativePosition, pIdx };
      }
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
      pos.forEach((v, i) => {
        if (v < min) {
          min = v;
          pIdx = i;
        }
      });
      switch (pIdx) {
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
      return { layout, relativePosition, pIdx };
    };

    let moveDragPane = (event: MouseEvent = null) => {
      if (!event) {
        dragRef.value.style.display = "none";
        return;
      }
      dragRef.value.style.display = "block";
      dragRef.value.style.top = event.clientY - 10 + "px";
      dragRef.value.style.left = event.clientX - 25 + "px";
    };

    let previewPane = (
      event: MouseEvent = null,
      targetRect: DOMRect = undefined,
      pIdx: number = 0
    ) => {
      if (!event || pIdx === -1 || !targetRect) {
        previewRef.value.style.display = "none";
        return;
      }
      previewRef.value.style.display = "inherit";
      let gap = 0.5;
      var gapW = targetRect.width * gap;
      var gapH = targetRect.height * gap;

      previewRef.value.style.position = "absolute";
      switch (pIdx) {
        case 0:
          previewRef.value.style.top = targetRect.top + "px";
          previewRef.value.style.left = targetRect.left + "px";
          previewRef.value.style.width = targetRect.width + "px";
          previewRef.value.style.height = gapH + "px";

          break;
        case 1:
          previewRef.value.style.top = targetRect.bottom - gapH + "px";
          previewRef.value.style.left = targetRect.left + "px";
          previewRef.value.style.width = targetRect.width + "px";
          previewRef.value.style.height = gapH + "px";

          break;
        case 2:
          previewRef.value.style.top = targetRect.top + "px";
          previewRef.value.style.left = targetRect.left + "px";
          previewRef.value.style.width = gapW + "px";
          previewRef.value.style.height = targetRect.height + "px";
          break;
        case 3:
          previewRef.value.style.top = targetRect.top + "px";
          previewRef.value.style.left = targetRect.right - gapW + "px";
          previewRef.value.style.width = gapW + "px";
          previewRef.value.style.height = targetRect.height + "px";
          break;
        default:
          previewRef.value.style.display = "none";
          break;
      }
    };

    let onViewDragStart = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement;
      const nodeIdAttr = target.hasAttribute("nodeId");
      const dragAttr = target.hasAttribute("pane-drag");
      if (!nodeIdAttr && !dragAttr) return;

      const nodeId = target.getAttribute("nodeId");
      dragMoveState.dragMoveNodeID = nodeId;
      dragMoveState.dragTargetNodeID = nodeId;
      dragMoveState.dragMoveNodeName = rLayout[nodeId].name;
      // console.log(nodeId);

      event.preventDefault();
      event.stopPropagation();

      document.addEventListener("mousemove", onViewDrag);
      document.addEventListener("mouseup", onViewDrop);
    };

    let onViewDrag = (event: MouseEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      // drag.over = null; // reset over
      dragRef.value.style.pointerEvents = "none";
      previewRef.value.style.pointerEvents = "none";
      var viewDom = document.elementFromPoint(event.clientX, event.clientY);
      previewRef.value.style.pointerEvents = null;
      dragRef.value.style.pointerEvents = null;
      // find parent
      for (
        ;
        viewDom && viewDom.matches && !viewDom.matches(".view");
        viewDom = viewDom.parentNode as Element
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
      if (dragMoveState.dragMoveNodeID !== dragMoveState.dragTargetNodeID) {
        previewPane(event, targetDomRect, tarPosInfo.pIdx);
      } else {
        previewPane();
      }
      moveDragPane(event);
    };

    let onViewDrop = (event: MouseEvent) => {
      if (event.button !== 0) return;
      previewPane();
      moveDragPane();
      // console.log(dragMoveState);
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
      document.removeEventListener("mousemove", onViewDrag);
      document.removeEventListener("mouseup", onViewDrop);
    };

    const onSplitResize = (splitInfo: {
      p: number;
      childID1: string;
      childID2: string;
    }) => {
      var totalP =
        rLayout[splitInfo.childID1].proportion + rLayout[splitInfo.childID2].proportion;

      var leftP = Math.min(totalP * splitInfo.p, totalP);

      //
      // console.log(splitInfo.p);
      // console.log(leftP);

      rLayout[splitInfo.childID1].proportion = leftP;
      rLayout[splitInfo.childID2].proportion = totalP - leftP;
    };

    const onRemoveNode = (nodeID) => {
      removeChild(rLayout, nodeID);
    };

    const onAddNode = (nodeInfo) => {
      let newNode;
      if (nodeInfo.vNode === undefined) {
        newNode = {
          name: "Get Started",
          layout: "horizontal",
          relativePosition: 0,
          twinID: undefined,
          vNode: GetStarted,
        };
      } else {
        newNode = {
          name: nodeInfo.name,
          layout: "horizontal",
          relativePosition: 0,
          twinID: nodeInfo.twinID,
          vNode: nodeInfo.vNode,
        };
      }
      insertChild(rLayout, newNode);
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
              // resizable: Node.resizable,
              dir: Node.layout,
            })
          );
        }
        subSplit.pop();
        split = h("div", splitProps(Node), subSplit);
      } else {
        // create a new leaf node
        split = h("div", paneProps(Node), [
          Node.ID !== "treeRoot"
            ? h(
                Pane,
                {
                  onRemoveNode,
                  onAddNode,
                  title: Node.name,
                  nodeId: Node.ID,
                  plugins: props.pluginComponents,
                  theme: themeColor.value.pane,
                  showHeader: props.showHeader,
                  showControls: props.showControls,
                },
                () =>
                  h(
                    typeof Node.vNode === "string"
                      ? props.pluginComponents.get(Node.vNode).component
                      : Node.vNode,
                    {},
                    () => []
                  )
              )
            : h(
                "div",
                {
                  class: "emptyLayout",
                  onmousedown: onAddNode,
                },
                ["Click me to start"]
              ),
        ]);
      }
      return split;
    };
    context.expose({ themeColor });
    return () =>
      h("div", { class: "layout-container", style: { height: "100%" } }, [
        walk(rLayout.treeRoot),
        h("div", { class: "preview", ref: previewRef }, []),
        h(
          "div",
          {
            class: "drag",
            ref: dragRef,
            style: {
              height: "20",
              overflow: "hidden",
              color: themeColor.value.pane.color,
              backgroundColor: themeColor.value.pane.headerBgColor,
              opacity: "0.5",
            },
          },
          [dragMoveState.dragMoveNodeName]
        ),
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
  border-color: #ececec;
  border-width: 2px;
  border-style: solid;
  height: 100%;
}

.emptyLayout {
  width: 120px;
  margin-top: 20%;
  margin-inline: auto;
  color: gray;
}
.emptyLayout:hover {
  margin-top: 20%;
  background: yellow;
  box-sizing: content-box;
  color: blue;
}

.leaf {
  border: 1px;
  border-style: dotted;
  border-color: black;
  overflow: overlay;
}

.layout-container > * {
  /* margin: 4px; */
  box-sizing: border-box;
}

/* all views */
.layout-container .view {
  border: transparent;
  /* transition: all 0.0001s; */
}

/* preview */
.layout-container > .preview {
  display: none;
  background: rgba(155, 155, 155, 0.4);
  transition: all 0.3s;
}
/* drag layer */
.layout-container > .drag {
  display: block;
  transform: scale(1) translate(0%, 0%);
  transition: transform 0.3s;
  position: absolute;
}
</style>
