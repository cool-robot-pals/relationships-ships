require("dotenv").config();
const fs = require("fs");
const snoowrap = require("snoowrap");

const r = new snoowrap({
	userAgent: "put your user-agent string here",
	clientId: process.env.REDDIT_APP,
	clientSecret: process.env.REDDIT_SECRET,
	refreshToken: process.env.REDDIT_RT
});

const retrieve = async () => {
	const controversials = await r
		.getSubreddit("relationships")
		.getControversial({
			time: "week",
			count: 100
		});
	fs.writeFileSync("controversials.json", JSON.stringify(controversials));
};

enum Gender {
	Boy = "Boy",
	Girl = "Girl"
}

const normalizeGender = (str: string) => {
	if (str.toLowerCase() === "f") {
		return Gender.Girl;
	}
	return Gender.Boy;
};

const getOppositeGender = (gend: Gender): Gender =>
	gend === Gender.Boy ? Gender.Girl : Gender.Boy;

const GENDER_REGEX = /\W[0-9]+\W?s?([a-zA-Z])\W/g;

const getGenders = (str): Gender[] => {
	let matches = [];
	let match;

	while ((match = GENDER_REGEX.exec(str)) !== null) {
		matches.push(normalizeGender(match[1]));
	}
	return matches;
};

const benders = [
	["she", "he"],
	["her", "his"],
	["mother", "father"],
	["sister", "brother"],
	["gf", "bf"],
	["gfs", "bfs"],
	["woman", "man"],
	["sister", "brother"],
	["girlfriend", "boyfriend"],
	["girl", "boy"],
	["herself", "himself"],
	["wife", "husband"]
];

const bend = (str: string, to = Gender.Girl) => {
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

interface Post {
	selftext: string;
	title: string;
	genders: Gender[];
}

const bendPost = (post: Post, to: Gender) => ({
	...post,
	selftext: bend(post.selftext, to),
	title: bend(post.title, to)
});

const getPosts = (): Post[] => {
	const data = require("./controversials.json");
	const posts = data
		.map(t => ({
			selftext: t.selftext,
			title: t.title,
			genders: getGenders(t.title)
		}))
		.filter(({ genders }) => genders.length >= 2);
	return posts;
};

const parse = async () => {
	const titles = getPosts();
	console.log(bendPost(titles[7], Gender.Boy));
};

const get = parse();
