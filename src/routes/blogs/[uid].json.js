import { api } from '$lib/api';


// GET /blogs.json
export const get = async (request) => {
	// request.locals.userid comes from src/hooks.js
	const response = await api(`api/blogs/${request.params.uid}`, request);

	if (response.status === 404) {
		// user hasn't created a todo list.
		// start with an empty array
		return { body: [] };
	}

	return response;
};

// POST /blogs/:uid.json
export const post = async (request) => {
	return api(`api/blogs/create`, request, {
		title: request.body.get('title'),
		slug: request.body.get('title').toLowerCase().replace(/[^\w]/gi, '_'),
		content: request.body.get('content'),
		date: new Date(),
		author: request.body.get('author'),
		comments: []
	});
};

// PATCH /blogs/:uid.json
export const patch = async (request) => {
	return api(`api/blogs/update`, request, {
		id: parseFloat(request.body.get('id')),
		title: request.body.get('title'),
		slug: request.body.get('title').toLowerCase().replace(/[^\w]/gi, '_'),
		content: request.body.get('content'),
		comments: []
	});
};

// DELETE /blogs/:uid.json
export const del = async (request) => {
	return api(`api/blogs/delete/` + request.body.get('id'), request);
};
