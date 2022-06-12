import { API_URL } from './constants';
import Cookie from 'cookie-universal';
const cookies = Cookie();
const cookiesRes = cookies.getAll();
const baseUrl = API_URL;

export async function api({ url, method, data, serverFetch }) {
	const res = await (serverFetch || fetch)(`${baseUrl}/${url}`, {
		method: method || 'GET',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json',
			cookie: cookiesRes
		},
		credentials: 'include',
		body: data && JSON.stringify(data)
	});

	return {
		status: res.status,
		body: await res.json()
	};
}
