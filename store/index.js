export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
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

	    commit('user/ON_AUTH_STATE_CHANGED_MUTATION', { authUser, claims })
	  }
	}
}