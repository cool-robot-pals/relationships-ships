import { getGenders } from './gender';
import { Post } from './types';

export const parse = (posts: {}): Post[] => {
	return Object.values<any>(posts)
		.map((t) => ({
			selftext: t.selftext,
			title: t.title,
			created: t.created,
			name: t.name,
			genders: getGenders(t.title),
		}))
		.filter(({ genders }) => genders.length >= 2);
};
