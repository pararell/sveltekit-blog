import { api } from '$lib/api';

// GET /blogs.json
export const get = async (request) => {
	// request.locals.userid comes from src/hooks.js
	const response = await api(`api/blogs`, request);

	if (response.status === 404) {
		// user hasn't created a todo list.
		// start with an empty array
		return { body: [] };
	}

	return response;
};


