export const handle = async ({ event, resolve }) => {
	if (event.url.searchParams.has('_method')) {
		event.request.method = event.url.searchParams.get('_method').toUpperCase();
	}

	const response = await resolve(event);

	return response;
};

// export async function externalFetch(request) {
//   return fetch(request);
// }
