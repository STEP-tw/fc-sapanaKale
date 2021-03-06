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
	addName(userName){
		this.commentData["name"] = userName;
	}
	addDate(){
		let date = new Date().toUTCString();
		this.commentData["date"] = date;
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