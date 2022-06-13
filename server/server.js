import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;
import nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import knex from 'knex';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
dotenv.config();

export const pageModel = {
	title: 'string',
	slug: 'string',
	description: 'string',
	url: 'string',
	content: 'string',
	image: 'string',
	position: 'string',
	metaTitle: 'string',
	lang: 'string'
};

export const blogModel = {
	title: 'string',
	slug: 'string',
	description: 'string',
	content: 'string',
	imgLink: 'string',
	author: 'string',
	date: 'date',
	categories: 'json',
	comments: 'json',
	lang: 'string'
};

export const userModel = {
	Username: 'string',
	Email: 'string',
	Password: 'string',
	Salt: 'string',
	Token: 'string',
	DateLoggedIn: 'date',
	DateCreated: 'date'
};

const databases = [
	{ name: 'Pages', model: pageModel },
	{ name: 'blogs', model: blogModel },
	{ name: 'Users', model: userModel }
];

import connectKnexSession from 'connect-session-knex';
const KnexSessionStore = connectKnexSession(session);

const connection = knex({
	client: 'sqlite3',
	connection: {
		filename: path.join(process.cwd(), 'database/db.sqlite')
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

const { PORT } = process.env;
const portServer = PORT || 4000;

const app = express();

app.use(
	session({
		secret: process.env.cookieSecret,
		name: process.env.cookieName,
		resave: false,
		saveUninitialized: false,
		store: new KnexSessionStore(),
		cookie: { maxAge: 7 * 24 * 60 * 60 * 1000000, httpOnly: false }
	})
);

app.use(urlencoded({ extended: true }));
app.use(
	cors({
		credentials: true,
		origin: process.env.ORIGIN
	})
);

app.use(json({ limit: '10mb' }));
app.use(compression({ threshold: 0 }));

app.get('/api/user', async (req, res) => {
	try {
		const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
		res.end(JSON.stringify(userInfo));
	} catch (err) {
		res.end(JSON.stringify({}));
	}
});

app.get('/api/config', async (req, res) => {
	try {
		res.end(JSON.stringify({ disqusSrc: process.env.disqusSrc, lang: req.session.lang }));
	} catch (err) {
		res.end(JSON.stringify({}));
	}
});

app.post('/api/lang', async (req, res) => {
	try {
		const langFromRequest =
			req.body.lang && ['en', 'sk'].includes(req.body.lang.toLowerCase())
				? req.body.lang.toLowerCase()
				: 'en';
		req.session.lang = langFromRequest;
		res.end(JSON.stringify({ lang: langFromRequest }));
	} catch (err) {
		res.end(JSON.stringify({ lang: 'en' }));
	}
});

app.get('/api/blogs', async (req, res) => {
	try {
		const lang = req.session.lang || 'en';
		const blogs = await connection
			.select('*')
			.from('blogs')
			.where({ lang })
			.orderBy([{ column: 'date', order: 'desc' }]);
		res.end(JSON.stringify(blogs));
	} catch {
		res.end(JSON.stringify([]));
	}
});

app.post('/api/blogs/create', async (req, res) => {
	if (!req.session.token) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
	const admin = userInfo && userInfo.Email === process.env.adminEmail;
	if (!admin) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
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

app.patch('/api/blogs/update', async (req, res) => {
	if (!req.session.token) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
	const admin = userInfo && userInfo.Email === process.env.adminEmail;
	if (!admin) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
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

app.get('/api/blogs/:slug', async (req, res) => {
	try {
		let { slug } = req.params;
		const blogs = await connection.select('*').from('blogs').where('slug', slug).first();
		res.end(JSON.stringify(blogs));
	} catch {
		res.end(
			JSON.stringify({
				...blogModel,
				content: 'Something is missing'
			})
		);
	}
});

app.delete('/api/blogs/delete/:id', async (req, res) => {
	if (!req.session.token) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
	const admin = userInfo && userInfo.Email === process.env.adminEmail;
	if (!admin) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const id = req.params['id'];
	const _blogs = await connection('blogs').where('id', id).del();
	try {
		res.end(JSON.stringify({}));
	} catch {
		res.end(JSON.stringify({ message: `There was an error retrieving blogs` }));
	}
});

app.get('/api/pages', async (req, res) => {
	try {
		const lang = req.session.lang || 'en';
		const pages = await connection('pages')
			.where({ lang })
			.select('id', 'title', 'metaTitle', 'url', 'slug', 'description', 'position', 'lang');
		res.end(JSON.stringify(pages));
	} catch {
		res.end(JSON.stringify([]));
	}
});

app.post('/api/pages/create', async (req, res) => {
	if (!req.session.token) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
	const admin = userInfo && userInfo.Email === process.env.adminEmail;
	if (!admin) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const ifExist = await connection('pages').where({ slug: req.body.slug });
	if (ifExist && !!ifExist.length) {
		res.end(JSON.stringify({ message: `Page already exist` }));
		return;
	}
	const blogs = await connection('pages').insert({ ...req.body });
	try {
		res.end(JSON.stringify(blogs));
	} catch (err) {
		res.end(JSON.stringify({ message: `There was an error retrieving pages: ${err}` }));
	}
});

app.patch('/api/pages/update', async (req, res) => {
	if (!req.session.token) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
	const admin = userInfo && userInfo.Email === process.env.adminEmail;
	if (!admin) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
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

app.get('/api/pages/:slug', async (req, res) => {
	try {
		const lang = req.session.lang || 'en';
		let { slug } = req.params;
		const page = await connection
			.select('*')
			.from('pages')
			.where({ lang })
			.where('slug', slug)
			.orWhere('url', slug)
			.first();
		res.end(JSON.stringify(page));
	} catch {
		res.end(
			JSON.stringify({
				...pageModel,
				title: 'Home',
				slug: 'home',
				url: '/',
				content: 'Something is missing'
			})
		);
	}
});

app.delete('/api/pages/delete/:id', async (req, res) => {
	if (!req.session.token) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const userInfo = jwt.verify(req.session.token, process.env.TOKEN_KEY);
	const admin = userInfo && userInfo.Email === process.env.adminEmail;
	if (!admin) {
		res.end(JSON.stringify({ message: `Authentification error` }));
		return;
	}
	const id = req.params['id'];
	const _page = await connection('pages').where('id', id).del();
	try {
		res.end(JSON.stringify({}));
	} catch {
		res.end(JSON.stringify({ message: `There was an error retrieving pages` }));
	}
});

app.post('/api/login', async (req, res) => {
	try {
		const { Email, Password } = req.body;

		// Make sure there is an Email and Password in the request
		if (!(Email && Password)) {
			res.status(400).send('All input is required');
		}

		const user = await connection('users').where({ Email: Email }).first();
		if (user) {
			const PHash = bcrypt.hashSync(Password, user.Salt);

			if (PHash === user.Password) {
				// * CREATE JWT TOKEN
				const token = jwt.sign(
					{ user_id: user.id, username: user.Username, Email },
					process.env.TOKEN_KEY,
					{
						expiresIn: '1000d'
					}
				);

				user.Token = token;
				req.session.token = token;

				res.end(JSON.stringify(user));
			} else {
				return res.status(400).send('No Match');
			}
		} else {
			return res.status(400).send('No Match');
		}
	} catch (err) {
		console.log(err);
	}
});

app.post('/api/register', async (req, res) => {
	var errors = [];
	try {
		const { Username, Email, Password } = req.body;

		if (!Username) {
			errors.push('Username is missing');
		}
		if (!Email) {
			errors.push('Email is missing');
		}
		if (errors.length) {
			res.status(400).json({ error: errors.join(',') });
			return;
		}

		const user = await connection('users').where({ Email: Email }).first();

		if (!user) {
			var salt = bcrypt.genSaltSync(10);

			var data = {
				Username: Username,
				Email: Email,
				Password: bcrypt.hashSync(Password, salt),
				Salt: salt,
				DateCreated: Date('now')
			};

			const users = await connection('users').insert({ ...data });
			if (users) {
				return res.status(200).json('Success');
			}
		} else {
			return res.status(201).json('Record already exists. Please login');
		}
	} catch (err) {
		console.log(err);
	}
});

app.get('/api/logout', async (req, res) => {
	req.session.token = '';
	res.end(JSON.stringify({ message: `Success logout` }));
});

app.post('/api/contact', async (req, res) => {
	let mailTransport = nodemailer.createTransport({
		host: process.env.emailHost,
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.emailAuth,
			pass: process.env.emailPassword
		},
		tls: {
			rejectUnauthorized: false
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
		res.end(JSON.stringify({ ...info, message: 'success' }));
	} catch {
		res.end(JSON.stringify({ message: `Mail wasnt send` }));
	}
});

const run = async () => {
	if (fs.existsSync('../build/handler.js')) {
		const { handler } = await import('../build/handler.js');
		app.use(handler);
	}

	app.listen(portServer, (err) => {
		if (err) console.log('error', err);
	});
};

run();
