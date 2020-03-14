import { routes } from './help/routes';

let usedRoute = false;
Object.entries(routes).forEach(([route, callback]) => {
	if (document.location.search.includes(route)) {
		console.log('using route: ' + route);
		usedRoute = true;
		callback();
	}
});

if (!usedRoute) {
	const [useName, useCb] = Object.entries(routes).shift();
	console.log('using default route: ' + useName);
	useCb();
}
