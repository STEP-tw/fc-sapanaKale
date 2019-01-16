const fs = require('fs');

const app = (req, res) => {
	const homePage = fs.readFileSync('./src/homePage.html').toString();
	if(req.url == "/main.js"){
		res.statusCode = 200;
		res.write(fs.readFileSync('./src/main.js').toString());
		res.end();
		return;
	}
	if(req.url == "/main.css"){
		res.statusCode = 200;
		res.write(fs.readFileSync('./src/main.css').toString());
		res.end();
		return;
	}
	if(req.url == "/fc-sapanaKale/src/images/freshorigins.jpg"){
		res.statusCode = 200;
		res.write(fs.readFileSync('./src/images/freshorigins.jpg'));
		res.end();
		return;
	}
	if(req.url == "/fc-sapanaKale/src/images/animated-flower-image-0021.gif"){
		res.statusCode = 200;
		res.write(fs.readFileSync('./src/images/animated-flower-image-0021.gif'));
		res.end();
		return;
	}
	if(req.url == "/"){
		res.statusCode = 200;
		res.write(homePage);
		res.end();
		return;
	}
  res.statusCode = 404;
  res.end();
};

module.exports = app;
