const fs = require('fs');

const App = require('./createApp');
const app = new App();

const { Comment, Comments, initializeComments } = require('./comment');
let commentsDetails = initializeComments('./private/data/comments.json');
let comments = new Comments(commentsDetails);

const GuestBook = require('./guestBook');
let guestBook = fs.readFileSync('./public/guestBook.html', 'utf8');

let userIDs = fs.readFileSync('./private/data/userIDs.json', "utf8");
userIDs = JSON.parse(userIDs);

let sessions = fs.readFileSync('./private/data/sessions.json', "utf8");
sessions = JSON.parse(sessions);

const createUserIDCookie = function (res) {
	let userID = new Date().getTime();
	res.setHeader('Set-Cookie', `userId=${userID}`);
};

const getUserID = function (req) {
	const cookie = req.headers['cookie'];
	return +cookie.split('=')[1];
};

const updateUserIDs = function (req) {
	let userID = getUserID(req);
	if (!userIDs.includes(userID)) {
		userIDs.push(userID);
		fs.writeFile('./private/data/userIDs.json', JSON.stringify(userIDs), () => { });
	};
};

const readCookies = (req, res, next) => {
	const cookie = req.headers['cookie'];
	req.cookie = cookie;
	if (!cookie) {
		createUserIDCookie(res);
	} else {
		updateUserIDs(req);
	}
	next();
};

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

const send = function (statusCode, content, res) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const sendContent = send.bind(null, 200);
const sendNotFound = send.bind(null, 404, "Not Found");
const sendServerError = send.bind(null, 500, "Internal Server Error");

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
			sendContent(content, res);
		} catch (error) {
			if (isErrorFileNotFound(err.code)) {
				sendNotFound(res);
				return;
			}
			sendServerError(res);
		};
	});
};

const renderComments = function (req, res, next) {
	sendContent(comments.stringify(), res);
};

const renderGuestBook = function (req, res, next) {
	let userID = getUserID(req);
	let userName = sessions[userID];
	let guestBookForm = new GuestBook(guestBook, comments);
	guestBookForm = guestBookForm.withLogInForm();
	if (userName != undefined) {
		guestBookForm = new GuestBook(guestBook);
		guestBookForm = guestBookForm.withCommentForm(userName);
	};
	sendContent(guestBookForm, res);
};

const renderUpdatedComments = function (req, res, next) {
	let userID = getUserID(req);
	let userName = sessions[userID];
	let comment = readArgs(req.body);
	comment = new Comment(comment);
	comment.addName(userName);
	comment.addDate();
	comments.add(comment.stringify());
	fs.writeFile('./private/data/comments.json', comments.stringify(), (err) => {
		sendContent(comments.stringify(), res);
	});
}

const renderCommentForm = function (req, res, next) {
	let userName = readArgs(req.body).name;
	let userID = getUserID(req);
	sessions[userID] = userName;
	fs.writeFile('./private/data/sessions.json', JSON.stringify(sessions), () => {
		let guestBookForm = new GuestBook(guestBook);
		sendContent(guestBookForm.withCommentForm(userName), res);
	});
};

const renderLogInForm = function (req, res, next) {
	let userID = getUserID(req);
	sessions[userID] = undefined;
	fs.writeFile('./private/data/sessions.json', JSON.stringify(sessions), () => {
		let guestBookForm = new GuestBook(guestBook);
		sendContent(guestBookForm.withLogInForm(), res);
	});
};

const guestBookView = {
	"name": renderCommentForm,
	'': renderLogInForm
};

const renderGuestBookWithComment = function (req, res, next) {
	let input = readArgs(req.body);
	let typeOfPost = Object.keys(input)[0];
	guestBookView[typeOfPost](req, res, next);
};

app.use(readCookies);
app.use(readBody);
app.use(logRequest);
app.get('/comments', renderComments);
app.post('/updateComment', renderUpdatedComments);
app.get('/guestBook.html', renderGuestBook);
app.post('/guestBook.html', renderGuestBookWithComment);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);