import { fromEvent } from "rxjs";

export const setDisqus = (config) => {
    const dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.src = config.disqusSrc;
    dsq.async = true;

    dsq.setAttribute('data-timestamp', +new Date());
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

    window.disqus_config = function () {
        this.language = 'en';
    };

    return fromEvent(dsq, 'load');
}

export const resetDisqus = (page) => {
    const DISQUS = window.DISQUS || {reset: () => {}};
    const host = page.host;
    
    DISQUS.reset({
        reload: true,
        config: function () {
            this.page.url = 'https://' + host + '/blogs/' + page.attributes.slug;
            this.page.identifier = page.attributes.slug;
            this.language = 'en';
        }
    });

}