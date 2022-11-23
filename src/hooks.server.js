export async function handle({ event, resolve }) {
	const cookieLang = event.cookies.get('lang');
	event.locals.lang = ['sk', 'en'].includes(cookieLang) ? cookieLang : 'en';
	const response = await resolve(event);
	return response;
}
