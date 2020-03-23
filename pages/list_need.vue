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

    <v-container fluid >
      <v-row>
        <v-col cols="12" >

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
                      ref="zip"
                      v-model="zip"
                      :rules="zipRules"
                      label="ZIP / Postal Code"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" lg="cols[n - 1]" md="6" sm="cols[n - 1]">
                    <v-text-field
                      ref="dist"
                      v-model="dist"
                      :rules="distRules"
                      label="Distance"
                    ></v-text-field>
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
            <td :colspan="headers.length">{{ item.notes }}</td>
          </template>

          </v-data-table>

        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import { GeoFirestore } from 'geofirestore'
import * as zipcodes from 'zipcodes'

  export default {
    data: () => ({
      valid: true,
      dialog: false,
      message: '',
      search: '',
      zip: '',
      zipRules: [v => !!zipcodes.lookup(v) || 'Zip code must be valid'],
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
        { text: 'Zip', value: 'zip' },
      ],
    }),
    computed: {
      canFilter: function() {
        return !this.zip || !this.dist
      }
    },
    methods: {

      handleFirebaseError(error) {
        this.message = error.message;
        this.dialog = true;
      },
      async fetchData() {
        const geoCollection = new GeoFirestore(this.$fireStore).collection(
          'available_items'
        )
        const zipInfo = zipcodes.lookup(this.zip)
        const result = this.zip //if there's a zip code, filter on the distance
          ? await geoCollection
              .near({
                center: new this.$fireStoreObj.GeoPoint(
                  zipInfo.latitude,
                  zipInfo.longitude
                ),
                radius: Number(this.dist)*1.609 //input is in miles, call expects km.
              })
              .get()
              .catch(error => {
                this.handleFirebaseError(error)
              })
          : await geoCollection.firestore
              .collection('available_items')
              .get()
              .catch(error => {
                this.handleFirebaseError(error)
              })

        let snapshot = result.docs

        snapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          console.log(data);
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
        //whether we search by distance or not is based on if this.zip is present
        //clearing it is sufficient to reset the distance filter
        this.$refs.zip.reset()
        this.dist = ''
        this.filter()
      }
    },
    created () {
      console.log('created');
      this.fetchData();
    },


  }
</script>
