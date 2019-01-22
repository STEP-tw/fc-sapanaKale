const partialHtmls = require('./partialHtml');

class GuestBook {
	constructor(guestBookTemplate) {
		this.guestBook = guestBookTemplate;
	}
	addLogInForm(guestBook) {
		return guestBook.replace('#form#', partialHtmls.logInForm);
	}
	addCommentForm(guestBook, userName) {
		return guestBook.replace('#form#', partialHtmls.commentForm(userName))
	}
	withLogInForm() {
		return this.addLogInForm(this.guestBook);
	}
	withCommentForm(userName) {
		return this.addCommentForm(this.guestBook, userName);
	}
};

module.exports = GuestBook;