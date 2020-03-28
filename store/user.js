export const state = () => ({
	'uid': null,
  'email': null,
  'emailVerified': null,
  foo: ''
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    
    console.log("AUTH STATE MUTATION");
    // Do this:
    if ( authUser ) {
	    state.uid = authUser.uid;
	    state.email = authUser.email;
	    state.emailVerified = authUser.emailVerified;    
	  	console.log('authUser', authUser);
	  }
    
    // Or this:
    
    // const { uid, email, emailVerified } = authUser
    // state.user = { uid, email, emailVerified }
  }
}