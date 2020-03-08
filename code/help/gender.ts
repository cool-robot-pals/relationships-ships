import { Gender, Post } from '../t/types';
import pluralize from 'pluralize';

const benders = [
	['she', 'he'],
	['her', 'his'],
	['hers', 'him'],
	['mother', 'father'],
	['mom', 'dad'],
	['sister', 'brother'],
	['gf', 'bf'],
	['woman', 'man'],
	['girlfriend', 'boyfriend'],
	['female', 'male'],
	['girl', 'boy'],
	['girl', 'guy'],
	['herself', 'himself'],
	['wife', 'husband'],
]
	.map((bend) => [bend, bend.map((b) => pluralize(b))])
	.flat();

const GENDER_REGEX = /\W[0-9]+\W?s?([a-zA-Z])\W/g;

export const normalizeGender = (str: string) => {
	if (str.toLowerCase() === 'f') {
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
		let replacement = to === Gender.Boy ? 'M' : 'F';
		if (match === match.toUpperCase()) {
			replacement = replacement.toUpperCase();
		}
		return original.replace(match, replacement);
	});

	// replace it all
	for (let [girl, boy] of benders) {
		const [search, replacement] = to === Gender.Boy ? [girl, boy] : [boy, girl];
		const regex = new RegExp(`(^|\\W)(${search})($|\\W)`, 'gi');

		str = str.replace(regex, (original, _, match) => {
			const splat = match.split('');
			const caps = splat.map((l) => l === l.toUpperCase());
			const isMostlyCaps = caps.filter((r) => r).length > splat.length / 2;

			let thisReplacement;
			if (isMostlyCaps) {
				thisReplacement = replacement.toUpperCase();
			} else {
				thisReplacement = replacement
					.split('')
					.map((l, i) => (caps[i] ? l.toUpperCase() : l))
					.join('');
			}

			return original.replace(match, thisReplacement);
		});
	}
	return str;
};

export const bend = (post: Post, to: Gender): Post => ({
	...post,
	selftext: bendStr(post.selftext, to),
	title: bendStr(post.title, to),
});
