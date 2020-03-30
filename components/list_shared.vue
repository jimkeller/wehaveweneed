<template>
  <v-container>
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
            single-expand
            :search="search"
            @item-expanded="onExpand"
            @click:row="rowClicked"
            :expanded.sync="expanded"
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
                      placeholder=""
                      @keydown="addressKeyPress"
                      id="address_autocomplete"
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
              <td :colspan="headers.length" class="blue-grey lighten-4">
                <v-container class="pa-10 ">
                  <v-row>
                    <v-col v-if="item.coordinates">
                      <GMap
                        v-if="mounted"
                        ref="gMap"
                        :center="{lat: item.coordinates.latitude, lng: item.coordinates.longitude}"
                        :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'cooperative' }"
                        :zoom="14"                        
                      >
                        <GMapMarker
                          :position="{lat: item.coordinates.latitude, lng: item.coordinates.longitude}"
                        >

                        </GMapMarker>
                      </GMap>
                    </v-col>
                    <v-col>
                      <v-card>
                        <v-card-text class="pb-0">{{ item.notes }}</v-card-text>
                        <v-card-text v-if="item.quantity">Quantity: {{ item.quantity }}</v-card-text>
                        <v-card-title class="subhead">Contact this person</v-card-title>
                        <v-card-text>
                          <v-textarea
                            v-model="item.email_message"
                            name="input-email-message"
                            label="Message"
                            value=""
                            hint=""
                            outlined
                          ></v-textarea>

                          <v-btn
                            color="success"
                            class="mr-4"
                            @click="sendEmail(item)"
                            :disabled="!item.email_message"
                          >
                            Submit
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <GMap v-show="false">Necessary to get the GMap module to load</GMap>
  </v-container>
</template>

<script>
  import { GeoFirestore } from 'geofirestore'
  import * as location from './util/location'

  export default {
    props: ['postType'],
    data: () => ({
      expanded: [],
      mounted: false,
      valid: true,
      dialog: false,
      message: '',
      search: '',
      address: '',
      address_coords: {},
      address_autocomplete: null,
      dist: 10,
      distRules: [v => !isNaN(v) || 'Distance must be a number'],
      items: [],
      headers: [
        { text: 'Subject/Item',
          align: 'start',
          sortable: false,
          value: 'subject',
        },
        { text: 'Status', value: 'status' },
      ],
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
        const post_collection_name = (process.env.NODE_ENV === 'development'? 'dev_posts': 'posts');

        //
        // Determine the address coordinates
        // 
        if ( !this.address_coords ) {

          if ( !this.address_autocomplete || typeof(this.address_autocomplete.getPlace) == 'undefined' ) {
            this.error = 'Error loading address autocomplete'
          }

          let place = await this.address_autocomplete.getPlace();

          if ( !place || typeof(place.geometry) == 'undefined' || !place.geometry ) {
            this.error = 'Error finding that address. Please try again';
          }

          if ( this.error ) {
            this.dialog = true;
            return false;
          }

          this.address_coords = { 'lat': place.geometry.location.lat(), 'lng': place.geometry.location.lng() }

        }

        // Create a GeoCollection reference
        const geoCollection = new GeoFirestore(this.$fireStore).collection(post_collection_name);

        let result;

        if( typeof(this.address_coords.lat) != 'undefined' ) {
          //
          // Query bounded by address
          //
          //const addressInfo = await location.lookup(this.address)

          console.log('address coords', this.address_coords);

          result = await geoCollection
            .near({
              center: new this.$fireStoreObj.GeoPoint(
                this.address_coords.lat,
                this.address_coords.lng,
              ),
              radius: Number(this.dist)*1.609 //input is in miles, call expects km.
            })
            .where("type", "==", this.postType)
            .get()
            .catch(error => {
              this.handleFirebaseError(error)
            })
        } 
        else {
          result = await geoCollection.firestore
            .collection(post_collection_name)
            .where("type", "==", this.postType)
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
      },
      onExpand( row ) {

      },
      rowClicked( row ) {
        if ( this.expanded.length > 0 ) {
          let cur_expanded = this.expanded[0];
          if ( cur_expanded.id == row.id ) {
            this.expanded = [];
            return;
          }
        }
        
        this.expanded = [ row ];
      },
      sendEmail( item ) {
        console.log('send email for item');
      },
      addressKeyPress() {
        this.address_coords = null;
      }

    },
    created() {
      
    },
    async mounted() {
      this.mounted = true;

      if ( typeof(this.$store.state.user) != 'undefined' && typeof(this.$store.state.user.address) != 'undefined' && typeof(this.$store.state.user.address.lat) != 'undefined' ) {
        if ( this.$store.state.user.address.lat && this.$store.state.user.address.lng ) {          
          this.address_coords = { lat: this.$store.state.user.address.lat, lng: this.$store.state.user.address.lng };
          this.address = this.$store.state.user.address.formatted;
        }
      }
      else {
        navigator.geolocation.getCurrentPosition(geoData => {
          if ( typeof(geoData.coords) != 'undefined' ) {
            this.address_coords = { lat: geoData.coords.latitude, lng: geoData.coords.longitude };
            this.address = 'My Location';
          }
        });          
      }
      
      this.google = await this.$GMaps.google;
      this.address_autocomplete = new this.google.maps.places.Autocomplete(
        document.getElementById('address_autocomplete'),  {}
      );

      this.fetchData();
    }
}
</script>
