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
              v-model="email"
              :rules="rules.email"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
              outlined
              v-model="password"
              :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="password_show ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 6 characters"
              counter
              @click:append="password_show = !password_show"
            ></v-text-field>

            <v-text-field
                outlined
                ref="zip"
                v-model="zip"
                :rules="rules.zip"
                label="Zip Code"
                required
                placeholder="79938"
                append-icon="mdi-map-marker"
              ></v-text-field>

            <v-checkbox v-model="notifications" label="Send me email notifications when someone in my area needs something">
            </v-checkbox>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="createUser"
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
      password_show: false,
      password: '',
      error: '',
      email: '',
      notifications: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',               
        email: [
        	v => !!v || 'E-mail is required',
        	v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      	],
        zip: [
          v => !!v || 'Zip code is required',
          v => !isNaN(v) || 'Zip code must be numeric'
        ]
      },
      select: null,
      items: [],
      checkbox: false,
      lazy: false,      
    }),
    methods: {
      async createUser() {
        try {

          this.validate();

          console.log('adding user');

          await this.$fireAuth.createUserWithEmailAndPassword(
            this.email,
            this.password
          ).catch(
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