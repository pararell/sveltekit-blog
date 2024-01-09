import { API_URL } from './constants';
const baseUrl = API_URL;

export async function api({ url, method = 'GET', data, serverFetch, apiURL = baseUrl, authorization = {} }) {
	const res = await (serverFetch || fetch)(`${apiURL}/${url}`, {
		method: method,
		body: data && JSON.stringify(data),
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...authorization
		}
	});

	return {
		status: res.status,
		body: await res.json()
	};
}
