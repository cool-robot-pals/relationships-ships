export enum Gender {
	Boy = "Boy",
	Girl = "Girl"
}

const benders = [
	["she", "he"],
	["her", "his"],
	["mother", "father"],
	["sister", "brother"],
	["gf", "bf"],
	["gfs", "bfs"],
	["woman", "man"],
	["girlfriend", "boyfriend"],
	["herself", "himself"],
	["wife", "husband"]
];

const GENDER_REGEX = /\W[0-9]+\W?s?([a-zA-Z])\W/g;

export const normalizeGender = (str: string) => {
	if (str.toLowerCase() === "f") {
		return Gender.Girl;
	}
	return Gender.Boy;
};

export const getGenders = (str): Gender[] => {
	let matches = [];
	let match;

	while ((match = GENDER_REGEX.exec(str)) !== null) {
		matches.push(normalizeGender(match[1]));
	}
	return matches;
};

export const bendStr = (str: string, to = Gender.Girl) => {
	//replace gend labels
	str = str.replace(GENDER_REGEX, (original, match) => {
		let replacement = to === Gender.Boy ? "M" : "F";
		if (match === match.toUpperCase()) {
			replacement = replacement.toUpperCase();
		}
		return original.replace(match, replacement);
	});

	// replace it all
	for (let [girl, boy] of benders) {
		const search = to === Gender.Boy ? girl : boy;
		const replacement = to === Gender.Girl ? girl : boy;
		const regex = new RegExp(`\\W(${search})\\W`, "gi");

		str = str.replace(regex, (original, match) => {
			const splat = match.split("");
			const caps = splat.map(l => l === l.toUpperCase());
			const isMostlyCaps = caps.filter(r => r).length > splat.length / 2;
			let thisReplacement = replacement;
			if (isMostlyCaps) {
				thisReplacement = thisReplacement.toUpperCase();
			} else {
				thisReplacement = thisReplacement
					.split("")
					.map((l, i) => (caps[i] ? l.toUpperCase() : l))
					.join("");
			}

			return original.replace(match, thisReplacement);
		});
	}
	return str;
};

export const bend = (post: Post, to: Gender) => ({
	...post,
	selftext: bendStr(post.selftext, to),
	title: bendStr(post.title, to)
});
