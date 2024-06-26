import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
const { json } = bodyParser;
import nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import knex from 'knex';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { Router } from 'express';
const routes = Router();
// import { handler } from '../build/handler.js';
dotenv.config();

export const pageModel = {
	title: 'string',
	slug: 'string',
	lang: 'string',
	description: 'string',
	content: 'string',
	image: 'string',
	url: 'string',
	position: 'string',
	metaTitle: 'string',
	hidden: 'string',
	onlyHTML: 'string'
};

export const blogModel = {
	title: 'string',
	slug: 'string',
	lang: 'string',
	description: 'string',
	content: 'string',
	image: 'string',
	author: 'string',
	date: 'date',
	categories: 'json',
	comments: 'json'
};

export const expenseModel = {
	title: 'string',
	slug: 'string',
	description: 'string',
	value: 'integer',
	repeat: 'string',
	lastPayment: 'date',
	currency: 'string',
	categories: 'json',
	user: 'string'
};

export const userModel = {
	username: 'string',
	email: 'string',
	password: 'string',
	salt: 'string',
	token: 'string',
	dateloggedin: 'date',
	datecreated: 'date'
};

export const notesModel = {
	title: 'string',
	slug: 'string',
	content: 'string',
	image: 'string',
	position: 'string',
	hidden: 'string',
	datecreated: 'date',
	categories: 'json',
	user: 'string',
	date: 'date'
}

const databases = [
	{ name: 'Pages', model: pageModel },
	{ name: 'Blogs', model: blogModel },
	{ name: 'Expenses', model: expenseModel },
	{ name: 'Notes', model: notesModel },
	{ name: 'Users', model: userModel }
];

import connectKnexSession from 'connect-session-knex';
export const KnexSessionStore = connectKnexSession(session);

export const connection = knex({
	client: 'sqlite3',
	connection: {
		filename: path.join(process.cwd(), 'database/db.sqlite'),
		ssl: false
	},
	useNullAsDefault: true
});

databases.forEach((database) => {
	connection.schema
		.hasTable(database.name)
		.then((exists) => {
			if (!exists) {
				return connection.schema
					.createTable(database.name, (table) => {
						table.increments('id').primary();
						Object.entries(database.model).forEach((key) => {
							const type = key[1];
							const name = key[0];
							table[type](name);
						});
					})
					.then(() => {
						console.log(`Table ${database.name} created`);
					})
					.catch((error) => {
						console.error(`There was an error creating table: ${error}`);
					});
			}
		})
		.then(() => {
			console.log(`${database.name} checked`);
		})
		.catch((error) => {
			console.error(`There was an error setting up the database: ${error}`);
		});
});

const getLang = (req) => {
	return ['en', 'sk'].includes(req.cookies.lang)
		? req.cookies.lang
		: req.headers['accept-language'] && req.headers['accept-language'].includes('sk')
			? 'sk'
			: 'en';
};

const app = express();

app.set('trust proxy', true);

app.use(
	session({
		secret: process.env.cookieSecret,
		resave: false,
		saveUninitialized: true,
		store: new KnexSessionStore(),
		cookie: { maxAge: 7 * 24 * 60 * 60 * 1000000, httpOnly: false }
	})
);

app.use(
	cors({
		credentials: true,
		origin: [process.env.ORIGIN, process.env.ORIGIN2]
	})
);

app.use(json({ limit: '10mb' }));
app.use(compression());

app.use(cookieParser());

const authenticateUser = (req, res, next) => {
    const userToken = req.session.token || req.headers.authorization;
    if (!userToken) {
        res.status(401).json({ message: `Authentication error` });
        return;
    }
    
    try {
        const userInfo = jwt.verify(userToken, process.env.TOKEN_KEY);
        if (!userInfo) {
            res.status(401).json({ message: `Authentication error` });
            return;
        }
        req.user = userInfo;
        next();
    } catch (err) {
        res.status(401).json({ message: `Authentication error: ${err.message}` });
    }
};

const authenticateAdmin = (req, res, next) => {
    const userToken = req.session.token || req.headers.authorization;
    if (!userToken) {
        res.status(401).json({ message: `Authentication error` });
        return;
    }
    
    try {
        const userInfo = jwt.verify(userToken, process.env.TOKEN_KEY);
		const admin = userInfo && userInfo.email === process.env.adminEmail;
		if (!admin) {
			res.status(JSON.json({ message: `Authentification error` }));
			return;
		}
        req.user = userInfo;
        next();
    } catch (err) {
        res.status(401).json({ message: `Authentication error: ${err.message}` });
    }
};


routes.get('/user', async (req, res) => {
	const userToken = req.session.token || req.headers.authorization;
	try {
		const userInfo = jwt.verify(userToken, process.env.TOKEN_KEY);
		res.end(JSON.stringify(userInfo));
	} catch (err) {
		res.end(JSON.stringify({}));
	}
});

