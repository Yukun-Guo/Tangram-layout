<script lang="ts">
import { defineComponent, ref, reactive, h } from "vue";
import { removeChild } from "../utils/tree";
export default defineComponent({
  name: "TangramLayout",
  props: {
    layout: Object,
    a: String,
  },
  setup(props) {
    let rlayout = reactive(props.layout);

    const remove = () => {
      console.log("remove");

      removeChild(rlayout, "7");
    };

    const walk = () => {
      return h("div", "bbb");
    };

    return () => walk();
  },
});
</script>

<style scoped></style>
