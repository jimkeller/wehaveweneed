export default function ( {route, store, redirect} ) {

	//console.log('middleware store', store);
	console.log('middleware route', route);
	
	// return

	// if (routeOption(route, 'auth', false)) {
 //    return
 //  }

  if (!store.state.user.uid) {
    return redirect('/sign_in?')
  }
}
