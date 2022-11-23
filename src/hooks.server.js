export async function handle({ event, resolve }) {
	event.locals.lang = event.cookies.get('lang') || 'en';
	const response = await resolve(event);
	return response;
}
