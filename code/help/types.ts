export enum Gender {
	Boy = 'Boy',
	Girl = 'Girl',
}

export interface Meta {
	post: Post;
	ship: Ship;
}

export enum Snaps {
	Video = 'VIDEO',
	Composite = 'COMPOSITE',
}

export interface Logger {
	type: Snaps;
	state: 'ready';
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
