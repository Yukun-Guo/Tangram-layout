<template>
  <Transition name="PaneName">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="trapRef">
          <div class="modal-body">New view name:</div>
          <input
            ref="inputRef"
            class="modal-input"
            name="paneName"
            :value="paneName"
            @keyup.enter="close"
            @keydown.esc="cancel"
          />
          <div class="modal-buttons">
            <button class="modal-ok-button" @click="close">OK</button>
            <button class="modal-cancel-button" @click="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import useFocusTrap from "./useFocusTrap";
export default defineComponent({
  props: {
    show: Boolean,
    paneName: String,
  },
  setup(props, context) {
    const { trapRef } = useFocusTrap();
    const inputRef = ref(null);
    let close = () => {
      context.emit("close", inputRef.value.value);
    };
    let cancel = () => {
      context.emit("close", null);
    };
    return { close, cancel, inputRef, trapRef };
  },
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.03s ease;
}

.modal-wrapper {
  display: flex;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 10px 20px 10px 20px;
  background-color: #fffffc;
  border-radius: 0px 0px 5px 5px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  color: #42b983;
}

.modal-body {
  margin-bottom: 5px;
}
.modal-input {
  margin-right: 3px;
  padding: 5px;
  width: -webkit-fill-available;
  border: 2px solid #e1e1e1;
}
.modal-input:focus {
  outline: none !important;
  border: 2px solid #1a73e8;
  border-radius: 3px;
}

.modal-buttons {
  display: flex;
  float: right;
}
.modal-cancel-button {
  margin-top: 5px;
  margin-left: 5px;
  padding: 5px 10px 5px 10px;
  color: #1a73e8;
  background: #fffffc;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
}

.modal-ok-button {
  margin-top: 5px;
  margin-left: 5px;
  padding: 5px 15px 5px 15px;
  color: #fffffc;
  background: #1a73e8;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
}

.modal-ok-button:hover {
  background: #1a43ff;
}

.modal-cancel-button:hover {
  background: #d1d1d1;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
