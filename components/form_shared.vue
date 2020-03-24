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
        <v-card-title class="headline">Successfully added</v-card-title>
        <v-card-text>Your post was successfully added.</v-card-text>
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
                ref="zip"
                v-model="post.zip"
                :rules="zipRules"
                label="ZIP / Postal Code"
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
              @click="addNeed"
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
  import * as zipcodes from 'zipcodes'

  export default {
    props: ['dataSource', 'itemFieldLabel', 'editUuid', 'postType'],
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
      zipRules:[
        v => !!v || 'Zip code is required',
        v => !!zipcodes.lookup(v) || 'Zip code must be valid',
      ],    
      items: [],
      item_categories: [],
      lazy: false,      
      management_url: '',
      post: {
        uuid: 'test123',      
        email: '',
        item: '',
        item_category: '',
        name: '',
        zip: '',
        quantity: 1,
        notes: '',
        status: '',
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

          console.log('got UUID', this.editUuid);

          //
          // @TODO this is not scalable
          //
          console.log( 'post type', this.postType );
          let data_source = ( this.postType == 'need' ) ? 'needed_items' : 'available_items';
          console.log('datasource', data_source);

          let post_result = await this.$fireStore.collection(data_source).where("d.uuid", "==", this.editUuid).get().catch( (error) => { this.handleFirebaseError(error) } );
          
          snapshot = post_result.docs;

          console.log( 'snapshot', snapshot );

          if ( snapshot.length > 0 ) {
            let doc_data = snapshot[0].data().d;
            
//.filter(o =>  o.item_category_id == this.post.item_category);

            //
            // @TODO - this should be dynamic rather than having every field listed
            //
            this.post = {
              name: doc_data.name,
              email: doc_data.email,
              zip: doc_data.zip,
              quantity: doc_data.quantity,
              notes: doc_data.notes,
              item: doc_data.item

            }

            //
            // Get item category from item
            // @TODO - this should probably be a function
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
      async addNeed() {
        try {

          if ( this.editUuid ) {
            this.message = 'Editing not yet implemented';
            this.dialog = true;
            return false;
          }

          let type_result = await this.$fireStore.collection('item_types').where("name", "==", this.post.item).get().catch( (error) => { this.handleFirebaseError(error) } );
        
          let type_snapshot = type_result.docs;

          //
          // This is a new item type, add it. 
          //
          if ( type_snapshot.length <= 0 ) {

            const ref = this.$fireStore.collection("item_types").add(
              {
                name: this.post.item,
                item_category_id: this.post.item_category
              }
            ).then (
              () => {
                console.log('item type added');
              }
            ).catch( 
              (error) => {
                this.handleFirebaseError( error );
              }
            );

          }
          
          //
          // Generate a UUID for this post
          //
          this.post.uuid = uuidv4();

          //
          // Set the type
          //
          this.post.type = this.postType;

          // Create a GeoFirestore reference
          const geoFirestore = new GeoFirestore(this.$fireStore);
          // Create a GeoCollection reference
          const geoCollection = geoFirestore.collection(this.dataSource);

          const zipInfo = zipcodes.lookup(this.post.zip);
          
          const ref = geoCollection.add(
            {
              email: this.post.email,
              zip: this.post.zip,
              name: this.post.name,
              notes: this.post.notes,
              quantity: this.post.quantity,
              item: this.post.item.name, //for now we only store the name
              coordinates: new this.$fireStoreObj.GeoPoint(zipInfo.latitude, zipInfo.longitude),
              uuid: this.post.uuid,
              type: this.post.type
            }
          ).then (
            (doc_ref) => {
              this.management_url = window.location.protocol + '//' + window.location.hostname + '/manage/' + this.post.uuid;
              this.dialog_success = true;
              this.reset();
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
    mounted () {
      this.initForm();      
    },


  }
</script>