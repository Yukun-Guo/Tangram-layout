<script lang="ts">
import { defineComponent, ref, reactive, h, VNode, computed } from "vue";
export default defineComponent({
  props: {
    resizable: { type: Boolean, default: true },
    dir: { type: String, default: "horizontal" },
    splitPortion: { type: String, default: "50%" },
  },
  setup(props, content) {
    let state = {
      resizing: false,
      split: props.splitPortion || "50%",
    };
    let splitClass = computed(() => [
      "split",
      "splitter",
      props.dir,
      state.resizing ? "resizing" : "",
      props.resizable ? "resizable" : "",
    ]);

    let startResize = (event: MouseEvent) => {
      if (!props.resizable || event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();
      state.resizing = true;

      // const drag = (event:MouseEvent) => {
      //   if (event.button !== 0) return
      //   const h = props.dir === 'horizontal'
      //   var splitter = (h ? content.$el.children[1].clientWidth : this.$el.children[1].clientHeight) / 2
      //   var parentRect = this.$el.getBoundingClientRect()
      //   var splitSize = h
      //     ? (event.x - parentRect.left - splitter) / this.$el.clientWidth * 100
      //     : (event.y - parentRect.top - splitter) / this.$el.clientHeight * 100
      //   state.split = splitSize + '%'
      //   content.emit('onSplitResize', event, this, state.split)
      // }
      // const drop = (event:MouseEvent) => {
      //   if (event.button !== 0) return
      //   state.resizing = false
      //   document.removeEventListener('mousemove', drag)
      //   document.removeEventListener('mouseup', drop)
      // }
      // document.addEventListener('mousemove', drag)
      // document.addEventListener('mouseup', drop)
    };
    return () => {
      return h(
        "div",
        {
          class: [
            "split",

            props.dir,
            state.resizing ? "resizing" : "",
            props.resizable ? "resizable" : "",
            "splitter",
          ],
        },
        []
      );
    };
  },
});
</script>
<style>
.split {
  display: flex;
  flex: 1;
  height: 100%;
}

.split > .content {
  position: relative;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
}

.split > .content > * {
  flex: 1;
  height: 100%;
}

.split > .content:last-child {
  flex: 1;
}

.split > .splitter {
  flex-basis: 6px;
}

.split.vertical {
  flex-direction: column;
}

.split.horizontal {
  flex-direction: row;
}

.split.resizable.vertical > .splitter {
  cursor: row-resize;
}

.split.resizable.horizontal > .splitter {
  cursor: col-resize;
}

/* Splitter styling */
.split > .splitter {
  flex-basis: 8px;
  position: relative;
  background: transparent;
  transition: all 0.3s;
}

.split.resizable > .splitter:hover,
.split.resizable.resizing > .splitter {
  background: rgba(100, 100, 100, 0.4);
  transition: all 0.3s;
}
</style>
