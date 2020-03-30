import { GeoFirestore } from 'geofirestore'

export const state = () => {
  return {
    'uid': null,
    'email': null,
    'emailVerified': null,
    foo: ''
  }
}

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: async function (state, { authUser, claims }) {
    
    console.log("AUTH STATE MUTATION");
    console.log(state.uid)

    const cache = localStorage.getItem("user");
    if(cache) {
      const cached_data = JSON.parse(cache);
      state.address = cached_data.address;
    }

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
      
      localStorage.setItem("user", JSON.stringify(state));
    }
  }
}


