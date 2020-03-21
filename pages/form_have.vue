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
                :rules="[() => !!zip || 'This field is required']"
                label="ZIP / Postal Code"
                required
                placeholder="79938"
              ></v-text-field>

            <v-text-field
                ref="quantity"
                v-model="quantity"
                :rules="[() => !isNaN(quantity) || 'This field must be numeric']"
                label="Quantity"
                required
                placeholder=""
              ></v-text-field>

            <v-select
              v-model="item"
              :items="items"
              :rules="[v => !!v || 'Item is required']"
              label="What you have"
              required
            ></v-select>

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
      item: null,
      items: ['PPE Equipment', 'Food', 'Need a strong taxonomy here'],
      checkbox: false,
      lazy: false,
    }),
    methods: {

      handleFirebaseError(error) {
        this.message = error.message;
        this.dialog = true;
      },
      async initForm() {
        // let result = await this.$fireStore.collection('available_items').get().catch( (error) => { this.handleFirebaseError(error) } );
        // let snapshot = result.docs;

        // snapshot.forEach(
        //   function(doc) {
        //     console.log( 'doc data ', doc.data() );
        //   }
        // );
      },

      async addItem() {
        try {
          console.log('adding item');
          
          const ref = this.$fireStore.collection("available_items").add(
            {
              email: this.email,
              zip: this.zip,
              name: this.name,
              notes: this.notes,
              quantity: this.quantity,
              item: this.item
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
      console.log('created');
      //this.initForm();      
    },


  }
</script>