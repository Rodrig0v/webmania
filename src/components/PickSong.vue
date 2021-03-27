<template>
  <div>
    <v-card v-if="difficulties.length == 0">
      <v-card-text>
        <v-row class="d-flex flex-column" dense align="center" justify="center">
          <v-icon class="mt-5" size="60">
            mdi-cloud-upload
          </v-icon>
          <p>
            {{ $t('upload.picksong') }}
          </p>
          <p style="color: #ac2121; font-weight: bold;">
            {{ $t('upload.warning') }}
          </p>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card v-if="difficulties.length != 0">

      <v-card-text>
        <div style="color: white">
          <h2 class="text-center">{{ difficulties[selectedDifficulty].beatmap.artist }} - {{ difficulties[selectedDifficulty].beatmap.title }}</h2>
          <h3 class="text-center ma-4">{{ difficulties[selectedDifficulty].beatmap.difficultyName }}</h3>
          <div class="d-flex flex-row justify-center align-center ma-4">
            <img class="beatmap-image" :src="difficulties[selectedDifficulty].image"/>
            <div class="mx-4">
              <div>{{ $t('picksong.starrating') }}: {{ difficulties[selectedDifficulty].starRating.toFixed(2) }}</div>
              <div>{{ $t('picksong.length') }}: {{ difficulties[selectedDifficulty].beatmap.length / songRate | time }}</div>
              <div>{{ $t('picksong.bpm') }}: {{ (difficulties[selectedDifficulty].beatmap.bpm * songRate).toFixed(0) }}</div>
              <div>{{ $t('picksong.timingwindows') }}: {{ difficulties[selectedDifficulty].beatmap.timingWindows }}</div>
              <div>{{ $t('picksong.keys') }}: {{ difficulties[selectedDifficulty].beatmap.keys }}</div>
              <div>{{ $t('picksong.notes') }}: {{ difficulties[selectedDifficulty].beatmap.numberNotes }}</div>
              <div>{{ $t('picksong.longnotes') }}: {{ difficulties[selectedDifficulty].beatmap.numberLongnotes }}</div>
            </div>
          </div>
          
          <div class="d-flex flex-wrap justify-center">
          <v-btn
            class="ma-2"
            large
            fab
            v-for="(key, index) in difficulties"
            :key="index"
            @click="changeDifficulty(index)"
          >
            <img class="difficulty-image" :src="difficultyLogo"/>
          </v-btn>
          </div>
        </div>

        <div class="d-flex flex-row">
          <v-text-field :label="$t('picksong.timingwindows')" class="mx-4" v-model="computedTimingWindows"></v-text-field>
          <v-text-field :label="$t('picksong.bpm')" class="mx-4" v-model="computedBpm"></v-text-field>
          <v-text-field :label="$t('picksong.songrate')" class="mx-4" v-model="computedSongRate"></v-text-field>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="playSong"
        >
          {{ $t('picksong.play') }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>

    </v-card>

  </div>
</template>

<script>
import StarRating from '../plugins/star-rating'

export default {
  name: 'PickSong',
  data() {
    return {
      difficultyLogo: require('@/assets/app/logo-dark.png'),
      selectedDifficulty: 0,
      songRate: 1,
      timingWindows: 0,
      songRateRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0.1 && v <= 20 ? true : this.$t('rules.value', {min: 0.1, max: 20}),
      ],
      timingWindowsRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 10 ? true : this.$t('rules.value', {min: 0, max: 10}),
      ],
    }
  },
  props: ['difficulties'],
  computed: {
    computedBpm: {
      get () {
        return this.difficulties[this.selectedDifficulty].beatmap.bpm * this.songRate
      },
      set (value) {
        let number = Number(value)
        let newRate = number / this.difficulties[this.selectedDifficulty].beatmap.bpm
        for(var rule of this.songRateRules) {
          if (rule(newRate) != true) return
        }
        this.songRate = newRate
        this.calcStarRatings()
      }
    },
    computedSongRate: {
      get () {
        return this.songRate
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.songRateRules) {
          if (rule(number) != true) return
        }
        this.songRate = number
        this.calcStarRatings()
      }
    },
    computedTimingWindows: {
      get () {
        return this.timingWindows
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.timingWindowsRules) {
          if (rule(number) != true) return
        }
        this.timingWindows = number
      }
    },
  },
  watch:
  {
    'difficulties'(){
        this.newDifficulties()

    }
  },
  methods: {
    newDifficulties() {
      this.selectedDifficulty = 0
      this.songRate = 1
      this.calcStarRatings()
    },
    changeDifficulty(index) {
      this.selectedDifficulty = index
      this.timingWindows = this.difficulties[this.selectedDifficulty].beatmap.timingWindows
    },
    calcStarRatings() {
      this.timingWindows = this.difficulties[this.selectedDifficulty].beatmap.timingWindows
      for(let difficulty of this.difficulties) {
        difficulty.starRating = StarRating.getStarRating(difficulty.beatmap.notes, parseInt(difficulty.beatmap.keys), this.songRate)
      }
      this.difficulties.sort((difficulty1, difficulty2) => difficulty1.starRating - difficulty2.starRating)
    },
    playSong() {
      this.$emit('close')
      let canvas = document.getElementById('gameCanvas')
      if(canvas != null) {
        let loadSongEvent = new CustomEvent('loadSong', {'detail': {...this.difficulties[this.selectedDifficulty], songRate: this.songRate, timingWindows: this.timingWindows } })
        let makeFullscreenEvent = new CustomEvent('makeFullscreen')
        canvas.dispatchEvent(loadSongEvent)
        canvas.dispatchEvent(makeFullscreenEvent)
      }
    }
  }
}
</script>

<style>
.beatmap-image {
  object-fit: contain;
    width: 300px;
    height: 169px;
}
.difficulty-image {
    width: 48px;
    height: 48px;
}
</style>