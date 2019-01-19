const disappear = function () {
	const jar = document.getElementById("jar");
	jar.style.visibility = "hidden";
	setTimeout(function () {
		jar.style.visibility = "visible";
	}, 1000);
};

const convertCommentsToHtml = function (commentsList) {
	return commentsList.map(x => {
		x = JSON.parse(x);
		x.comment = x.comment.replace(/\+/g, ' ');
		x.comment = decodeURIComponent(x.comment);
		return `<p>${x.date} <b>${x.name}</b> ${x.comment}</p>`;
	}).join("");
};

const addComments = function () {
	fetch('/logs/comments.json')
		.then(function (response) {
			return (response.json());
		})
		.then(function (comments) {
			let commentsDiv = document.getElementById('comments');
			commentsDiv.innerHTML = convertCommentsToHtml(comments);
		});
};