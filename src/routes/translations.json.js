import { api } from '$lib/api';

export const get = async (request) => {
	const response = await api(`api/translations`, request);

	if (response.status === 404) {
		return { body: {} };
	}

	return response;
};


