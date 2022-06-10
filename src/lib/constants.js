export const API_URL = import.meta.env.VITE_API_URL;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const inputTypes = ['text', 'password', 'tel', 'email'];

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