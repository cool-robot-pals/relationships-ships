export enum Gender {
	Boy = 'Boy',
	Girl = 'Girl',
}

export interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Meta {
	post: Post;
	ship: Ship;
}

export interface PhotoMeta {
	score: number;
	box: Box;
	path: string;
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
