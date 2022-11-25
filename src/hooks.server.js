export async function handle({ event, resolve }) {
	const cookieLang = event.cookies.get('lang');
	const cookieMode = event.cookies.get('mode');
	event.locals.lang = ['sk', 'en'].includes(cookieLang) ? cookieLang : 'en';
	event.locals.mode = ['light', 'dark'].includes(cookieMode) ? cookieMode : 'light';
	const response = await resolve(event);
	return response;
}
