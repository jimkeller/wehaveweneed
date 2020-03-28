<style scoped>
  .v-parallax {
    font-size: 2em;
  }

  .v-card {
    margin-bottom: 25px;
  }
</style>

<template>

  <v-container fluid class="pa-0 ma-0">
    <v-img
      fill-height
      fluid
      max-height="600px"
      :min-height="( $vuetify.breakpoint.smAndDown ) ? '200px' : '400px'"
      :src="require('@/assets/img/kelly-sikkema-heart-hands.jpg')"
      class="pa-0 ma-0"
      gradient="to top right, rgba(0,0,0,.7), rgba(0,0,0,.4)"
    >
      <v-container fill-height align="center" justify="center">
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
            <h1 class="white--text display-2 mb-4">WeHave / WeNeed</h1>
            <h4 class="subheader white--text headline">Getting emergency supplies to the people who need them</h4>        
          </v-col>
        </v-row>
      </v-container>
    </v-img>

    <v-container>

      <v-row>

        <v-col
          v-for="button in buttons"
          :key="button.link"
          cols="12"
          md="3"
        >


          <v-card
            color="light-blue darken-4 white--text"
            dark
            class="d-flex align-center"
            outline
            hover
            height="150"
            :to="button.link"
          >
            <v-card-text>
              <p class="text-center title font-weight-regular white--text">
                {{ button.label }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Vision</v-card-title>
            <v-card-text>
              <p>Our goal is to help match people who have or can make critical items with people who need those items.</p>
              <p>Users are able to create a posts, either a "have" or a "need". We will then connect them with the right people to fulfill their request.</p>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title>Collaborators</v-card-title>
            <v-card-text>
              The following people have contributed to this project:
              <ul>
                <li><a target="_new" href="https://github.com/jimkeller">Jim Keller</a></li>
                <li>Stoytcho Stoytchev</li>
                <li><a target="_new" href="https://github.com/chen-robert">Robert Chen</a></li>
                <li>@Victoria from the codevid-19 slack channel</li>
              </ul>
              <br>
              <p>We would love your help too! Please get in touch on the <a href="https://www.facebook.com/groups/opensourcecovid19medicalsupplies/">Open Source COVID19 on Facebook</a>, or through <a href="https://github.com/jimkeller/wehaveweneed">our Github repository</a>!
              </p>
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
          <v-card>
            <v-card-title>Contact</v-card-title>
            <v-card-text>
              <p>
                Right now the best place to find us is the <a href="https://join.slack.com/t/codevid-19/shared_invite/zt-cs8amank-jg7vUQeSUgX7K9cM9WZMfQ">codevid-19 slack channel</a>
              </p>
              <p>
                You can contact Jim directly at jimk - at - easternstandard.com
              </p>          
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>

export default {

  data: () => ({
    'buttons': [
      { 'label': 'I Have Something', 'link': '/form_have' },
      { 'label': 'I Need Something', 'link': '/form_need' },
      { 'label': 'Find Something', 'link': '/list_have' },
      { 'label': 'See What People Need', 'link': '/list_need' }
    ]
  }),
  mounted() {
    console.log('mounted');

  }
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


