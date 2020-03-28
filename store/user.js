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
    
    state.uid = authUser.uid;
    state.email = authUser.email;
    state.emailVerified = authUser.emailVerified;    

    state.foo = 'whatsgood';


    console.log('state.user', state.user );
    // Or this:
    console.log('authUser', authUser);
    // const { uid, email, emailVerified } = authUser
    // state.user = { uid, email, emailVerified }
  }
}