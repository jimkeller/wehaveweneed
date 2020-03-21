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
            expand
            show-expand
            :search="search"
          >
            
            <template v-slot:top>
              <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
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

  export default {
    data: () => ({
      valid: true,
      dialog: false,
      message: '',
      search: '',
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
    methods: {

      handleFirebaseError(error) {
        this.message = error.message;
        this.dialog = true;
      },
      async fetchData() {
        let result = await this.$fireStore.collection('available_items').get().catch( (error) => { this.handleFirebaseError(error) } );
        let snapshot = result.docs;

        snapshot.forEach(
          (doc) => { 
            this.items.push( doc.data() );
          }
        );
      },
     
    },
    created () {
      console.log('created');
      this.fetchData();
    },


  }
</script>