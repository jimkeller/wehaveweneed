<template>
  <v-app wehaveweneed>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
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
      :clipped-left="clipped"
      fixed
      app
      class="shrink light-blue darken-4 white--text"
      >

      <v-app-bar-nav-icon dark @click.stop="drawer = !drawer" />

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          class="white--text"
          text
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <!-- <v-icon left dark>mdi-{{ item.icon }}</v-icon> -->          
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-container>
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
      clipped: false,
      drawer: false,
      fixed: false,
      menuItems: [
        //{ title: 'Home', path: '/', icon: 'home' },
        { title: 'I Have Something', path: '/form_have', icon: 'check_box' },
        { title: 'I Need Something', path: '/form_need', icon: 'check_box_outline_blank' },
        { title: 'See available items', path: '/list_have', icon: 'list' },
        { title: 'See needed items', path: '/list_need', icon: 'check_box_outline_blank' },
        //{ title: 'Sign Up', path: '/sign_up', icon: 'face' }
      ],
      miniVariant: false,
      appTitle: 'We Have / We Need'
    }
  }
}
</script>
