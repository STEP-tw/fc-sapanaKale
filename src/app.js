const fs = require('fs');

const send = function (res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const getPath = function (url) {
	if (url == "/") return "./src/homePage.html";
	return "./src" + url;
}

const app = (req, res) => {
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		if (err) {
			send(res, 404, "bad request");
		} else {
			send(res, 200, content);
			return;
		}
	})
};

module.exports = app;
