
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
      
      let udata = await this.$fireStore.collection('user_data').doc(state.uid).get();
      
      if(!udata.exists) {
        this.$router.push('/configure');
        return
      }

      udata = udata.data();

      state.address = udata.address;
      console.log("Saved address: " + udata.address)
    }
    
    
    // Or this:
    
    // const { uid, email, emailVerified } = authUser
    // state.user = { uid, email, emailVerified }
  }
}