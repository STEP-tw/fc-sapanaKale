const fs = require('fs');
let comments = fs.readFileSync('./public/logs/comments.json',"utf8");
comments = JSON.parse(comments);
const App = require('./createApp');
const app = new App();

const logRequest = (req, res, next) => {
	console.log(req.method, req.url);
	console.log('headers =>', JSON.stringify(req.headers, null, 2));
	console.log('body =>', req.body);
	next();
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

const send = function (res, content) {
	res.statusCode = 200;
	res.write(content);
	res.end();
};

const sendNotFound = (req, res) => {
	res.statusCode = 404;
	res.write("Not Found");
	res.end();
};

const sendServerError = function (res) {
	res.statusCode = 500;
	res.write("Internal Server Error");
	res.end();
};

const getPath = function (url) {
	if (url == "/") return "./public/index.html";
	return "./public" + url;
};

const handleFileRequest = function (req, res, next) {
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		if (err) sendServerError(res);
		send(res, content);
	});
};

const convertCommentsToHtml = function (commentsList) {
	return commentsList.map(x => {
		x = JSON.parse(x);
		x.comment = x.comment.replace(/\+/g,' ');
		x.comment = decodeURIComponent(x.comment);
		return `<p>${x.date} <b>${x.name}</b> ${x.comment}</p>`;
	}).join("");
};

const handleGuestBook = function (req, res, next) {
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		let commentsList = convertCommentsToHtml(comments);
		if (err) sendServerError(res);
		let guestBook = content.toString().replace("#comments#",commentsList);
		send(res, guestBook);
	});
};

const handleGuestBookWithPost = function (req, res, next) {
	let comment = readArgs(req.body);
	comment.date = new Date().toLocaleString();
	comments.unshift(JSON.stringify(comment));
	fs.writeFile('./public/logs/comments.json', JSON.stringify(comments), (err) => {
		handleGuestBook(req, res, next);
	});
};

app.use(readBody);
app.use(logRequest);
app.get('/', handleFileRequest);
app.get('/index.html', handleFileRequest);
app.get('/main.js', handleFileRequest);
app.get('/main.css', handleFileRequest);
app.get('/images/freshorigins.jpg', handleFileRequest);
app.get('/images/animated-flower-image-0021.gif', handleFileRequest);
app.get('/abeliophyllum.html', handleFileRequest);
app.get('/images/pbase-Abeliophyllum.jpg', handleFileRequest);
app.get('/logs/Abeliophyllum.pdf',handleFileRequest);
app.get('/ageratum.html',handleFileRequest);
app.get('/images/pbase-agerantum.jpg',handleFileRequest);
app.get('/logs/Ageratum.pdf',handleFileRequest);
app.get('/logs/comments.json', handleFileRequest);
app.get('/guestBook.html', handleGuestBook);
app.post('/guestBook.html', handleGuestBookWithPost);
app.use(sendNotFound);

module.exports = app.handleRequest.bind(app);