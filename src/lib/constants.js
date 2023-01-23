export const API_URL = import.meta.env.VITE_API_URL;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
export const HEADER_LOGO = import.meta.env.VITE_HEADER_LOGO;
export const DISQUSSRC = import.meta.env.VITE_DISQUSSRC;

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
		type: 'text',
		value: ''
	},
	hidden: {
		type: 'text',
		value: 'false'
	},
	onlyHTML: {
		type: 'text',
		value: 'false'
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
	image: {
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

export const expenseModelForm = {
	title: {
		type: 'text',
		value: ''
	},
	value: {
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
	repeat: {
		type: 'text',
		value: ''
	},
	currency: {
		type: 'text',
		value: ''
	},
	lastPayment: {
		type: 'date',
		value: new Date().toISOString().substr(0, 10)
	}
};
