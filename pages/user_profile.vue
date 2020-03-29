<style>
  .text--nowrap {
    white-space: nowrap;
  }
</style>
<template>
  <v-layout>

    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">An Error occurred</v-card-title>
        <v-card-text>{{ error }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_success" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Profile Updated</v-card-title>
        <v-card-text>Your profile information has been successfully updated.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_success = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-card>
        <v-card-text>
          <v-card-title class="pl-0">Update your profile</v-card-title>
          <v-row>
            <v-col cols="12" md="8">
             <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="true"
              >
                <div v-if="stored_address && !change_address">
                  Your address: {{ stored_address }} (<a @click="change_address=true;">Change</a>)
                </div>

                <v-text-field
                  v-show="!stored_address || change_address"
                  id="address_autocomplete"
                  outlined
                  v-model="address"
                  label="Address"
                  placeholder=""
                  required
                  append-icon="mdi-map-marker"
                  hint="This is never displayed publicly. You may use a zip code or a full address."
                  persistent-hint
                ></v-text-field>

                <v-row justify="start" align="center">
                  <v-col cols="12" md="7" class="flex-grow-0">
                    <v-checkbox :class="( $vuetify.breakpoint.smAndDown ) ? '' : 'text--nowrap'"
                      v-model="notify"              
                      label="Send me notifications about posts within"
                    ></v-checkbox>
                  </v-col>
                  <v-col class="flex-grow-0 pr-0" :class="( $vuetify.breakpoint.smAndDown ) ? '' : 'pl-0 pt-0'">
                    <v-select
                      :items="[5, 10, 20, 50]"
                      v-model="notify_miles"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col>
                    miles
                  </v-col>
                </v-row>


                <v-btn
                  :disabled="!valid || (change_address && !address)"
                  color="success"
                  class="mr-4"
                  @click="submit"
                >
                  Save
                </v-btn>

              <div id="gmap_ref"></div>
              <GMap ref="gmap" v-show="false">Necessary to get the GMap module to load</GMap>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>

  import { GeoFirestore } from 'geofirestore'

  export default {
    data: () => ({
      valid: true,
      error: '',
      address: '',
      dialog: '',
      dialog_success: false,
      notify: false,
      notify_miles: 10,
      google: null,
      autocomplete: null,
      stored_address: null,
      change_address: true
    }),
    methods: {
      async submit() {
        try {

          let user_record = {};

          if ( this.change_address ) {

            if ( !this.autocomplete || typeof(this.autocomplete.getPlace) == 'undefined' ) {
              this.error = 'Error loading address autocomplete'
            }

            let place = this.autocomplete.getPlace();

            

            if ( !place.geometry ) {
              this.error = 'Error finding that address. Please try again';
            }

            if ( this.error ) {
              this.dialog = true;
              return false;
            }

            user_record = 
            { 
              address: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                formatted: place.formatted_address,
                name: place.name,
                id: place.id
              },
              coordinates: new this.$fireStoreObj.GeoPoint(place.geometry.location.lat(), place.geometry.location.lng())
            };

            place.address_components.forEach(
              function( component ) {
                if ( typeof(component.types) != 'undefined' ) {
                  component.types.forEach( 
                    function( component_type ) {
                      if ( component_type == 'postal_code' ) {
                        user_record.address.zip = component.long_name;
                      }
                    }
                  );
                }
              }
            );

          }

          user_record.notify = this.notify;
          user_record.notify_miles = this.notify_miles;


          const userCollection = new GeoFirestore(this.$fireStore).collection('user_data')

          await userCollection.doc(this.$store.state.user.uid)
            .set(user_record)
            .catch(
              (error) => {
                var errorCode = error.code;
                
                this.error = error.message;
                this.dialog = true;

              }
            );
          
          this.dialog_success = true;
        } catch (e) {
          throw e;
        }
      },
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
    created () {
      console.log('created');
      //this.initForm();      
    },
    async mounted() {

      let google;

      this.google = await this.$GMaps.google;

      if ( this.$store.state.user && typeof(this.$store.state.user.address) != 'undefined' && typeof(this.$store.state.user.address.formatted) != 'undefined' ) {
          this.stored_address = this.$store.state.user.address.formatted;
          this.change_address = false;
          console.log('no change address');          
      }

      // console.log('stored address', this.$store.state.user.address);

      // if ( this.$store.state.user && typeof(this.$store.state.user.address) != 'undefined' && typeof(this.$store.state.user.address.id) != 'undefined' ) {
      //   //this.address = this.$store.state.user.address.formatted;

      //   console.log("LOOKUP");
      //   let placeRequest = { placeId: this.$store.state.user.address.id };
      //   let placeService = new this.google.maps.places.PlacesService('gmap_ref');
      //   placeService.getDetails(placeRequest, (placeResult, placeServiceStatus) => {
      //     console.log('placeService :: placeResult = ', placeResult, '\n',
      //       'placeServiceStatus = ', placeServiceStatus);

      //     this._handlePlaceChange(placeResult);

      //   });

      // }

      this.autocomplete = new this.google.maps.places.Autocomplete(
        document.getElementById('address_autocomplete'),  {}
      );


    }


  }
</script>