routes.get('/blogs', async (req, res) => {
	try {
		const lang = getLang(req);
		const blogs = await connection
			.select('title', 'slug', 'description', 'image', 'author', 'date', 'categories', 'lang')
			.from('blogs')
			.where({ lang })
			.orderBy([{ column: 'date', order: 'desc' }]);
		res.end(JSON.stringify(blogs));
	} catch {
		res.end(JSON.stringify([]));
	}
});

routes.post('/blogs/create', authenticateAdmin, async (req, res) => {
	const ifExist = await connection('blogs').where({ slug: req.body.slug });
	if (ifExist && !!ifExist.length) {
		res.end(JSON.stringify({ message: `Blog already exist` }));
		return;
	}
	const blogs = await connection('blogs').insert({ ...req.body });
	try {
		res.end(JSON.stringify(blogs));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving blogs: ${err}` }));
	}
});

routes.patch('/blogs/update', authenticateAdmin, async (req, res) => {
	const _blogs = await connection('blogs')
		.where({ id: req.body.id })
		.update({ ...req.body });

	const blog = await connection.select('*').from('blogs').where('id', req.body.id).first();

	try {
		res.end(JSON.stringify(blog));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving blogs: ${err}` }));
	}
});

routes.get('/blogs/:slug', async (req, res) => {
	const lang = getLang(req);
	const defaultEmpty = {
		...blogModel,
		title: 'Blog',
		slug: 'blog',
		metaTitle: 'Blog | SvelteKit',
		url: '/blog',
		lang,
		content: `<style>.home {min-height: 100vh; margin-top: -50px; padding-top: 50px; background: rgba(0,0,0,0.1); width: 100%;}</style><div class="home"><h1 style="text-align: center;">Welcome to SvelteKit template</h1><h2 style="text-align: center;"><strong>Feel free to edit page with markdown or editor</strong></h2><br><p style="text-align: center;"> <span style="font-size: 18px;">Add more pages =</span><span style="font-size: 18px;"><a href="/add"> /add</a></span><span style="font-size: 18px;"> , add blog </span><span style="font-size: 18px;"><a href="/blogs/add">/blogs/add</a></span></p><div><br></div><p style="text-align: center;"> <br> <strong style="font-size: 18px;">Good luck!</strong> <br> </p></div>`
	};
	try {
		let { slug } = req.params;
		const blog = await connection.select('*').from('blogs').where('slug', slug).first();
		if (blog) {
			res.end(JSON.stringify(blog));
		} else {
			res.end(JSON.stringify(defaultEmpty));
		}
	} catch {
		res.end(JSON.stringify(defaultEmpty));
	}
});

routes.delete('/blogs/delete/:id', authenticateAdmin, async (req, res) => {
	const id = req.params['id'];
	const _blogs = await connection('blogs').where('id', id).del();
	try {
		res.end(JSON.stringify({}));
	} catch {
		res.end(JSON.stringify({ message: `There was an error retrieving blogs` }));
	}
});

routes.get('/pages', async (req, res) => {
	try {
		const lang = getLang(req);
		const pages = await connection('pages')
			.where({ lang })
			.select(
				'id',
				'title',
				'metaTitle',
				'url',
				'slug',
				'description',
				'position',
				'lang',
				'hidden',
				'onlyHTML'
			);
		res.end(JSON.stringify(pages));
	} catch {
		res.end(JSON.stringify([]));
	}
});

routes.post('/pages/create', authenticateAdmin, async (req, res) => {
	const lang = getLang(req);
	const ifExist = await connection('pages').where({ lang, slug: req.body.slug });
	if (ifExist && !!ifExist.length) {
		res.end(JSON.stringify({ message: `Page already exist` }));
		return;
	}
	const pages = await connection('pages').insert({ ...req.body });
	try {
		res.end(JSON.stringify(pages));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving pages: ${err}` }));
	}
});

routes.patch('/pages/update', authenticateAdmin, async (req, res) => {
	const _pages = await connection('pages')
		.where({ id: req.body.id })
		.update({ ...req.body });

	const page = await connection.select('*').from('pages').where('id', req.body.id).first();

	try {
		res.end(JSON.stringify(page));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving pages: ${err}` }));
	}
});

