<template>
  <v-container>
    <v-row
      column
      justify-center
      align-center
    >
      <v-col

      >
        <v-parallax
          dark
          src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
        >
          <v-row
            align="center"
            justify="center"
          >
            <v-col class="text-center" cols="12">
              <h1 class="display-1 font-weight-thin mb-4">We Have / We Need</h1>
              <h4 class="subheader">Matching people with emergency supplies to the people who need them</h4>
            </v-col>
          </v-row>
        </v-parallax>
      </v-col>
    </v-row>
    <v-row>
      <v-col justify-center>
        <v-btn
          x-large
          color="primary"
          nuxt
          to="/form_have"
        >
          I have something
        </v-btn>
        <v-btn
          x-large
          color="primary"
          nuxt
          to="/form_need"
        >
          I need something
        </v-btn>
        <v-btn
          x-large
          color="primary"
          nuxt
          to="/list_have"
        >
          See available items
        </v-btn>
        <v-btn
          x-large
          color="primary"
          nuxt
          to="/list_need"
        >
          See needed items
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Introduction</v-card-title>
          <v-card-text>
            <p>This is a <strong>prototype</strong> application to help match people who have or can make critical items with people who need those items.</p>
            <p>
              This is not at all feature complete, but can be rapidly improved. It was created by <a href="http://www.github.com/jimkeller">Jim Keller</a> of <a href="https://www.easternstandard.com">Eastern Standard</a>. 
            </p>
            <p>
              It is written in Vue.js with Vuetify, and is <a href="https://github.com/jimkeller/wehaveweneed">available on github</a>
            </p>
            <p>
              If you can help, please get in touch on the <a href="https://www.facebook.com/groups/opensourcecovid19medicalsupplies/">Open Source COVID19 on Facebook</a>
            </p>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Initial use-case</v-card-title>
          <v-card-text>

            <ul>
              <li>User creates a post, either a "have" or a "need"</li>
              <li>They include notes about how to contact them (ideally we'd be able to have email anonymizing like CL, but we're in a rush here)</li>
              <li>They receive a custom link that allows them to manage their post</li>
              <li>Someone can respond to them by email or however they've asked to be contacted</li>
              <li>The original poster can use their unique link to set the status of the request to "in progress" or something
    Once things are complete, or if it falls through, original poster can either close the request or set status to open</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Critical Features</v-card-title>
          <v-card-text>
            <ul>
              <li>A taxonomy of the types of items that may be needed. (in progress, thanks to @Victoria from the <a href="https://codevid19.com/">codevid-19</a> slack)</li>
              <li>Ability to search by geographic distance (in progress, thanks to Stoytcho Stoytchev)</li>
              <li>Ability to login to manage your submissions (in progress)</li>
              <li>Inclusion of Non-US addresses</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Resources</v-card-title>
          <v-card-text>

            <ul>
              <li><a href="https://codevid19.com/">codevid-19</a> hackathon. We are currently collaborating on their <a href="https://join.slack.com/t/codevid-19/shared_invite/zt-cs8amank-jg7vUQeSUgX7K9cM9WZMfQ">slack channel</a></li>
              <li><a href="https://findcollabs.com/project/we-have--we-need-jwVHerxuEp46MGdorreI">We Have / We Need on FindCollabs</a></li>
              <li><a href="https://www.facebook.com/groups/opensourcecovid19medicalsupplies/">Open Source COVID19 on Facebook</a></li>
              <li><a href="https://docs.google.com/spreadsheets/d/1txEanDkIrJ5GNfSk-zlXkTlB-bQPNRN_Y69qEwmdme8/htmlview?sle=true&fbclid=IwAR3GmEtt-uTY6YX91DO3tmQ7MPFecETahZSDt_Z0f1UmNJuGfIOw8kqPu4c">Google sheet</a> where folks have consolidated the kind of information this app aims to propagate.</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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


