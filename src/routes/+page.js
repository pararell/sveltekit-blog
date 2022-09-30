import { api } from '$lib/api';
import { pageWithContent } from '$lib/store';

export const load = async ({ fetch, url, params }) => {
  const resPages = await api({ url: 'api/pages/home', serverFetch: fetch });

  if (resPages) {
    pageWithContent.next(resPages.body);
    return { props: { url, params } };
  }

  return {
    props: {
      url,
      params
    }
  };
};