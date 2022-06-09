import { api } from '$lib/api';

export const get = async () => {
	const response = await api({ url: `api/pages/home` });

	if (response.status === 404) {
		return { body: {} };
	}

	return response;
};