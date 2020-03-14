import { routes } from './help/routes';

let getRoute: () => Promise<any> = null;
Object.entries(routes).forEach(([route, callback]) => {
	if (document.location.search.includes(route)) {
		console.log('using route: ' + route);
		getRoute = callback;
	}
});

if (!getRoute) {
	const [useName, useCb] = Object.entries(routes).shift();
	console.log('using default route: ' + useName);
	getRoute = useCb;
}

getRoute().then((r) => {
	r.default();
});
