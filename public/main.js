const disappear = function () {
	const jar = document.getElementById("jar");
	jar.style.visibility = "hidden";
	setTimeout(function () {
		jar.style.visibility = "visible";
	}, 1000);
};

const addComments = function () {
	fetch('/comments')
		.then(function (response) {
			return response.text();
		})
		.then(function (comments) {
			let commentsDiv = document.getElementById('comments');
			commentsDiv.innerHTML = comments;
		});
};