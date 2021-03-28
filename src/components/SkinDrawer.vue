<template>
  <v-list class="overflow-y-auto" style="width: 400px; height: 100%;">
    <v-row class="my-0 mx-4">
      <v-select
        :items="skins"
        item-text="label"
        item-value="value"
        v-model="computedSkin"
        :label="$t('options.skin.skin')"
      ></v-select>
    </v-row>
    <v-row v-for="(item, index) in items"
      :key="index"
      class="my-0 mx-4"
    >
      <div>
        <v-switch :disabled="item.toggle == null" dense :input-value="self[item.toggle]" @change="onChangeShowParameter(item.toggle, $event)"></v-switch>
      </div>
      <div class="align-self-center pr-4">{{ $t(item.id) }}</div>
      <div v-if="item.position != null" class="d-flex align-center pr-4">
        <v-icon>mdi-arrow-up-down</v-icon>
        <v-text-field
          :value="self[item.position] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.position, $event)"
        ></v-text-field>
      </div>
      <div v-if="item.size != null" class="d-flex align-center pr-4">
        <v-icon>mdi-arrow-top-right-bottom-left-bold</v-icon>
        <v-text-field
          :value="self[item.size] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.size, $event)"
        ></v-text-field>
      </div>
      <div v-if="item.sizeX != null" class="d-flex align-center pr-4">
        <v-icon>mdi-arrow-left-right-bold</v-icon>
        <v-text-field
          :value="self[item.sizeX] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.sizeX, $event)"
        ></v-text-field>
      </div>
      <div v-if="item.sizeY != null" class="d-flex align-center pr-4">
        <v-icon>mdi-arrow-up-down-bold</v-icon>
        <v-text-field
          :value="self[item.sizeY] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.sizeY, $event)"
        ></v-text-field>
      </div>
      <div v-if="item.opacity != null" class="d-flex align-center pr-4">
        <v-icon>mdi-opacity</v-icon>
        <v-text-field
          :value="self[item.opacity] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.opacity, $event)"
        ></v-text-field>
      </div>
    </v-row>
    <v-row class="my-0 mx-4">
      <v-btn color="blue darken-1" @click="onResetSkin">
        <v-icon left>mdi-replay</v-icon>
        <span class="mr-2">{{ $t('general.reset') }}</span>
      </v-btn>
    </v-row>
  </v-list>
  <!--v-select
    :items="skins"
    item-text="label"
    item-value="value"
    v-model="computedSkin"
    :label="$t('options.skin.skin')"
  ></v-select>
  <v-switch
    :label="$t('options.skin.upscroll')"
    v-model="computedUpScroll"
  ></v-switch>
  <v-text-field
    :label="$t('options.skin.receptors')"
    v-model="computedHitPosition"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.columns')"
    v-model="computedColumnSize"
  ></v-text-field>
  <v-row>
    <v-switch
      :label="$t('options.skin.upscroll')"
      v-model="computedUpScroll"
    ></v-switch>
    <div>{{ $t('options.skin.judgement') }}</div>
    <v-slider
      min="0"
      max="100"
      step="0.1"
      thumb-label
      v-model="computedJudgementPosition"
    ></v-slider>
    <v-slider
      min="0"
      max="100"
      step="0.1"
      thumb-label
      v-model="computedJudgementSize"
    ></v-slider>
  </v-row>
  <v-text-field
    :label="$t('options.skin.combo')"
    v-model="computedComboPosition"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.combo')"
    v-model="computedComboSize"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.accuracy')"
    v-model="computedAccuracySize"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.background')"
    v-model="computedBackgroundOpacity"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.fps')"
    v-model="computedFpsSize"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.info')"
    v-model="computedInfoSize"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.score')"
    v-model="computedJudgementsSize"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.timing')"
    v-model="computedOffsetSizeX"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.timing')"
    v-model="computedOffsetSizeY"
  ></v-text-field>
  <v-text-field
    :label="$t('options.skin.time')"
    v-model="computedSongMeterSize"
  ></v-text-field-->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import info from '../models/info'

export default {
  name: 'SkinDrawer',
  data() {
    return {
      self: this,
      skins: Object.keys(info.skins).map((skin) => { return { value: skin, label: this.$t('skins.' + skin) } }),
      items: [
        { id: 'options.skin.upscroll', toggle: 'upScroll' },
        { id: 'options.skin.hint', toggle: 'showHint' },
        { id: 'options.skin.columns', toggle: 'showReceptors', position: 'hitPosition', sizeX: 'columnSize' },
        { id: 'options.skin.background', toggle: 'showBackground', opacity: 'backgroundOpacity' },
        { id: 'options.skin.combo', toggle: 'showCombo', position: 'comboPosition', size: 'comboSize' },
        { id: 'options.skin.judgement', toggle: 'showJudgement', position: 'judgementPosition', size: 'judgementSize' },
        { id: 'options.skin.effects', toggle: 'showEffects', size: 'effectSize' },
        { id: 'options.skin.info', toggle: 'showInfo', size: 'infoSize' },
        { id: 'options.skin.score', toggle: 'showJudgements', size: 'judgementsSize' },
        { id: 'options.skin.timing', toggle: 'showOffset', sizeX: 'offsetSizeX', sizeY: 'offsetSizeY' },
        { id: 'options.skin.accuracy', toggle: 'showAccuracy', size: 'accuracySize' },
        { id: 'options.skin.time', toggle: 'showSongMeter', size: 'songMeterSize' },
        { id: 'options.skin.fps', toggle: 'showFps', size: 'fpsSize' },
      ]
    };
  },
  mounted() {
    document.getElementById('canvasWrapper').style.width = 'calc(100% - 400px)'
  },
  destroyed() {
    document.getElementById('canvasWrapper').style.width = '100%'
  },
  computed: {
    ...mapGetters([
      'accuracySize',
      'backgroundOpacity',
      'columnSize',
      'comboPosition',
      'comboSize',
      'effectSize',
      'fpsSize',
      'hitPosition',
      'infoSize',
      'judgementPosition',
      'judgementSize',
      'judgementsSize',
      'offsetSizeX',
      'offsetSizeY',
      'showAccuracy',
      'showBackground',
      'showCombo',
      'showEffects',
      'showFps',
      'showHint',
      'showInfo',
      'showJudgement',
      'showJudgements',
      'showLighting',
      'showOffset',
      'showReceptors',
      'showSongMeter',
      'skin',
      'songMeterSize',
      'upScroll',
    ]),
    computedSkin: {
      get () {
        return this.skin
      },
      set (value) {
        this.changeSkin({ value: value })
      }
    },
  },
  methods: {
    ...mapActions([
      'changeSkin',
      'changeSkinParameter',
      'resetSkin',
    ]),
    onChangeSkin(value) {
      this.changeSkin({ value })
    },
    onChangeShowParameter(id, value) {
      this.changeSkinParameter({ id, value: value ? true : false })
    },
    onChangeSkinParameter(id, value) {
      this.changeSkinParameter({ id, value: value / 100 })
    },
    onResetSkin() {
      this.resetSkin()
    }
  }
}
</script>