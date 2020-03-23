<style>
  form .v-subheader {
    padding-left: 0;
    padding-right: 0;
  }
</style>
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
        <v-col cols="6" sm="12">

         <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
          >
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
                ref="zip"
                v-model="zip"
                :rules="zipRules"
                label="ZIP / Postal Code"
                required
              ></v-text-field>

            <v-text-field
                ref="quantity"
                v-model="quantity"
                :rules="[() => !isNaN(quantity) || 'This field must be numeric']"
                label="Quantity"
                required
                placeholder=""
              ></v-text-field>

            <v-container>
              <v-row>
                <v-subheader> Choose an Item category and Item</v-subheader>
              </v-row>
              <v-row>

                <v-select
                  ref="item_category_select"
                  v-model="item_category"
                  :items="item_categories"
                  :rules="[v => !!v || 'Item Category is required']"
                  label="Item Category"
                  required
                  chips
                  item-text='name'
                  item-value='id'
                ></v-select>

                <v-combobox
                  v-model="item"
                  :items="filteredItems"
                  :rules="[v => !!v || 'Item is required']"
                  label="What you have"
                  required
                  chips
                  item-text='name'
                  item-value='name'
                ></v-combobox>
              </v-row>
            </v-container>
            <v-textarea
              v-model="notes"
              name="input-additional-notes"
              label="Additional Notes"
              value=""
              hint=""
            ></v-textarea>

            <v-btn
              color="success"
              class="mr-4"
              @click="addItem"
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
  import * as zipcodes from 'zipcodes'

  export default {
    data: () => ({
      valid: true,
      dialog: false,
      message: '',
      name: '',
      zip: '',
      quantity: 1,
      notes: '',
      nameRules: [
        v => !!v || 'Name is required'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      zipRules:[
        v => !!v || 'Zip code is required',
        v => !!zipcodes.lookup(v) || 'Zip code must be valid',
      ],
      item: null,
      item_category: '',
      items: [],
      item_categories: [],
      checkbox: false,
      lazy: false,
    }),
    computed: {
      filteredItems() {
        return this.items.filter(o =>  o.item_category_id == this.item_category);
      }
    },
    methods: {

      handleFirebaseError(error) {
        this.message = error.message;
        this.dialog = true;
      },
      async initForm() {

        //
        // @TODO move this logic into a service/plugin
        //

        //
        // Get item categories
        //
        let result = await this.$fireStore.collection('item_categories').get().catch( (error) => { this.handleFirebaseError(error) } );
        let snapshot = result.docs;

        snapshot.forEach(
          (doc) => {
            let data = doc.data();
            data.id = doc.id;
            this.item_categories.push(data);
          }
        );

        //
        // Get items
        //
        result = await this.$fireStore.collection('item_types').get().catch( (error) => { this.handleFirebaseError(error) } );
        snapshot = result.docs;

        snapshot.forEach(
          (doc) => {
            console.log(doc.data());
           this.items.push( doc.data() );
          }
        );
      },

      async addItem() {
        try {
          console.log('adding item');

          //
          // @TODO: this is very similar to the "need" form -- needs to be a service in the middle or something
          // rather than duplicating this logic.
          //

          let type_result = await this.$fireStore.collection('item_types').where("name", "==", this.item).get().catch( (error) => { this.handleFirebaseError(error) } );

          let type_snapshot = type_result.docs;

          //
          // This is a new item type, add it.
          //
          if ( type_snapshot.length <= 0 ) {

            const ref = this.$fireStore.collection("item_types").add(
              {
                name: this.item,
                item_category_id: this.item_category
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

          // Create a GeoFirestore reference
          const geoFirestore = new GeoFirestore(this.$fireStore);
          // Create a GeoCollection reference
          const geoCollection = geoFirestore.collection("available_items");

          const zipInfo = zipcodes.lookup(this.zip);
          console.log(this.item);
          const ref = geoCollection.add(
            {
              email: this.email,
              zip: this.zip,
              name: this.name,
              notes: this.notes,
              quantity: this.quantity,
              item: this.item.name, //for now we only store the name
              coordinates: new this.$fireStoreObj.GeoPoint(zipInfo.latitude, zipInfo.longitude)
            }
          ).then (
            (doc_ref) => {
              this.message = 'Added successfully. Your reference ID is: ' + doc_ref.id.toString();
              this.dialog = true;
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
