const disappear = function(){
	const jar = document.getElementById("jar");
	jar.style.visibility = "hidden";
	setTimeout(function(){
		jar.style.visibility = "visible";
	},1000);
};