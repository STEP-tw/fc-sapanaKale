const partialHtmls =
{
	logInForm: `
<h2 style="margin-left:20px;">Login to comment</h2>
<form action="/logIn" method="POST" style="padding:10px; margin-left: 30px;">
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
		<div style="padding:10px; margin-left: 30px;">
		<form>
		Comment:
		<textarea type="text" id="comment" style="width:150px; height:8"></textarea>
		<br><br>
		</form>
		<button style="background-color: aliceblue" onclick="updateComments()">Submit</button>
		</div>`
	}
};

module.exports = partialHtmls;