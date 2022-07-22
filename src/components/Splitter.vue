<template>
  <div ref="el" :class="splitClass" @mousedown="startResize"></div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, h, VNode, computed, onMounted } from "vue";
export default defineComponent({
  props: {
    leftChildId: { type: String, default: null },
    rightChildId: { type: String, default: null },
    resizable: { type: Boolean, default: true },
    dir: { type: String, default: "horizontal" },
    splitPortion: { type: String, default: "50%" },
  },
  emits: ["splitResize"],
  setup(props, context) {
    let state = reactive({
      resizing: false,
      // split: props.splitPortion || "50%",
    });

    const el = ref(null);

    let splitClass = computed(() => [
      "split",
      "splitter",
      props.dir,
      state.resizing ? "resizing" : "",
      props.resizable ? "resizable" : "",
    ]);

    let startResize = (event: MouseEvent) => {
      if (!props.resizable || event.button !== 0) return;
      console.log("startResize");
      event.stopPropagation();
      event.preventDefault();
      state.resizing = true;

      const drag = (event: MouseEvent) => {
        if (event.button !== 0) return;
        // console.log("drag");
        const h = props.dir === "horizontal";
        // console.log([event.x, event.y]);
        // console.log(el.value.getBoundingClientRect());
        // console.log(el.value.parentElement.getBoundingClientRect());
        // calculate resized proportion
        var elRect = el.value.getBoundingClientRect();
        var leftChildRect = { left: 0, top: 0, width: 100, height: 100 };
        var rightChildRect = { width: 100, height: 100 };
        el.value.parentElement.childNodes.forEach((element: any) => {
          if (element.id === props.leftChildId) {
            leftChildRect = element.getBoundingClientRect();
          } else if (element.id === props.rightChildId) {
            rightChildRect = element.getBoundingClientRect();
          }
        });
        var leftChildProportion = h
          ? (event.x - leftChildRect.left) / (leftChildRect.width + rightChildRect.width)
          : (event.y - leftChildRect.top) /
            (leftChildRect.height + rightChildRect.height);

        leftChildProportion = Math.min(Math.max(0.01, leftChildProportion), 0.99);
        console.log("leftp " + leftChildProportion);

        context.emit("splitResize", {
          p: leftChildProportion,
          childID1: props.leftChildId,
          childID2: props.rightChildId,
        });
      };

      const drop = (event: MouseEvent) => {
        if (event.button !== 0) return;
        console.log("drop");
        state.resizing = false;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", drop);
      };
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", drop);
    };
    return {
      state,
      el,
      props,
      startResize,
      splitClass,
    };
    // return () => {
    //   return h(
    //     "div",
    //     {
    //       class: [
    //         "split",
    //         props.dir,
    //         state.resizing ? "resizing" : "",
    //         props.resizable ? "resizable" : "",
    //         "splitter",
    //       ],
    //       onmousedown: startResize,
    //     },
    //     []
    //   );
    // };
  },
});
</script>
<style>
.split {
  display: flex;
  /* flex: 1; */
  /* height: 100%; */
}

.split > .content {
  position: relative;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
}

/* .split > .content:last-child {
  flex: 1;
} */

/* .split.splitter {
  flex-basis: 4px;
} */

.split.vertical {
  flex-direction: column;
}

.split.horizontal {
  flex-direction: row;
}

.split.resizable.vertical.splitter {
  cursor: row-resize;
}

.split.resizable.horizontal.splitter {
  cursor: col-resize;
}

/* Splitter styling */
.split.splitter {
  flex-basis: 6px;
  position: relative;
  background: transparent;
  transition: all 0.3s;
}

.split.resizable.splitter:hover,
.split.resizable.resizing.splitter {
  background: rgb(0, 122, 201);
  transition: all 0.1s;
}

.split.resizable.splitter::after {
  position: absolute;
  content: " ";
  z-index: 10;
  transition: all 0.3s;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
}
</style>
