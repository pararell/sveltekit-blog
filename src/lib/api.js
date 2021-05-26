import { API_URL } from './constants';

const baseUrl = API_URL;

export async function api(resource, request, data, serverFetch) {
	const req = request || {method: 'GET'};
	const res = await (serverFetch || fetch)(`${baseUrl}/${resource}`, {
		...req,
		method: req.method,
		headers: {
			'Content-Type': 'application/json',
			cookie: req.headers ? req.headers.cookie : ''
		},
		credentials: 'include',
		body: data && JSON.stringify(data)
	});


	// if the request came from a <form> submission, the browser's default
	// behaviour is to show the URL corresponding to the form's "action"
	if (res.ok && req.method !== 'GET' && req.headers && req.headers.accept !== 'application/json') {
		return {
			status: 303,
			headers: {
				location: '/blogs'
			}
		};
	}

	return {
		status: res.status,
		body: await res.json()
	};
}
