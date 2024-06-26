export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url, locals }) => {
	const authorization = locals.token ? { authorization: locals.token } : {};

	const fetchExpanses = async () => {
		const response = await api({ url: 'api/v1/expenses', serverFetch: fetch, authorization });

		if (response.status === 401) {
			return [];
		}

		return response.body;
	};

	const loadExpense = async () => {
		let pageQuery = url.searchParams.get('edit');
		if (pageQuery) {
			const response = await api({
				url: `api/v1/expenses/${pageQuery}`,
				serverFetch: fetch,
				authorization
			});

			if (!response?.body) {
				return {};
			}
			return response.body;
		}
	};

	// https://github.com/fawazahmed0/exchange-api for more info
	const loadExhangeRate = async () => {
		const response = await api({
			apiURL: 'https://cdn.jsdelivr.net',
			url: `npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json`,
			serverFetch: fetch
		});
		return response.body;
	};

	return {
		expenses: await fetchExpanses(),
		expenseToEdit: await loadExpense(),
		eurToCurrencies: await loadExhangeRate(),
		pathname: url.pathname,
		paramsPage: params.page
	};
};
