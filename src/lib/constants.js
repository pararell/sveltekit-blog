export const API_URL = import.meta.env.VITE_API_URL;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const inputTypes = ['text', 'password', 'tel', 'email', 'date'];

export const pageModelForm = {
  title: {
    type: 'text',
    value: ''
  },
  metaTitle: {
    type: 'text',
    value: ''
  },
  image: {
    type: 'text',
    value: ''
  },
  description: {
    type: 'text',
    value: ''
  },
  url: {
    type: 'text',
    value: ''
  },
  position: {
    type: 'number',
    value: ''
  },
  content: {
    type: 'markdown',
    value: '# T'
  }
};

export const blogModelForm = {
  title: {
    type: 'text',
    value: ''
  },
  imgLink: {
    type: 'text',
    value: ''
  },
  description: {
    type: 'text',
    value: ''
  },
  categories: {
    type: 'text',
    value: ''
  },
  date: {
    type: 'date',
    value: new Date().toISOString().substr(0, 10)
  },
  content: {
    type: 'markdown',
    value: '# T'
  }
};