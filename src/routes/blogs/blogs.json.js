import { api } from '$lib/api';

// GET /blogs.json
export const get = async (request) => {
	const response = await api({resource: `api/blogs`, request});

	if (response.status === 404) {
		return { body: [] };
	}

	return response;
};