routes.get('/pages/:slug', async (req, res) => {
	const lang = getLang(req);
	let { slug } = req.params;

	const defaultEmpty = {
		...pageModel,
		title: 'Home',
		slug: 'home',
		metaTitle: 'Home | SvelteKit',
		url: '/',
		lang,
		content: `<style>.home {min-height: 100vh; margin-top: -50px; padding-top: 50px; background: rgba(0,0,0,0.1); width: 100%;}</style><div class="home"><h1 style="text-align: center;">Welcome to SvelteKit template</h1><h2 style="text-align: center;"><strong>Feel free to edit page with markdown or editor</strong></h2><br><p style="text-align: center;"> <span style="font-size: 18px;">Add more pages =</span><span style="font-size: 18px;"><a href="/add"> /add</a></span><span style="font-size: 18px;"> , add blog </span><span style="font-size: 18px;"><a href="/blogs/add">/blogs/add</a></span></p><div><br></div><p style="text-align: center;"> <br> <strong style="font-size: 18px;">Good luck!</strong> <br> </p></div>`
	};
	try {
		const page = await connection
			.select('*')
			.from('pages')
			.where({ lang, slug })
			.orWhere({ lang, url: slug })
			.first();

		if (page) {
			res.end(JSON.stringify(page));
		} else {
			if (slug === 'home') {
				const _pages = await connection('pages').insert({ ...defaultEmpty });
				res.end(JSON.stringify(defaultEmpty));
			} else {
				res.end(JSON.stringify(defaultEmpty));
			}
		}
	} catch (e) {
		res.end(JSON.stringify(defaultEmpty));
	}
});

routes.get('/pages/:slug/:subpage', async (req, res) => {
	const lang = getLang(req);
	let { slug } = req.params;
	let { subpage } = req.params;

	const defaultEmpty = {
		...pageModel,
		title: 'Page',
		slug: 'Page',
		metaTitle: 'Page | SvelteKit',
		url: '/',
		lang,
		content: `<style>.home {min-height: 100vh; margin-top: -50px; padding-top: 50px; background: rgba(0,0,0,0.1); width: 100%;}</style><div class="home"><h1 style="text-align: center;">Welcome to SvelteKit template</h1><h2 style="text-align: center;"><strong>Feel free to edit page with markdown or editor</strong></h2><br><p style="text-align: center;"> <span style="font-size: 18px;">Add more pages =</span><span style="font-size: 18px;"><a href="/add"> /add</a></span><span style="font-size: 18px;"> , add blog </span><span style="font-size: 18px;"><a href="/blogs/add">/blogs/add</a></span></p><div><br></div><p style="text-align: center;"> <br> <strong style="font-size: 18px;">Good luck!</strong> <br> </p></div>`
	};
	try {
		const page = await connection
			.select('*')
			.from('pages')
			.where({ lang, url: slug + '/' + subpage })
			.first();

		if (page) {
			res.end(JSON.stringify(page));
		} else {
			res.end(JSON.stringify(defaultEmpty));
		}
	} catch (e) {
		res.end(JSON.stringify(defaultEmpty));
	}
});

routes.delete('/pages/delete/:id',authenticateAdmin, async (req, res) => {
	const id = req.params['id'];
	const _page = await connection('pages').where('id', id).del();
	try {
		res.end(JSON.stringify({}));
	} catch {
		res.end(JSON.stringify({ message: `There was an error retrieving pages` }));
	}
});

routes.get('/expenses',authenticateUser, async (req, res) => {
	try {
		const expenses = await connection('expenses').select('*').where('user', req.user.email);
		res.end(JSON.stringify(expenses));
	} catch {
		res.end(JSON.stringify([]));
	}
});

routes.post('/expenses/create', authenticateUser, async (req, res) => {
	const ifExist = await connection('expenses').where({ slug: req.body.slug });
	if (ifExist && !!ifExist.length) {
		res.end(JSON.stringify({ message: `Expense already exist` }));
		return;
	}
	const expenses = await connection('expenses').insert({ ...req.body, user: req.user.email });
	try {
		res.end(JSON.stringify(expenses));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving expenses: ${err}` }));
	}
});

routes.patch('/expenses/update', authenticateUser, async (req, res) => {
	const _expenses = await connection('expenses')
		.where({ id: req.body.id })
		.update({ ...req.body });

	const page = await connection
		.select('*')
		.from('expenses')
		.where({ id: req.body.id, user: req.user.email })
		.first();

	try {
		res.end(JSON.stringify(page));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving expenses: ${err}` }));
	}
});

routes.get('/expenses/:slug', authenticateUser, async (req, res) => {
	let { slug } = req.params;
	try {
		const expense = await connection
			.select('*')
			.from('expenses')
			.where({ slug, user: req.user.email })
			.first();

		return expense ? res.end(JSON.stringify(expense)) : res.end(JSON.stringify({}));
	} catch (e) {
		res.end(JSON.stringify({}));
	}
});

routes.delete('/expenses/delete/:id', authenticateUser, async (req, res) => {
	const id = req.params['id'];

	const _expense = await connection('expenses').where({ id, user: req.user.email }).del();
	try {
		res.end(JSON.stringify({}));
	} catch {
		res.end(JSON.stringify({ message: `There was an error retrieving expenses` }));
	}
});


