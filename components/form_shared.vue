<style>
  form .v-subheader {
    padding-left: 0;
    padding-right: 0;
  }
</style>
<template>
  <v-layout>

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

    <v-container fluid >
      <v-row>
        <v-col cols="6" sm="12">

         <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
          >
            <v-text-field
              v-model="post.name"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="post.email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
                ref="address"
                v-model="post.address"
                :rules="addressRules"
                label="Zip"
                required
                placeholder="79938"
              ></v-text-field>

            <v-container>
              <v-row>
                <v-subheader> Choose an Item category and Item. You can also type in the item field.</v-subheader>
              </v-row>
              <v-row>

                <v-select
                  ref="item_category_select"
                  v-model="post.item_category"
                  :items="item_categories"
                  :rules="[v => !!v || 'Item Category is required']"
                  label="Item Category"
                  required
                  chips
                  item-text='name'
                  item-value='id'
                ></v-select>

                <v-combobox
                  v-model="post.item"
                  :items="filteredItems"
                  :rules="[v => !!v || 'Item is required']"
                  v-bind:label="this.itemFieldLabel"
                  required
                  chips
                  item-text='name'
                  item-value='name'              
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
            ></v-select>            

            <v-text-field
                ref="quantity"
                v-model="post.quantity"
                :rules="[v => !isNaN(v) || 'Quantity must be numeric']"
                label="Quantity"
                required
                placeholder="1"
              ></v-text-field>

            <v-textarea
              v-model="post.notes"
              name="input-additional-notes"
              label="Additional Notes"
              value=""
              hint=""
            ></v-textarea>

            <v-btn
              color="success"
              class="mr-4"
              @click="submitPost"
              :disabled="!valid"
            >
              Submit
            </v-btn>


          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>

  import { GeoFirestore } from 'geofirestore'
  import { v4 as uuidv4 } from 'uuid';
  import * as location from './util/location';

  export default {
    props: ['itemFieldLabel', 'editUuid', 'postType'],
    data: () => ({
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
        v => !!v || 'Zip code is required',
        v => !isNaN(v) || 'Zip code must be numeric'
      ],    
      items: [],
      item_categories: [],
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
        type: ''
      }
    }),
    computed: {
      filteredItems() {
        return this.items.filter(o =>  o.item_category_id == this.post.item_category);
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

          const postCollection = new GeoFirestore(this.$fireStore).collection('posts')
          
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
              item: { 'name': doc_data.item },
              uuid: doc_data.uuid,
              status: doc_data.status
            }

            this.post_id = snapshot[0].id;

            //
            // Get item category from item
            // @TODO - this should probably be a method
            //
            const item_filtered = this.items.filter( o => o.name == doc_data.item ); 

            if ( item_filtered.length > 0 ) {         
              const item_category_id = item_filtered[0].item_category_id;
              const item_category = this.item_categories.filter( o => o.id == item_category_id );

              if ( item_category.length > 0 ) {
                this.post.item_category = { 'id': item_category[0].id, 'name': item_category[0].name }
              }
            }

          }

        }
      },
      async submitPost() {
        const dataSource = (process.env.NODE_ENV === 'development'? 'dev_': '') + this.dataSource;

        try {

          let type_result = await this.$fireStore.collection('item_types').where("name", "==", this.post.item).get().catch( (error) => { this.handleFirebaseError(error) } );
        
          let type_snapshot = type_result.docs;

          //
          // This is a new item type, add it. @TODO - move to a method
          //
          if ( type_snapshot.length <= 0 ) {

            const ref = this.$fireStore.collection("item_types").add(
              {
                name: this.post.item,
                item_category_id: this.post.item_category
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
          const geoCollection = geoFirestore.collection('posts');

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
          
          const db_ref = doc_ref.set(
            {
              email: this.post.email,
              address: this.post.address,
              name: this.post.name,
              notes: this.post.notes,
              quantity: this.post.quantity,
              item: this.post.item.name, //for now we only store the name
              coordinates: new this.$fireStoreObj.GeoPoint(addressInfo.latitude, addressInfo.longitude),
              uuid: this.post.uuid,
              type: this.post.type,
              status: this.post.status
            }
          ).then (
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


  }
</script>