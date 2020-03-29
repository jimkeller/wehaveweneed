<template>
  <v-app wehaveweneed>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      disable-resize-watcher
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.path"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-app-bar 
      fixed
      app
      class="shrink light-blue darken-4 white--text"
      :extension-height="( $vuetify.breakpoint.smAndDown ) ? 0 : '60px'"
      dense
      >

        <v-container>
          <v-row align="center" class="justify-space-between">
            <v-col>
              <v-container style="min-width:300px">
                <v-row align="center" class="flex-shrink-0" >
                  <v-col class="d-md-none flex-grow-0">
                    <v-app-bar-nav-icon dark @click.stop="drawer = !drawer" class="d-md-none" />
                  </v-col>
                  <v-col>
                    <v-toolbar-title class="">
                      <router-link to="/" tag="span" style="cursor: pointer">
                        {{ appTitle }}
                      </router-link>
                    </v-toolbar-title>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col align="right" v-show="this.$store.state.user.email">
              <span>{{ this.$store.state.user.email }}</span><a class="pl-2 white--text" @click="userSignOut">(logout)</a>
            </v-col>
            <v-col align="right" v-show="!this.$store.state.user.email">
              <v-btn :small="( $vuetify.breakpoint.smAndDown ) ? true : false" to="/sign_in">Sign In</v-btn>              
            </v-col>
          
          </v-row>
        </v-container>

        <template v-slot:extension>
          <v-container class="hidden-sm-and-down ">

            <v-tabs background-color="light-blue darken-4">
              <v-tab                
                class="light-blue darken-4 white--text"
                text
                v-for="item in menuItems" 
                :key="item.title"               
                :to="item.path">
                <!-- <v-icon left dark>mdi-{{ item.icon }}</v-icon> -->          
                {{ item.title }}
              </v-tab>
            </v-tabs>


          </v-container>          
        </template>

    </v-app-bar>


    <v-content>
      <v-container fluid class="pa-0 ma-0">
        <nuxt />
      </v-container>
    </v-content>
   
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      fixed: false,
      menuItems: [
        { title: 'Home', path: '/', icon: 'home' },
        { title: 'I Have Something', path: '/form_have', icon: 'check_box' },
        { title: 'I Need Something', path: '/form_need', icon: 'check_box_outline_blank' },
        { title: 'See available items', path: '/list_have', icon: 'list' },
        { title: 'See needed items', path: '/list_need', icon: 'check_box_outline_blank' },
        //{ title: 'Sign In', path: '/sign_in', icon: 'face' }
      ],
      appTitle: 'We Have / We Need'
    }
  },
  methods: {
    async userSignOut() {
      await this.$fireAuth.signOut().catch(function(error) {
        console.log('logout error', error);
      });

      this.$router.go({ path: 'login' });

    }


  }
}
</script>
