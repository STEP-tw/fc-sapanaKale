const disappear = function () {
	const jar = document.getElementById("jar");
	jar.style.visibility = "hidden";
	setTimeout(function () {
		jar.style.visibility = "visible";
	}, 1000);
};

const convertToHtml = function (commentsDetails) {
	return commentsDetails.map(commentData => {
		commentData = JSON.parse(commentData);
		let date = new Date(commentData.date).toLocaleString();
		return `<p>${date} <b>${commentData.name}</b>
		${commentData.comment}</p>`;
	}).join("");
};

const addComments = function () {
	fetch('/comments')
		.then(function (response) {
			return response.json();
		})
		.then(function (comments) {
			let commentsDiv = document.getElementById('comments');
			commentsDiv.innerHTML = convertToHtml(comments);
		});
};

const updateComments = function () {
	let comment = document.getElementById('comment').value;
	fetch('/updateComment', {
		method: 'POST',
		body: `comment=${comment}`
	})
		.then(response => response.json())
		.then(comments => {
			let commentsDiv = document.getElementById('comments');
			commentsDiv.innerHTML = convertToHtml(comments);
		});
	document.getElementById('comment').value = '';
};

window.onload = addComments;