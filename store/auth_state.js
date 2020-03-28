export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    
    console.log("AUTH STATE MUTATION");
    // Do this:
    // state.user.id = authUser.uid
    // state.user.email = authUser.email
    // state.user.emailVerified = authUser.emailVerified

    // Or this:
    // const { uid, email, emailVerified } = authUser
    // state.user = { uid, email, emailVerified }
  }
}

export const actions = {

	async nuxtServerInit({ dispatch, commit }, { res }) {

		console.log("NUXT SERVER INIT!");
	  if (res && res.locals && res.locals.user) {
	    const { allClaims: claims, ...authUser } = res.locals.user

	    // await dispatch('onAuthStateChangedAction', {
	    //   authUser,
	    //   claims
	    // })

	    // // or

	    commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser, claims })
	  }
	}
}