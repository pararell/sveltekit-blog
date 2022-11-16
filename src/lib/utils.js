export const setDisqus = (config, host, slug) => {
	if (window.DISQUS) {
		resetDisqus(host, slug);
		return;
	}
	const dsq = document.createElement('script');
	dsq.type = 'text/javascript';
	dsq.src = config.disqusSrc;
	dsq.async = true;

	dsq.setAttribute('data-timestamp', +new Date());
	(
		document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]
	).appendChild(dsq);

	window.disqus_config = function () {
		this.language = 'en';
	};

	dsq.addEventListener("load", () => {
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
	}, 200)


};
