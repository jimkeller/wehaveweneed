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

    <v-container>
      <v-row>
        <v-col cols="12" md="8">
         <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
          >

            <v-text-field
              outlined
              v-model="address"
              label="Address"
              required
            ></v-text-field>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="submit"
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
      error: '',
      address: '',
      dialog: '',
      lazy: false,      
    }),
    methods: {
      async submit() {
        try {
          this.validate();

          await this.$fireStore.collection('user_data').doc(this.$store.state.user.uid)
            .set({
              address: this.address
            })
            .catch(
              (error) => {
                var errorCode = error.code;
                
                this.error = error.message;
                this.dialog = true;

              }
            );
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


  }
</script>