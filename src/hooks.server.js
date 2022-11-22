export async function handle({ event, resolve }) {
	// event.locals.lang = event.cookies.get('lang');
	const response = await resolve(event);
	return response;
}
