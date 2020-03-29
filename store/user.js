import { GeoFirestore } from 'geofirestore'

export const state = () => ({
	'uid': null,
  'email': null,
  'emailVerified': null,
  foo: ''
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: async function (state, { authUser, claims }) {
    
    console.log("AUTH STATE MUTATION");
    // Do this:
    if ( authUser ) {
	    state.uid = authUser.uid;
	    state.email = authUser.email;
      state.emailVerified = authUser.emailVerified;

			const userCollection = new GeoFirestore(this.$fireStore).collection('user_data')

			let user_doc = await userCollection.doc(authUser.uid);
			let user_result = await user_doc.get();

      if( user_result.exists ) {
   
      	let user_data = user_result.data();
      	
         if ( typeof(user_data.address) != 'undefined' && user_data.address ) {
          
    			console.log('user address data', user_data.address);
      
      		state.address = user_data.address;   	      	
	      }
	    }
    }
    
    
    // Or this:
    
    // const { uid, email, emailVerified } = authUser
    // state.user = { uid, email, emailVerified }
  }
}


