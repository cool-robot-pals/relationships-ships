import { routes } from '../help/routes';

let getRoute: () => Promise<any> = null;
Object.entries(routes).forEach(([route, callback]) => {
	if (document.location.search.includes(route)) {
		console.log('using route: ' + route);
		getRoute = callback;
	}
});

if (!getRoute) {
	const [useName, useCb] = Object.entries(routes).shift();
	console.log('😩 using default route: ' + useName);
	console.log('😩 go to a route: ');
	Object.keys(routes).map((r) => {
		[document.location.protocol, '/', document.location.host, r].join('/');
	});
	getRoute = useCb;
}

getRoute().then((r) => {
	r.default();
});
