const partialHtmls = require('./partialHtml');

class GuestBook {
	constructor(guestBookTemplate, comments) {
		this.guestBook = guestBookTemplate;
		this.comments = comments;
	}
	addComments() {
		let commentsList = this.comments.convertToHtml();
		return this.guestBook.replace('#comments#', commentsList)
	}
	addLogInForm(guestBook) {
		return guestBook.replace('#form#', partialHtmls.logInForm);
	}
	addCommentForm(guestBook, userName) {
		return guestBook.replace('#form#', partialHtmls.commentForm(userName))
	}
	withLogInForm() {
		let guestBook = this.addComments();
		guestBook = this.addLogInForm(guestBook);
		return guestBook.replace('#message#', '');
	}
	withCommentForm(userName) {
		let guestBook = this.addComments();
		guestBook = this.addCommentForm(guestBook, userName);
		return guestBook.replace('#message#', '');
	}
	afterLogIn(userName) {
		let guestBook = this.addComments();
		guestBook = this.addCommentForm(guestBook, userName);
		return guestBook.replace('#message#', partialHtmls.logInMsg);
	}
	afterLogOut() {
		let guestBook = this.addComments();
		guestBook = this.addLogInForm(guestBook);
		return guestBook.replace('#message#', partialHtmls.logOutMsg);
	}
};

module.exports = GuestBook;