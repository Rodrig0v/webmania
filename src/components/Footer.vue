<template>
  <v-footer id="footer" :fixed=true>
    <v-col class="text-center" cols="12">
      <img width="16" height="12" class="locale" v-for="(locale) in locales" :key="locale.code" @click="$i18n.locale = locale.code" :src="locale.image">
      {{ $t('footer.version') }}
      <strong>Beta 4.0</strong>
      {{ ' — ' }}
      {{ $t('footer.madeby') }}
      <strong>Rodrig0v</strong>
      {{ ' — ' }}
      <a href="https://discord.gg/uncMv398ew" target="_blank"><strong>{{ $t('footer.discord') }}</strong></a>
      {{ ' — ' }}
      <a href="https://www.paypal.com/donate?hosted_button_id=J4HKPQP6MPLX2" target="_blank"><strong>{{ $t('footer.donate') }}</strong></a>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      locales: [
        {
          code: 'en',
          image: require('@/assets/locales/en.png')
        },
        {
          code: 'pt',
          image: require('@/assets/locales/pt.png')
        }
      ]
    }
  }
}
</script>

<style>
.locale {
  margin-right: 8px;
  cursor: pointer;
}
</style>