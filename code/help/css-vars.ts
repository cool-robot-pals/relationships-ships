export const injectCSS = (vars: {}, $element = document.documentElement) => {
	for (let [key, val] of Object.entries(vars)) {
		let result =
			typeof val === 'number' ? Math.round(val) + 'px' : val.toString();
		$element.style.setProperty('--' + key, result);
	}
};
