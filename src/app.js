const fs = require('fs');
let comments = require('../public/logs/comments.json');
const App = require('./createApp');
const app = new App();

const logRequest = (req, res, next) => {
	console.log(req.method, req.url);
	console.log('headers =>', JSON.stringify(req.headers, null, 2));
	console.log('body =>', req.body);
	next();
};

const send = function (res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const sendNotFound = (req, res) => {
	res.statusCode = 404;
	res.write("bad request");
	res.end();
};

const getPath = function (url) {
	if (url == "/") return "./public/homePage.html";
	return "./public" + url;
};

const readBody = (req, res, next) => {
	let content = "";
	req.on('data', (chunk) => content += chunk);
	req.on('end', () => {
		req.body = content;
		next();
	});
};

const readArgs = text => {
	let args = {};
	const splitKeyValue = pair => pair.split('=');
	const assignKeyValueToArgs = ([key, value]) => args[key] = value;
	text.split('&').map(splitKeyValue).forEach(assignKeyValueToArgs);
	return args;
};

const getRequestHandler = function (req, res, next) {
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		if (err) {
			send(res, 404, "bad request");
			return;
		}
		send(res, 200, content);
	});
};

const renderGuestBookWithComments = function (req, res, next) {
	let path = getPath(req.url);
	let text = req.body;
	let args = readArgs(text);
	let date = new Date().toLocaleString();
	args.date = date;
	comments.unshift(JSON.stringify(args));
	fs.writeFile('./public/logs/comments.json', JSON.stringify(comments), (err) => {
		let commentsList = comments.map(x => {
			x = JSON.parse(x);
			return `<p>${x.date} ${x.name} ${x.comment}</p>`;
		}).join("");

		fs.readFile(path, (err, content) => {
			if (err) {
				send(res, 404, "bad request");
			}
			else {
				send(res, 200, content + commentsList);
				return;
			}
		});
	})
};

const guestBookRequestHandler = function (req, res, next) {
	let commentsList = comments.map(x => {
		x = JSON.parse(x);
		return `<p>${x.date} ${x.name} ${x.comment}</p>`;
	}).join("");
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		if (err) {
			send(res, 404, "bad request");
			return;
		}
		send(res, 200, content + commentsList);
	});
};

app.use(readBody);
app.use(logRequest);
app.get('/', getRequestHandler);
app.get('/main.js', getRequestHandler);
app.get('/main.css', getRequestHandler);
app.get('/images/freshorigins.jpg', getRequestHandler);
app.get('/images/animated-flower-image-0021.gif', getRequestHandler);
app.get('/guestBook.html', guestBookRequestHandler);
app.post('/guestBook.html', renderGuestBookWithComments);
app.use(sendNotFound);

module.exports = app.handleRequest.bind(app);