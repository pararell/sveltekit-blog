import { DISQUSSRC } from './constants';

export const setDisqus = (host, slug) => {
	if (window.DISQUS) {
		resetDisqus(host, slug);
		return;
	}
	const dsq = document.createElement('script');
	dsq.type = 'text/javascript';
	dsq.src = DISQUSSRC;
	dsq.async = true;

	dsq.setAttribute('data-timestamp', +new Date());
	(
		document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]
	).appendChild(dsq);

	window.disqus_config = function () {
		this.language = 'en';
	};

	dsq.addEventListener('load', () => {
		resetDisqus(host, slug);
	});
};

export const resetDisqus = (host, slug) => {
	setTimeout(() => {
		const DISQUS = window.DISQUS || { reset: () => {} };

		DISQUS.reset({
			reload: true,
			config: function () {
				this.page.url = 'https://' + host + '/blogs/' + slug;
				this.page.identifier = slug;
				this.language = 'en';
			}
		});
	}, 200);
};

export const preparePageForm = (pageForm, page) => {
	const pageKeys = Object.keys(page);
	return pageForm.map((keyval) => {
		const found = pageKeys.includes(keyval[0]);
		if (found) {
			keyval[1].value = page[keyval[0]];
			return keyval;
		}

		return keyval;
	});
};
