import { api } from '$lib/api';

// GET /blogs.json
export const get = async (request) => {
	const response = await api(`api/blogs`, request);

	if (response.status === 404) {
		return { body: [] };
	}

	return response;
};


