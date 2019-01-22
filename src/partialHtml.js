const partialHtmls =
{
	logInForm: `
<h2 style="margin-left:20px;">Login to comment</h2>
<form action="/login" method="POST" style="padding:10px; margin-left: 30px;">
Name:
<input type="text" name="name" required>
<input type="submit" value="Login" style="background-color: aliceblue" >
</form>
<br><br>`,

	commentForm: function (name) {
		return `
	<h2 style="margin-left:20px;">Leave a comment</h2>
	<form action="/logOut" method="POST" style="padding:10px; margin-left: 30px;">
		Name: ${name}
		<input type="submit" value="Logout" style="background-color: aliceblue" >
		</form>
		<form action="/guestBook.html" method="POST" style="padding:10px; margin-left: 30px;">
		Comment:
		<textarea type="text" name="comment" style="width:150px; height:8"></textarea>
		<br><br>
		<input type="submit" value="Submit" style="background-color: aliceblue" >
	</form>`
	},

	logInMsg:
	`<p style="padding:10px; margin-left: 15px; color:green;"><b>you have been logged in successfully!!</b></p>`,

	logOutMsg:
	`<p style="padding:10px; margin-left: 15px; color:green;"><b>you have been logged out successfully!!</b></p>`
}

module.exports = partialHtmls;