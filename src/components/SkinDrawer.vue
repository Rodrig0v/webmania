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
    <v-row class="my-0 mx-4">
      <v-select
        :items="bmsStyles"
        item-text="label"
        item-value="value"
        v-model="computedBmsStyle"
        :label="$t('options.skin.bmsstyle')"
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
      <div v-if="item.gradient != null" class="d-flex align-center pr-4">
        <v-icon>mdi-gradient</v-icon>
        <v-text-field
          :value="self[item.gradient] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.gradient, $event)"
        ></v-text-field>
      </div>
      <div v-if="item.expand != null" class="d-flex align-center pr-4">
        <v-icon>mdi-arrow-expand-all</v-icon>
        <v-text-field
          :value="self[item.expand] * 100"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 45px"
          @input="onChangeSkinParameter(item.expand, $event)"
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import info from '../models/info'

export default {
  name: 'SkinDrawer',
  data() {
    return {
      self: this,
      bmsStyles: [
        {
          value: 'bmsnone',
          label: this.$t('options.skin.bmsnone'),
        },
        {
          value: 'bmsleft',
          label: this.$t('options.skin.bmsleft'),
        },
        {
          value: 'bmsright',
          label: this.$t('options.skin.bmsright'),
        },
      ],
      skins: Object.keys(info.skins).map((skin) => { return { value: skin, label: this.$t('skins.' + skin) } }),
      items: [
        { id: 'options.skin.upscroll', toggle: 'upScroll' },
        { id: 'options.skin.hint', toggle: 'showHint' },
        { id: 'options.skin.columns', toggle: 'showReceptors', position: 'hitPosition', sizeX: 'columnSize' },
        { id: 'options.skin.background', toggle: 'showBackground', opacity: 'backgroundOpacity' },
        { id: 'options.skin.combo', toggle: 'showCombo', position: 'comboPosition', size: 'comboSize' },
        { id: 'options.skin.judgement', toggle: 'showJudgement', position: 'judgementPosition', size: 'judgementSize', expand: 'judgementBounce' },
        { id: 'options.skin.effects', toggle: 'showEffects', size: 'effectSize' },
        { id: 'options.skin.info', toggle: 'showInfo', size: 'infoSize' },
        { id: 'options.skin.score', toggle: 'showJudgements', size: 'judgementsSize' },
        { id: 'options.skin.timing', toggle: 'showOffset', sizeX: 'offsetSizeX', sizeY: 'offsetSizeY' },
        { id: 'options.skin.accuracy', toggle: 'showAccuracy', size: 'accuracySize' },
        { id: 'options.skin.time', toggle: 'showSongMeter', size: 'songMeterSize' },
        { id: 'options.skin.lanecovertop', toggle: 'showLaneCoverTop', position: 'laneCoverTopPosition', gradient: 'laneCoverTopFade' },
        { id: 'options.skin.lanecoverbottom', toggle: 'showLaneCoverBottom', position: 'laneCoverBottomPosition', gradient: 'laneCoverBottomFade' },
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
      'bmsStyle',
      'columnSize',
      'comboPosition',
      'comboSize',
      'effectSize',
      'fpsSize',
      'hitPosition',
      'infoSize',
      'judgementBounce',
      'judgementPosition',
      'judgementSize',
      'judgementsSize',
      'laneCoverBottomFade',
      'laneCoverBottomPosition',
      'laneCoverTopFade',
      'laneCoverTopPosition',
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
      'showLaneCoverBottom',
      'showLaneCoverTop',
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
        this.changeSkinParameterWithEvent({ id: 'skin', value })
      }
    },
    computedBmsStyle: {
      get () {
        return this.bmsStyle
      },
      set (value) {
        this.changeSkinParameterWithEvent({ id: 'bmsStyle', value })
      }
    }
  },
  methods: {
    ...mapActions([
      'changeSkinParameterWithEvent',
      'changeSkinParameter',
      'resetSkin',
    ]),
    onChangeShowParameter(id, value) {
      this.changeSkinParameter({ id, value: value ? true : false })
    },
    onChangeSkinParameter(id, value) {
      this.changeSkinParameter({ id, value: value / 100 })
    },
    onResetSkin() {
      this.resetSkin()
    },
  }
}
</script>