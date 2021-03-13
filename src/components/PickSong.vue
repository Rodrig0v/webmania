<template>
  <div>
    <v-card>

      <v-card-title>
        {{ $t('header.picksong') }}
      </v-card-title>

      <!--v-divider/-->

      <v-card-text>
        <input type="file" @change="processSong">
        <input type="file" @change="processFile">
        <v-btn
          @click="playSong"
          :disabled="song == null || beatmap == null"
        >
          {{ $t('picksong.play') }}
        </v-btn>
      </v-card-text>

      <!--v-divider/-->

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          {{ $t('general.apply') }}
        </v-btn>
      </v-card-actions>

    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OsuParser from '../plugins/osu-parser'
import { Howl } from 'howler';

export default {
  name: 'PickSong',
  data() {
    return {
      song: null,
      beatmap: null,
    }
  },
  computed: mapGetters([
    'volume'
  ]),
  methods: {
    processSong(e) {
      var files = e.target.files;
      for(var i = 0; files[i] != null; i++) {
      var reader  = new FileReader()
        reader.onloadend = () => {
          this.song = new Howl({
            src: reader.result,
            volume: this.volume,
          })
        }
        reader.readAsDataURL(files[i]);
      }
    },
    processFile(e) {
      var files = e.target.files;
      for(var i = 0; files[i] != null; i++) {
        var reader = new FileReader();
        reader.onloadend = () => {
          this.beatmap = OsuParser.parseContent(reader.result)
        };
        reader.readAsText(files[i]);
      }
    },
    playSong() {
      this.$emit('close')
      let canvas = document.getElementById('gameCanvas')
      if(canvas != null) {
        let loadSongEvent = new CustomEvent('loadSong', {'detail': {beatmap: this.beatmap, song: this.song}})
        canvas.dispatchEvent(loadSongEvent)
      }
    }
  }
}
</script>