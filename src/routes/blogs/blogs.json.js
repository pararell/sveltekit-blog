import { api } from '$lib/api';

// GET /blogs.json
export const get = async () => {
	const response = await api({url: `api/blogs`});

	if (response.status === 404) {
		return { body: [] };
	}

	return response;
};


