export const handle = async ({ request, render }) => {
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	request.locals = request.headers ? request.headers.cookie : '';


	const response = await render(request);

	return response;
};

export function getSession(request) {
	return {
		...request.locals
	}
}
