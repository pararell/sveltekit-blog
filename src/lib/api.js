import { API_URL } from './constants';
const baseUrl = API_URL;

export async function api({ url, method, data, serverFetch, apiURL = baseUrl }) {
	const res = await (serverFetch || fetch)(`${apiURL}/${url}`, {
		method: method || 'GET',
		body: data && JSON.stringify(data),
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	return {
		status: res.status,
		body: await res.json()
	};
}
