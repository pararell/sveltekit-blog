import { api } from '$lib/api';

export const get = async (event) => {
	const response = await api({ url: `api/blogs/${event.params.slug}` });

	if (response.status === 404) {
		return { body: {} };
	}

	return response;
};

// POST /blogs/create.json
export const post = async ({ request }) => {
	const form = await request.formData();
	const data = {
		title: form.get('title'),
		slug: form
			.get('title')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\w]/gi, '-'),
		description: form.get('description'),
		imgLink: form.get('imgLink'),
		content: form.get('content'),
		categories: form.get('categories') ? form.get('categories').split(',') : [],
		date: form.get('date'),
		author: form.get('author'),
		lang: form.get('lang'),
		comments: []
	};
	return api({ url: `api/blogs/create`, method: 'POST', data });
};

// PATCH /blogs/update.json
export const patch = async ({ request }) => {
	const form = await request.formData();
	return api({
		url: `api/blogs/update`,
		method: 'PATCH',
		data: {
			id: parseFloat(form.get('id')),
			title: form.get('title'),
			description: form.get('description'),
			imgLink: form.get('imgLink'),
			categories: form.get('categories') ? form.get('categories').split(',') : [],
			date: form.get('date'),
			slug: form
				.get('title')
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^\w]/gi, '-'),
			content: form.get('content'),
			comments: []
		}
	});
};

// DELETE /blogs/:uid.json
export const del = async ({ request }) => {
	const form = await request.formData();
	return api({ url: `api/blogs/delete/` + form.get('id'), method: 'DELETE' });
};
