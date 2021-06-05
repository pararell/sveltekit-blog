import { api } from '$lib/api';

export const get = async (request) => {
	const response = await api({resource: `api/blogs/${request.params.slug}`, request});

	if (response.status === 404) {
		return { body: {} };
	}

	return response;
};

// POST /blogs/create.json
export const post = async (request) => {
	const data = {
		title: request.body.get('title'),
		slug: request.body.get('title').toLowerCase().replace(/[^\w]/gi, '_'),
		description: request.body.get('description'),
		imgLink: request.body.get('imgLink'),
		content: request.body.get('content'),
		categories: request.body.get('categories')
			? request.body.get('categories').split(',')
			: [],
		date: new Date(),
		author: request.body.get('author'),
		lang: request.body.get('lang'),
		comments: []
	}
	return api({resource: `api/blogs/create`, request, data});
};

// PATCH /blogs/update.json
export const patch = async (request) => {
	return api({resource: `api/blogs/update`, request, data: {
		id: parseFloat(request.body.get('id')),
		title: request.body.get('title'),
		description: request.body.get('description'),
		imgLink: request.body.get('imgLink'),
		categories: request.body.get('categories')
			? request.body.get('categories').split(',')
			: [],
		slug: request.body.get('title').toLowerCase().replace(/[^\w]/gi, '_'),
		content: request.body.get('content'),
		comments: []
	}});
};

// DELETE /blogs/:uid.json
export const del = async (request) => {
	return api({resource: `api/blogs/delete/` + request.body.get('id'), request});
};
