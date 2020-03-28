<template>
  <section id="firebaseui-auth-container"></section>
</template>

<script>

  import firebase from 'firebase/app'

  export default {
    data: () => ({      
    }),
    head: {
      script: [
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css' }
      ]
    },
    methods: {      
    },
    created() {

    },
    mounted () {

        var firebaseui = require('firebaseui');

        //console.log( 'auth', this.$fireAuthObj);

        let ui = firebaseui.auth.AuthUI.getInstance();

        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }

        var uiConfig = {
            signInSuccessUrl: "/",
            signInOptions: [
              firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ]
        };
        ui.start("#firebaseui-auth-container", uiConfig);    
    },


  }
</script>