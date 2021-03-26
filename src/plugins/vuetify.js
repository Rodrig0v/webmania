import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify)

const opts = {
  theme: {
    dark: true,
    options: {
      themeCache: {
        get: key => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, value),
      },
    },
  },
}

export default new Vuetify(opts)
