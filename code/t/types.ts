export enum Gender {
	Boy = 'Boy',
	Girl = 'Girl',
}

export interface Post {
	selftext: string;
	title: string;
	genders: Gender[];
}

export interface Ship {
	name: string;
	vids: string[];
	bend?: Gender;
}
