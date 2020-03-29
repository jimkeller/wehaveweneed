<style>
  form .v-subheader {
    padding-left: 0;
    padding-right: 0;
  }

  .firebaseui-container {
    margin: 0;
  }

  .firebaseui-idp-list {
    padding-left: 0 !important;
  }

  .firebaseui-list-item {
    padding-left: 0 !important;
    text-align: left !important;
  }
</style>
<template>
  <v-container>

    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Message</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_success" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Successfully saved</v-card-title>
        <v-card-text>Your post was successfully saved.</v-card-text>
        <v-card-text>Your management link is: {{ management_url }}</v-card-text>
        <v-card-text>Copy this link and paste it somewhere safe! You will need it later</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_success = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-row>
        <v-col cols="12" lg="10">      
        <v-card class="pb-4 mb-4" v-show="!this.$store.state.user.uid">
          <v-card-title class="subtitle-1">Please sign in before submitting this form</v-card-title>
          <div id="firebaseui-auth-container"></div>
        </v-card>
        

         <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="true"
          >

            <!--
            <v-text-field
              outlined
              v-model="post.name"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            
            <v-text-field
              outlined
              v-model="post.email"
              :rules="emailRules"
              label="Your E-mail Address"
              placeholder="you@gmail.com"
              required
            ></v-text-field>
            -->

            <v-text-field
                outlined
                ref="address"
                v-model="post.address"
                :rules="addressRules"
                label="Address"
                required
                placeholder="79938"
                append-icon="mdi-map-marker"
              ></v-text-field>

            <header class="pa-0" v-if="postType=='have'">I am offering:</header>
            <header class="pa-0" v-if="postType=='need'">I am in need of:</header>
            <v-radio-group v-model="post.offering_type" row>
              <v-radio
                v-for="type in offering_types"
                :key="type.key"
                :label="type.label"
                :value="type.key"
              ></v-radio>
            </v-radio-group>

            <v-container v-if="post.offering_type=='service'">
              <v-row>
                <v-text-field
                  v-model="post.subject"
                  label="Short description of the service"
                  required
                  placeholder="Someone to buy groceries"
                  outlined
                  :required="post.offering_type=='service'"
                ></v-text-field>
              </v-row>
            </v-container>

            <v-container v-if="post.offering_type=='good'">
              <v-row>
                <!-- <header> Choose an Item category and Item. You can also type in the item field.</header> -->
                <header>Choose or type an item below</header>
              </v-row>
              <v-row>

                <!--
                <v-select
                  ref="item_category_select"
                  v-model="post.item_category"
                  :items="item_categories"
                  :rules="[v => !!v || 'Item Category is required']"
                  label="Item Category"
                  :required="post.offering_type=='good'"
                  chips
                  item-text='name'
                  item-value='id'
                  outlined
                ></v-select>
                -->

                <v-combobox
                  v-model="post.item"
                  :items="items"
                  :rules="[v => !!v || 'Item is required']"
                  v-bind:label="this.itemFieldLabel"
                  :required="post.offering_type=='good'"
                  chips
                  item-text='name'
                  item-value='name'
                  outlined          
                ></v-combobox>
              </v-row>
            </v-container>

            <v-select
              v-if="editUuid"
              v-model="post.status"
              :items="post_statuses"
              label="Status"
              required
              chips
              outlined
            ></v-select>            

            <v-text-field 
                v-if="post.offering_type=='good'"
                ref="quantity"
                v-model="post.quantity"
                :rules="[v => !isNaN(v) || 'Quantity must be numeric']"
                label="Quantity"
                required
                placeholder="1"
                outlined
              ></v-text-field>

            <v-textarea
              v-model="post.notes"
              name="input-additional-notes"
              label="Additional Notes"
              value=""
              hint=""
              outlined
            ></v-textarea>

            <v-btn
              color="success"
              class="mr-4"
              @click="submitPost"
              :disabled="!valid || !this.$store.state.user.uid"
            >
              Submit
            </v-btn>


          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>

  import { GeoFirestore } from 'geofirestore'
  import { v4 as uuidv4 } from 'uuid';
  import * as location from './util/location';
  import firebase from 'firebase/app';

  export default {
    props: ['itemFieldLabel', 'editUuid', 'postType'],
    head: {
      script: [
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css' }
      ]
    },
    data: () => ({
      user: {},
      valid: true,
      dialog: false,
      dialog_success: false,
      message: '',
      post_statuses: [ 'New', 'Matched', 'Cancelled' ],
      nameRules: [
        v => !!v || 'Name is required'        
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      addressRules:[
        v => !!v || 'Address is required',
      ],    
      items: [],
      item_categories: [],
      offering_types: [
        { 'key': 'good', 'label': 'Goods' },
        { 'key': 'service', 'label': 'Services' },
      ],
      lazy: false,      
      management_url: '',
      post_id: null, //the firestore document id
      post: {
        uuid: '',      
        email: '',
        item: '',
        item_category: '',
        name: '',
        addr: '',
        quantity: 1,
        notes: '',
        status: 'New',
        type: '',
        offering_type: 'good',
        subject: ''
      }
    }),
    computed: {
      filteredItems() {
        return this.items.filter(o => o.item_category_id == this.post.item_category && typeof o.name === "string");
      }
    },  
    methods: {

      handleFirebaseError(error) {
        this.message = error.message;
        this.dialog = true;
      },

      async initForm() {

        //
        // Get item categories
        //
        let result = await this.$fireStore.collection('item_categories').get().catch( (error) => { this.handleFirebaseError(error) } );
        let snapshot = result.docs;

        snapshot.forEach(
          (doc) => {
            let data = doc.data();
            data.id = doc.id;
            this.item_categories.push( data );
          }
        );

        //
        // Get items
        //
        result = await this.$fireStore.collection('item_types').get().catch( (error) => { this.handleFirebaseError(error) } );
        snapshot = result.docs;

        snapshot.forEach(
          (doc) => {
           this.items.push( doc.data() );
          }
        );

        //
        // If this is an edit, get the post
        //
        if ( this.editUuid ) {
          const post_collection_name = (process.env.NODE_ENV === 'development'? 'dev_posts': 'posts'); //@TODO - use firestore config for environments
          const postCollection = new GeoFirestore(this.$fireStore).collection(post_collection_name)
          
          let post_result = await postCollection.where("uuid", "==", this.editUuid).get().catch( (error) => { this.handleFirebaseError(error) } );
          
          snapshot = post_result.docs;

          if ( snapshot.length > 0 ) {
            let doc_data = snapshot[0].data();
            
            //
            // @TODO - this should be dynamic rather than having every field listed
            //
            this.post = {
              name: doc_data.name,
              email: doc_data.email,
              address: doc_data.address,
              quantity: doc_data.quantity,
              notes: doc_data.notes,
              item: { name: doc_data.item },
              uuid: doc_data.uuid,
              status: doc_data.status,
              offering_type: doc_data.offering_type,
              subject: doc_data.subject
            }

            this.post_id = snapshot[0].id;

            //
            // Get item category from item
            // @TODO - this should probably be a method
            //
            // const item_filtered = this.items.filter( o => o.name == doc_data.item ); 

            // if ( item_filtered.length > 0 ) {         
            //   const item_category_id = item_filtered[0].item_category_id;
            //   const item_category = this.item_categories.filter( o => o.id == item_category_id );

            //   if ( item_category.length > 0 ) {
            //     this.post.item_category = { 'id': item_category[0].id, 'name': item_category[0].name }
            //   }
            // }

          }

        }
      },
      async submitPost() {
        const post_collection_name = (process.env.NODE_ENV === 'development'? 'dev_posts': 'posts');

        try {

          let item_name = ( typeof(this.post.item) == 'string' ) ? this.post.item : this.post.item.name;
          
          let type_result = await this.$fireStore.collection('item_types').where("name", "==", item_name).get().catch( (error) => { this.handleFirebaseError(error) } );
        
          let type_snapshot = type_result.docs;

          //
          // This is a new item type, add it. @TODO - move to a method
          //
          if ( type_snapshot.length <= 0 ) {            

            const ref = this.$fireStore.collection("item_types").add(
              {
                name: item_name,
                //item_category_id: this.post.item_category
              }
            ).then (
              () => {
                
              }
            ).catch( 
              (error) => {
                this.handleFirebaseError( error );
              }
            );

          }
          
          //
          // Set the post type ("have" or "need")
          //
          this.post.type = this.postType;

          const geoFirestore = new GeoFirestore(this.$fireStore);
          const geoCollection = geoFirestore.collection(post_collection_name);

          let doc_ref;

          //
          // This is an edit, set the doc id
          //
          if ( this.editUuid ) {
            if ( !this.post_id ) {
              this.handleFirebaseError( { 'message': 'No post id found. Cannot update' } );
              return false;
            }
            
            doc_ref = geoCollection.doc(this.post_id);

          }
          else {

            //
            // Generate a UUID for this post
            //
            this.post.uuid = uuidv4();
            doc_ref = geoCollection.doc();
          }

          const addressInfo = await location.lookup(this.post.address);          

          if ( !addressInfo || typeof(addressInfo.latitude) == 'undefined' || !addressInfo.latitude ) {
            this.handleFirebaseError( { 'message': 'Could not look up address data based on that zip code. Please check the value and try again.'} );
            return false;
          }          

          if ( this.post.offering_type == 'good' ) {
            this.post.subject = item_name;
          }

          let doc_record = {
            address: this.post.address,
            notes: this.post.notes,
            quantity: this.post.quantity,
            coordinates: new this.$fireStoreObj.GeoPoint(addressInfo.latitude, addressInfo.longitude),
            uuid: this.post.uuid,
            type: this.post.type,
            status: this.post.status,
            offering_type: this.post.offering_type,
            subject: this.post.subject            
          }

          if ( this.post.offering_type == 'good' ) {
            doc_record.item = item_name;
          }
          
          const db_ref = doc_ref.set( doc_record ).then (
            (doc_ref) => {
              this.management_url = window.location.protocol + '//' + window.location.host + '/manage/' + this.postType + '/' + this.post.uuid;
              this.dialog_success = true;

              if ( !this.editUuid ) {
                this.reset();
              }
            }
          ).catch(
            (error) => {
              this.handleFirebaseError( error );
            }
          );

        }
        catch (e) {
          throw e;
        }
      },
      validate () {
        this.$refs.form.validate()
        //return (this.$store.state.user && this.$store.state.user.uid && this.$refs.form.validate());
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
    created () {
      this.initForm();      
    },
    mounted() {
      if(this.$store.state.user.uid === null) {
        // Populate search with current geolocation data
        navigator.geolocation.getCurrentPosition(geoData => {
          this.post.address = "coords: " + geoData.coords.latitude + ", " + geoData.coords.longitude;
        });
      } else {
        if(this.$store.state.user.address) this.post.address = this.$store.state.user.address.formatted
      }

      if ( !this.$store.state.user || !this.$store.state.user.uid ) {

        var firebaseui = require('firebaseui');

        //console.log( 'auth', this.$fireAuthObj);

        let ui = firebaseui.auth.AuthUI.getInstance();

        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }

        var uiConfig = {
          signInFlow: 'popup',
          signInOptions: [
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
          ],
          callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
              // User successfully signed in.
              // Return type determines whether we continue the redirect automatically
              // or whether we leave that to developer to handle.

              console.log('auth result');

              return false;
            }
          }
        };
        
        ui.start("#firebaseui-auth-container", uiConfig);    
      }


    }


  }
</script>