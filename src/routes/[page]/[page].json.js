import { api } from '$lib/api';

export const get = async (event) => {
	const response = await api({ url: `api/pages/${event.params.page}` });

	if (response.status === 404) {
		return { body: {} };
	}

	return response;
};