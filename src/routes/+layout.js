import { api } from '$lib/api';
import { user, config, pages, blogs } from '$lib/store';

export const load = async ({ fetch }) => {
  const resUser = api({ url: 'api/user', serverFetch: fetch });
  const resConfig = api({ url: 'api/config', serverFetch: fetch });
  const resPages = api({ url: 'api/pages', serverFetch: fetch });
  const resBlogs = api({ url: 'api/blogs', serverFetch: fetch });

  const data = await Promise.all([resUser, resConfig, resPages, resBlogs]);

  if (data) {
    user.next(data[0].body);
    config.next(data[1].body);
    pages.next(data[2].body);
    blogs.next(data[3].body);

    return {
      props: {},
      cache: {
        maxage: 240
      }
    };
  }

  return {
    error: new Error()
  };
};