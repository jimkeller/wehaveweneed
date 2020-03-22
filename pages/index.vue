<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
      </div>
      <v-card>
        <v-card-title class="headline">
          We Have / We Need
        </v-card-title>
        <v-card-text>
          <v-img src="~/assets/logo.svg" />
          <p>This is a <strong>prototype</strong> application to help match people who have or can make critical items with people who need those items.</p>
          <p>
            This is not at all feature complete, but can be rapidly improved. It was created by <a href="http://www.github.com/jimkeller">Jim Keller</a> of <a href="https://www.easternstandard.com">Eastern Standard</a>. 
          </p>
          <p>
            The most critical features for this to be viable are:
          </p>
          <ul>
            <li>A strong taxonomy of the types of items that may be needed.</li>
            <li>Ability to search by geographic distance</li>
            <li>Ability to login to manage your submissions (in progress)</li>
            <li>Inclusion of Non-US addresses</li>
          </ul>
          <p>
            It is written in Vue.js with Vuetify, and is <a href="https://github.com/jimkeller/wehaveweneed">available on github</a>
          <p>
            If you can help, please get in touch on the <a href="https://www.facebook.com/groups/opensourcecovid19medicalsupplies/">Open Source COVID19 on Facebook</a>
          </p>
          <p>
            Resources:            
          </p>
          <ul>
            <li><a href="https://www.facebook.com/groups/opensourcecovid19medicalsupplies/">Open Source COVID19 on Facebook</a></li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            nuxt
            to="/form_have"
          >
            I have something
          </v-btn>
          <v-btn
            color="primary"
            nuxt
            to="/form_need"
          >
            I need something
          </v-btn>
          <v-btn
            color="primary"
            nuxt
            to="/list_have"
          >
            See available items
          </v-btn>
          <v-btn
            color="primary"
            nuxt
            to="/list_need"
          >
            See needed items
          </v-btn>

        </v-card-actions>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  // head () {
  //   return {
  //     app_title: "We Have / We Need",
  //     description: 'An application to help match people with emergency supplies to those with the need/demand for supplies',
  //     meta: [
  //       // hid is used as unique identifier. Do not use `vmid` for it as it will not work
  //       { hid: 'description', name: 'description', content: this.description,
  //         hid: 'og:description', name: 'og:description', content: this.description,
  //         hid: 'og:title', name: 'og:title', content: this.app_title,
  //         hid: 'og:site_name', name: 'og:site_name', content: this.app_title
  //       }
  //     ]
  //   }
  // }
}
</script>


