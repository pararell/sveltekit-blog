/*
	This module is used by the /todos.json and /todos/[uid].json
	endpoints to make calls to api.svelte.dev, which stores todos
	for each user. The leading underscore indicates that this is
	a private module, _not_ an endpoint — visiting /todos/_api
	will net you a 404 response.
*/

import { dev } from '$app/env';

const base = dev ? 'http://localhost:4000' : '';

export async function api(resource, request, data) {
  if (!request) {
    request = {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    }
  }

	const res = await fetch(`${base}/${resource}`, {
		method: request.method,
		headers: {
			'content-type': 'application/json'
		},
		credentials: 'include',
		body: data && JSON.stringify(data)
	});

	// if the request came from a <form> submission, the browser's default
	// behaviour is to show the URL corresponding to the form's "action"
	// attribute. in those cases, we want to redirect them back to the
	// /todos page, rather than showing the response
	if (res.ok && request.method !== 'GET' && request.headers.accept !== 'application/json') {
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
