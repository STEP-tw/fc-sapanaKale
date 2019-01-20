const fs = require('fs');
const App = require('./createApp');
const app = new App();
const {Comment, Comments, initializeComments} = require('./comment');
let commentsDetails = initializeComments('./private/data/comments.json');
let comments = new Comments(commentsDetails);


const logRequest = function (req, res, next) {
	console.log(req.method, req.url);
	console.log('headers =>', JSON.stringify(req.headers, null, 2));
	console.log('body =>', req.body);
	next();
};

const readBody = function (req, res, next) {
	let content = "";
	req.on('data', (chunk) => content += chunk);
	req.on('end', () => {
		req.body = content;
		next();
	});
};

const readArgs = function (text) {
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

const sendNotFound = function (res) {
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

const isErrorFileNotFound = function (errorCode) {
	return errorCode == "ENOENT";
};

const renderFile = function (req, res) {
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		try {
			send(res, content);
		} catch (error) {
			if (isErrorFileNotFound(err.code)) {
				sendNotFound(res);
				return;
			}
			sendServerError(res);
		};
	});
};

const renderGuestBook = function (req, res, next) {
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		if (err) sendServerError(res);
		let commentsList = comments.convertToHtml();
		let guestBook = content.toString().replace("#comments#", commentsList);
		send(res, guestBook);
	});
};

const renderGuestBookWithComment = function (req, res, next) {
	let comment = new Comment(readArgs(req.body));
	comment.addDate();
	comments.add(comment.stringify());
	fs.writeFile('./private/data/comments.json', comments.stringify(), (err) => {
		renderGuestBook(req, res, next);
	});
};

const renderComments = function (req, res, next) {
	send(res, comments.convertToHtml().toString());
}

app.use(readBody);
app.use(logRequest);
app.get('/comments', renderComments);
app.get('/guestBook.html', renderGuestBook);
app.post('/guestBook.html', renderGuestBookWithComment);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);