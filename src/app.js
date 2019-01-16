const fs = require('fs');

const app = (req, res) => {
	if (req.url == "/main.js") {
		fs.readFile('./src/main.js', "utf8", (err, content) => {
			res.statusCode = 200;
			res.write(content);
			res.end();
			return;
		})
	}
	if (req.url == "/main.css") {
		fs.readFile('./src/main.css', 'utf8', (err, content) => {
			res.statusCode = 200;
			res.write(content);
			res.end();
			return;
		})
	}
	if (req.url == "/fc-sapanaKale/src/images/freshorigins.jpg") {
		fs.readFile('./src/images/freshorigins.jpg', (err, content) => {
			res.statusCode = 200;
			res.write(content);
			res.end();
			return;
		})
	}
	if (req.url == "/fc-sapanaKale/src/images/animated-flower-image-0021.gif") {
		fs.readFile('./src/images/animated-flower-image-0021.gif', (err, content) => {
			res.statusCode = 200;
			res.write(content);
			res.end();
			return;
		})
	}
	if (req.url == "/") {
		fs.readFile('./src/homePage.html', "utf8", (err, content) => {
			res.statusCode = 200;
			res.write(content);
			res.end();
			return;
		})
	}
	else {
		res.statusCode = 404;
	}
};

module.exports = app;
