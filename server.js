import sirv from 'sirv';
import express from 'express';
import { auth } from 'express-openid-connect';
import compression from 'compression';
import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;
import nodemailer from 'nodemailer';
import * as path from 'path';
import knex from 'knex';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

import connectKnexSession from 'connect-session-knex';
const KnexSessionStore = connectKnexSession(session);


const connection = knex({
	client: 'sqlite3',
	connection: {
		filename: path.join(process.cwd(), 'database/db.sqlite')
	},
	useNullAsDefault: true
});

connection.schema
	.hasTable('blogs')
	.then((exists) => {
		if (!exists) {
			return connection.schema
				.createTable('blogs', (table) => {
					table.increments('id').primary();
					table.integer('author');
					table.string('title');
					table.string('slug');
					table.date('date');
					table.string('content');
					table.json('comments');
				})
				.then(() => {
					console.log("Table 'Blogs' created");
				})
				.catch((error) => {
					console.error(`There was an error creating table: ${error}`);
				});
		}
	})
	.then(() => {
		console.log('done');
	})
	.catch((error) => {
		console.error(`There was an error setting up the database: ${error}`);
	});

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const portServer = PORT || 4000;

express()
	.use(session({ 
		secret: process.env.cookieSecret, 
		name: process.env.cookieName,
		resave: true,
		saveUninitialized: true,
		store: new KnexSessionStore,
		cookie: { maxAge: 7 * 24 * 60 * 60 * 1000000 }
	}))
	.use(urlencoded({ extended: true }))
	.use(
		cors({
			credentials: true,
			origin: process.env.ORIGIN
		})
	)
	.use(json({ limit: '10mb' }))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		auth({
			required: false,
			auth0Logout: true,
			baseURL: process.env.baseURL,
			issuerBaseURL: 'https://pararel.eu.auth0.com',
			clientID: process.env.openIDClientID,
			appSession: { secret: process.env.openIDSecret },
			async handleCallback(req, res, next) {
				req.session.openidTokens = req.openidTokens;
				req.session.user = req.openid.user;
				req.session.userIdentity = req.openidTokens.claims();
				next();
			},
		})
	)
	.get('/api/user', async (req, res) => {
		res.end(JSON.stringify(req.session.userIdentity || {}));
	})
	.get('/api/blogs', async (req, res) => {
		const blogs = await connection.select('*').from('blogs');
		try {
			res.end(JSON.stringify(blogs));
		} catch {
			res.end(JSON.stringify({ message: `There was an error retrieving blogs: ${err}` }));
		}
	})
	.post('/api/blogs/create', async (req, res) => {
		const ifExist = await connection('blogs').where({ slug: req.body.slug });
		if (ifExist && !!ifExist.length) {
			res.end(JSON.stringify({ message: `Blog already exist` }));
			return;
		}
		const blogs = await connection('blogs').insert({ ...req.body });
		try {
			res.end(JSON.stringify(blogs));
		} catch {
			res.end(JSON.stringify({ message: `There was an error retrieving blogs: ${err}` }));
		}
	})
	.patch('/api/blogs/update', async (req, res) => {
		const blogs = await connection('blogs')
			.where({ id: req.body.id })
			.update({ ...req.body });

		const blog = await connection.select('*').from('blogs').where('id', req.body.id).first();
		
		try {
			res.end(JSON.stringify(blog));
		} catch {
			res.end(JSON.stringify({ message: `There was an error retrieving blogs: ${err}` }));
		}
	})
	.get('/api/blogs/:slug', async (req, res) => {
		let { slug } = req.params;
		const blogs = await connection.select('*').from('blogs').where('slug', slug).first();
		try {
			res.end(JSON.stringify(blogs));
		} catch {
			res.end(JSON.stringify({ message: `There was an error retrieving blogs` }));
		}
	})
	.delete('/api/blogs/delete', async (req, res) => {
		const blogs = await connection('blogs').where('id', req.body.id).del();
		try {
			res.end(JSON.stringify(blogs));
		} catch {
			res.end(JSON.stringify({ message: `There was an error retrieving blogs` }));
		}
	})
	.post('/api/contact', async (req, res) => {
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

		mailTransport.verify(function (error, success) {
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
	})
	.listen(portServer, (err) => {
		if (err) console.log('error', err);
	});
