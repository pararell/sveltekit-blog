export const handle = async ({ request, render }) => {
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	const response = await render(request);


	return response;
};
