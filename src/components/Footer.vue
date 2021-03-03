<template>
  <v-footer>
    <v-col class="text-center" cols="12">
      <img width="16" height="12" class="locale" v-for="(locale) in locales" :key="locale.code" @click="$i18n.locale = locale.code" :src="locale.image">
      <i18n path="footer.message" tag="span">
        <template v-slot:author>
          <strong>{{ $t('footer.author') }}</strong>
        </template>
        <template v-slot:community>
          <strong>{{ $t('footer.community') }}</strong>
        </template>
      </i18n>
      <a href="">{{ $t('footer.donate') }}</a>
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