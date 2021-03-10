<template>
  <div>
    <v-select
      :items="skins"
      v-model="computedSkin"
      :label="$t('options.skin.skin')"
    ></v-select>
    <v-text-field
      :label="$t('options.skin.hitposition')"
      :rules="percentageRules"
      v-model="computedHitPosition"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.columnsize')"
      :rules="percentageRules"
      v-model="computedColumnSize"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.judgementposition')"
      :rules="percentageRules"
      v-model="computedJudgementPosition"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.judgementsize')"
      :rules="percentageRules"
      v-model="computedJudgementSize"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.comboposition')"
      :rules="percentageRules"
      v-model="computedComboPosition"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.combosize')"
      :rules="percentageRules"
      v-model="computedComboSize"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.effectSize')"
      :rules="percentageRules"
      v-model="computedEffectSize"
      hide-details="auto"
    ></v-text-field>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import info from '../models/info'

export default {
  name: 'OptionsSkin',
  data() {
    return {
      skins: Object.keys(info.skins),
      percentageRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 100 ? true : this.$t('rules.value', {min: 0, max: 100}),
      ],
    };
  },
  computed: {
    ...mapGetters([
      'skin',
      'hitPosition',
      'columnSize',
      'judgementPosition',
      'judgementSize',
      'comboPosition',
      'comboSize',
      'effectSize',
    ]),
    computedSkin: {
      get () {
        return this.skin
      },
      set (value) {
        this.changeSkin({ value: value })
      }
    },
    computedHitPosition: {
      get () {
        return this.hitPosition * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeHitPosition({ value: Number(value) / 100 })
      }
    },
    computedColumnSize: {
      get () {
        return this.columnSize * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeColumnSize({ value: Number(value) / 100 })
      }
    },
    computedJudgementPosition: {
      get () {
        return this.judgementPosition * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeJudgementPosition({ value: Number(value) / 100 })
      }
    },
    computedJudgementSize: {
      get () {
        return this.judgementSize * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeJudgementSize({ value: Number(value) / 100 })
      }
    },
    computedComboPosition: {
      get () {
        return this.comboPosition * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeComboPosition({ value: Number(value) / 100 })
      }
    },
    computedComboSize: {
      get () {
        return this.comboSize * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeComboSize({ value: Number(value) / 100 })
      }
    },
    computedEffectSize: {
      get () {
        return this.effectSize * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeEffectSize({ value: Number(value) / 100 })
      }
    },
  },
  methods: mapActions([
    'changeSkin',
    'changeHitPosition',
    'changeColumnSize',
    'changeJudgementPosition',
    'changeJudgementSize',
    'changeComboPosition',
    'changeComboSize',
    'changeEffectSize',
  ]),
}
</script>