routes.get('/notes',authenticateUser, async (req, res) => {
	try {
		const expenses = await connection('notes').select('*').where('user', req.user.email);
		res.end(JSON.stringify(expenses));
	} catch {
		res.end(JSON.stringify([]));
	}
});

routes.post('/notes/create', authenticateUser, async (req, res) => {
	const ifExist = await connection('notes').where({ slug: req.body.slug });
	if (ifExist && !!ifExist.length) {
		res.end(JSON.stringify({ message: `Notes already exist` }));
		return;
	}
	const notes = await connection('notes').insert({ ...req.body, user: req.user.email });
	try {
		res.end(JSON.stringify(notes));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving notes: ${err}` }));
	}
});

routes.patch('/notes/update', authenticateUser, async (req, res) => {
	const _notes = await connection('notes')
		.where({ id: req.body.id })
		.update({ ...req.body });

	const page = await connection
		.select('*')
		.from('notes')
		.where({ id: req.body.id, user: req.user.email })
		.first();

	try {
		res.end(JSON.stringify(page));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving notes: ${err}` }));
	}
});

routes.get('/notes/:slug', authenticateUser, async (req, res) => {
	let { slug } = req.params;
	try {
		const expense = await connection
			.select('*')
			.from('notes')
			.where({ slug, user: req.user.email })
			.first();

		return expense ? res.end(JSON.stringify(expense)) : res.end(JSON.stringify({}));
	} catch (e) {
		res.end(JSON.stringify({}));
	}
});

routes.delete('/notes/delete/:id', authenticateUser, async (req, res) => {
	const id = req.params['id'];

	const _expense = await connection('notes').where({ id, user: req.user.email }).del();
	try {
		res.end(JSON.stringify({}));
	} catch {
		res.end(JSON.stringify({ message: `There was an error retrieving notes` }));
	}
});

routes.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Make sure there is an Email and Password in the request
		if (!(email && password)) {
			res.status(400).json('All input is required');
		}

		const user = await connection('users').where({ email }).first();
		if (user) {
			const PHash = bcrypt.hashSync(password, user.salt);

			if (PHash === user.password) {
				// * CREATE JWT TOKEN
				const token = jwt.sign(
					{ user_id: user.id, username: user.username, email },
					process.env.TOKEN_KEY,
					{
						expiresIn: '1000d'
					}
				);

				user.token = token;
				req.session.token = token;
				res.end(JSON.stringify(user));
			} else {
				return res.status(400).json('No Match');
			}
		} else {
			return res.status(400).json('No Match');
		}
	} catch (err) {
		console.log(err);
	}
});

routes.post('/register', async (req, res) => {
	var errors = [];
	try {
		const { username, email, password } = req.body;

		if (!username) {
			errors.push('Username is missing');
		}
		if (!email) {
			errors.push('Email is missing');
		}
		if (errors.length) {
			res.status(400).json({ error: errors.join(',') });
			return;
		}

		const user = await connection('users').where({ email }).first();

		if (!user) {
			var salt = bcrypt.genSaltSync(10);

			var data = {
				username,
				email,
				password: bcrypt.hashSync(password, salt),
				salt,
				datecreated: Date('now')
			};

			const users = await connection('users').insert({ ...data });
			if (users) {
				return res.status(200).json('Success');
			}
		} else {
			return res.status(400).json('Record already exists. Please login');
		}
	} catch (err) {
		return res.status(400).json('Problem to register user');
	}
});

routes.get('/logout', async (req, res) => {
	req.session.token = '';
	res.end(JSON.stringify({ message: `Success logout` }));
});

routes.post('/contact', async (req, res) => {
	let mailTransport = nodemailer.createTransport({
		service: 'Gmail',
		host: process.env.emailHost,
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.emailAuth,
			pass: process.env.emailPassword
		}
	});

	let info = await mailTransport.sendMail({
		from: process.env.emailSenderTo,
		to: process.env.emailSenderFrom,
		subject: req.body.subject + ' ' + req.body.email,
		text: req.body.note,
		html: '<b>' + req.body.note + '</b>'
	});

	mailTransport.verify(function (error, _success) {
		if (error) {
			console.log(error);
		} else {
			console.log('Server is ready to take our messages');
		}
	});

	try {
		res.end(JSON.stringify({ ...info, message: 'message_success' }));
	} catch {
		res.end(JSON.stringify({ message: 'message_error' }));
	}
});

app.use('/api/v1', routes);

const run = async () => {
	const { PORT } = process.env;
	const portServer = PORT || 4000;

	if (fs.existsSync('../build/handler.js')) {
		console.log('handler.js exist');
		const { handler } = await import('../build/handler.js');
		app.use(handler);
	}

	// app.use(handler);

	app.listen(portServer, (err) => {
		if (err) console.log('error', err);
	});
};

run();
