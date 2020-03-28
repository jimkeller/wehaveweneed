import colors from 'vuetify/es5/util/colors'

export default {

  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + 'We Have / We Need',
    title: 'We Have / We Need',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'An application to help match people with emergency supplies to those with the need/demand for supplies' },
      { hid: 'og:description', name: 'og:description', content: 'An application to help match people with emergency supplies to those with the need/demand for supplies' },
      { hid: 'og:title', name: 'og:title', content: 'We Have / We Need' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'We Have / We Need' },

    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyANiHf3C8EswR7HWLENDuAVmxr06okgp6c",
          authDomain: "wehaveweneed-2020.firebaseapp.com",
          databaseURL: "https://wehaveweneed-2020.firebaseio.com",
          projectId: "wehaveweneed-2020",
          storageBucket: "wehaveweneed-2020.appspot.com",
          messagingSenderId: "841246024988",
          appId: "1:841246024988:web:b4901625d57bef230306d9"
        },
        services: {
          auth: true,
          firestore: true
        },
        auth: {
          initialize: {
            onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
            // onAuthStateChangedAction: 'onAuthStateChangedAction'
          },
          ssr: true
        }
      }
    ],  
    // ['nuxt-gmaps', {
    //   key: 'AIzaSyANiHf3C8EswR7HWLENDuAVmxr06okgp6c',
    //   //you can use libraries: ['places']
    // }]
  
  ],
  pwa: {
    // disable the modules you don't need
    meta: false,
    icon: false,
    // if you omit a module key form configuration sensible defaults will be applied
    // manifest: false,

    workbox: {
      importScripts: [
        // ...
        '/firebase-auth-sw.js'
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: false
    }
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
}
