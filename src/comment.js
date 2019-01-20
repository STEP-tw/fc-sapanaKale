const fs = require('fs');

class Comment {
	constructor(comment){
		this.commentData = comment;
	}
	parse(){
		return JSON.parse(this.commentData);
	}
	stringify(){
		return JSON.stringify(this.commentData);
	}
	addDate(){
		this.commentData["date"] = new Date().toLocaleString();
	}
};

class Comments {
	constructor(commentsDetails){
		this.commentsDetails = commentsDetails;
	}
	add(comment){
		this.commentsDetails.unshift(comment);
	}
	stringify(){
		return JSON.stringify(this.commentsDetails);
	}
	convertToHtml(){
		return this.commentsDetails.map(commentData => {
			commentData = JSON.parse(commentData);
			return `<p>${commentData.date} <b>${commentData.name}</b>
			${commentData.comment}</p>`;
		}).join("");
	}
};

const initializeComments = function (path){
	if(fs.existsSync(path)){
		return JSON.parse(fs.readFileSync(path,"utf8"));
	};
	fs.writeFileSync(path,"[]");
	return JSON.parse(fs.readFileSync(path,"utf8"));
};

module.exports = {
	Comment,
	Comments,
	initializeComments
}