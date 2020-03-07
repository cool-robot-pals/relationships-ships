import { getGenders, Gender } from './gender';

interface Post {
	selftext: string;
	title: string;
	genders: Gender[];
}

export const parse = (posts: any[]): Post[] => {
	return posts
		.map((t) => ({
			selftext: t.selftext,
			title: t.title,
			genders: getGenders(t.title),
		}))
		.filter(({ genders }) => genders.length >= 2);
};
