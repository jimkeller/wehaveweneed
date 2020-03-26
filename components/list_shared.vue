<template>
  <v-layout>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Message</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="50"
            class="elevation-1"
            item-key="id"
            show-expand
            :search="search"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
              ></v-text-field>
              <v-container fluid>
                <v-row>
                  <v-col cols="3" lg="cols[n - 1]" md="6" sm="cols[n - 1]">
                    <v-text-field
                      ref="address"
                      v-model="address"
                      label="Address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" lg="cols[n - 1]" md="6" sm="cols[n - 1]">
                    <v-select
                      ref="dist"
                      v-model="dist"
                      :items="[5, 10, 15, 20, 50]"
                      :rules="distRules"
                      label="Max Distance (mi)"                    
                    >
                      
                    </v-select>
                  </v-col>
                  <v-col cols="3" lg="cols[n - 1]" md="6" sm="cols[n - 1]">
                    <v-btn
                      color="success"
                      class="mr-4"
                      @click="filter"
                      :disabled="canFilter"
                    >
                      Filter
                    </v-btn>
                  </v-col>
                  <v-col cols="3" lg="cols[n - 1]" md="6" sm="cols[n - 1]">
                    <v-btn color="success" class="mr-4" @click="clearFilter">
                      Reset
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                {{ item.notes }}
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  import { GeoFirestore } from 'geofirestore'
  import * as location from './util/location'

  export default {
    props: ['dataSource'],
    data: () => ({
      valid: true,
      dialog: false,
      message: '',
      search: '',
      address: '',
      dist: '',
      distRules: [v => !isNaN(v) || 'Distance must be a number'],
      items: [],
      headers: [
        {
          text: 'Item Name',
          align: 'start',
          sortable: false,
          value: 'item',
        },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Status', value: 'status' },
      ],
      locations: [
        {
          'id': 1,
          'lat': 40.098,
          'long': -75.109
        }
      ]
    }),
    computed: {
      canFilter: function() {
        return !this.address || !this.dist
      }
    },
    methods: {

      handleFirebaseError(error) {
        this.message = error.message;
        this.dialog = true;
    },
    async fetchData() {
      const dataSource = (process.env.NODE_ENV === 'development'? 'dev_': '') + this.dataSource;

      // Create a GeoCollection reference
      const geoCollection = new GeoFirestore(this.$fireStore).collection(
        dataSource
      )

      let result;
      if(this.address) {
        const addressInfo = await location.lookup(this.address)
        result = await geoCollection
          .near({
            center: new this.$fireStoreObj.GeoPoint(
              addressInfo.latitude,
              addressInfo.longitude
            ),
            radius: Number(this.dist)*1.609 //input is in miles, call expects km.
          })
          .get()
          .catch(error => {
            this.handleFirebaseError(error)
          })
      } else {
        result = await geoCollection.firestore
          .collection(dataSource)
          .get()
          .catch(error => {
            this.handleFirebaseError(error)
          })
      }

      let snapshot = result.docs

      snapshot.forEach(doc => {
        const data = doc.data();
        data.id = doc.id;
        this.items.push(data);
      })
    },

    filter() {
      //clear the view
      this.items = []
      //re-fetch with zip and dist.
      this.fetchData()
    },
    clearFilter() {
      //whether we search by distance or not is based on if this.address is present
      //clearing it is sufficient to reset the distance filter
      this.$refs.address.reset()
      this.dist = ''
      this.filter()
    }
  },
  created() {
    this.fetchData()
  }
}
</script>
