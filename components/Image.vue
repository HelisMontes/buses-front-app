<template>
  <div>
    <img
      v-if="src"
      :src="`${API_BASE_URL}/images/${src}`"
      :alt="alt"
      width="100"
      height="100"

      @click="openImage"
    />
    <dialog
      v-if="src"
      ref="dialog"
      class="modal"
    >
      <div
        class="content-close"
      >
        <button
          @click="closeImage"
        >
          X
        </button>
      </div>
      <img
        v-if="src"
        :src="`${API_BASE_URL}/images/${src}`"
        :alt="alt"
        class="image-modal"

        @click="closeImage"
      />
    </dialog>
  </div>
</template>

<script setup>
const { src, alt } = defineProps(['src', 'alt'])

const { API_BASE_URL } = useRuntimeConfig()

const dialog = ref(null)

const openImage = () => {
  dialog.value.showModal()
}
const closeImage = () => {
  dialog.value.close()
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.image-modal {
  width: 100% !important;
  height: 100% !important;
  padding: 20px;
}

.content-close {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>