import { API_URL } from './constants';
const baseUrl = API_URL;

export async function api({ url, method, data, serverFetch, apiURL = baseUrl }) {
	const res = await (serverFetch || fetch)(`${apiURL}/${url}`, {
		method: method || 'GET',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json'
		},
		credentials: 'include',
		body: data && JSON.stringify(data)
	});

	return {
		status: res.status,
		body: await res.json()
	};
}
