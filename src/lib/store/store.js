import { api } from '$lib/api';

import { BehaviorSubject } from 'rxjs';


export const loading = new BehaviorSubject(false);
export const user = new BehaviorSubject(null);
export const blogs = new BehaviorSubject(null);
export const blog = new BehaviorSubject(null);
export const config = new BehaviorSubject(null);

export const fetchUser = async () => {
	try {
		const response = await api(`api/user`);
		user.next(response.body);
		return user;
	} catch (e) {
		console.log(e)
	}
};

export const fetchConfig = async () => {
	try {
		const response = await api(`api/config`);
		config.next(response.body);
		return config;
	} catch (e) {
		console.log(e)
	}
};
