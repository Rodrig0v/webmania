<template>
  <div id="drop-zone" :class="{ 'dropping': dragover }">

    <!-- LOADING DIALOG -->

    <v-dialog
      v-model="loading"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ $t('general.loading') }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ERROR DIALOG -->
    <v-dialog
      v-model="error"
      max-width="300"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('general.error') }}
        </v-card-title>
        <v-card-text>{{ $t('upload.' + errorCode) }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="error = false"
          >
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FileParser from '../plugins/file-parser'
export default {
  name: 'Upload',
  data() {
    return {
      lastTarget: null,
      dragover: false,
      error: false,
      errorCode: 'corruptosz',
      loading: false,
    };
  },
  created() {
    window.addEventListener("dragenter", (e) => {
      this.dragover = true
      this.lastTarget = e.target;
    });

    window.addEventListener("dragleave", (e) => {
      e.preventDefault();
      if (e.target === document || e.target === this.lastTarget) {
        this.dragover = false
      }
    });

    window.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dragover = false
      this.onDrop(e)
    });
  },
  methods: {
    async onDrop(e) {
      this.loading = true
      try {
        let files = []
        for(let item of e.dataTransfer.items) {
          if (item != null && item.kind == 'file')
            files.push(item.webkitGetAsEntry())
        }
        if(files.length == 0) return
        let header = document.getElementById('header')
        if(header != null) {
          let newDifficultiesEvent = new CustomEvent('newDifficulties', {'detail': await FileParser.parseFiles(files)})
          header.dispatchEvent(newDifficultiesEvent)
        }
      } catch(err) {
        this.errorCode = err
        this.error = true
      } finally {
        this.loading = false
      }
    },
  },
};
</script>
<style>
#drop-zone {
  width: 100%;
  height: 100%;
  position: fixed;
  visibility: hidden;
  z-index: 999;
}
.dropping {
  background-color: #d3d3d388;
  visibility: visible !important;
}
</style>