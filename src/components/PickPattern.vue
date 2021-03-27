<template>
  <div>
    <v-card>

      <v-card-title>
        {{ $t('header.pickpattern') }}
      </v-card-title>

      <div style="text-align: center">
        Coming soon
        </div>
      <!--v-divider/-->

      <!--<v-card-text>
        <v-select
          :items="keyModes"
          v-model="computedKeyMode"
          :label="$t('pickpattern.keymode')"
        ></v-select>
        <v-text-field
          :label="$t('pickpattern.bpm')"
          :rules="bpmRules"
          v-model="computedBpm"
            ></v-text-field>
      </v-card-text>-->

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
import { mapActions } from 'vuex'

export default {
  name: 'PickPattern',
  data() {
    return {
      keyModes: [1,2,3,4,5,6,7],
      currentKeyMode: 4,
      currentBpm: 191,
      bpmRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 9999 ? true : this.$t('rules.value', {min: 0, max: 9999}),
      ],
    }
  },
  computed: {
    computedBpm: {
      get () {
        return this.currentBpm
      },
      set (value) {
        for(var rule of this.bpmRules) {
          if (rule(value) != true) return
        }
        this.currentBpm = Number(value)
      }
    },
    computedKeyMode: {
      get () {
        return this.currentKeyMode
      },
      set (value) {
        this.currentKeyMode = value
      }
    },
  },
  methods: mapActions([
    'changeBpm',
    'changeKeyMode',
  ]),
}
</script>