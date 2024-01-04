export const prerender = false;
import { api } from '$lib/api';

export const load = async ({ fetch, params, url }) => {
	const fetchExpanses = async () => {
		const response = await api({ url: 'api/v1/expenses', serverFetch: fetch });
		return response.body;
	};

	const loadExpense = async () => {
		let pageQuery = url.searchParams.get('edit');
		if (pageQuery) {
			const response = await api({ url: `api/v1/expenses/${pageQuery}`, serverFetch: fetch });
			if (!response?.body) {
				return {};
			}
			return response.body;
		}
	};

	const loadExhangeRate = async () => {
		const response = await api({
			apiURL: 'https://cdn.jsdelivr.net',
			url: `gh/fawazahmed0/currency-api@1/latest/currencies/eur.json`,
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
