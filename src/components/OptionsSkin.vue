<template>
  <div>
    <v-select
      :items="skins"
      item-text="label"
      item-value="value"
      v-model="computedSkin"
      :label="$t('options.skin.skin')"
    ></v-select>
    <v-text-field
      :label="$t('options.skin.hitposition')"
      :rules="percentageRules"
      v-model="computedHitPosition"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.columnsize')"
      :rules="percentageRules"
      v-model="computedColumnSize"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.judgementposition')"
      :rules="percentageRules"
      v-model="computedJudgementPosition"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.judgementsize')"
      :rules="percentageRules"
      v-model="computedJudgementSize"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.comboposition')"
      :rules="percentageRules"
      v-model="computedComboPosition"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.combosize')"
      :rules="percentageRules"
      v-model="computedComboSize"
    ></v-text-field>
    <v-text-field
      :label="$t('options.skin.effectSize')"
      :rules="percentageRules"
      v-model="computedEffectSize"
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
      skins: Object.keys(info.skins).map((skin) => { return { value: skin, label: this.$t('skins.' + skin) } }),
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
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'hitPosition', value: number / 100 })
      }
    },
    computedColumnSize: {
      get () {
        return this.columnSize * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'columnSize', value: number / 100 })
      }
    },
    computedJudgementPosition: {
      get () {
        return this.judgementPosition * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'judgementPosition', value: number / 100 })
      }
    },
    computedJudgementSize: {
      get () {
        return this.judgementSize * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'judgementSize', value: number / 100 })
      }
    },
    computedComboPosition: {
      get () {
        return this.comboPosition * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'comboPosition', value: number / 100 })
      }
    },
    computedComboSize: {
      get () {
        return this.comboSize * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'comboSize', value: number / 100 })
      }
    },
    computedEffectSize: {
      get () {
        return this.effectSize * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeSkinParameter({ id: 'effectSize', value: number / 100 })
      }
    },
  },
  methods: mapActions([
    'changeSkin',
    'changeSkinParameter',
  ]),
}
</script>