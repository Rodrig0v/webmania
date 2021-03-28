// vue.config.js

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/webmania/'
  : '/',

  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
  
