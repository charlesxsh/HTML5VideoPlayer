function handleBullet(socket){

	var cnt = 0;
	socket.onBullet(function (msg) {
		cnt++;
		var comment = bullet.comment;
		var time = bullet.time;
		});

	$('section').append("
		"<div id='bullet'" + cnt + " class='bulletdiv'>"
		");

	$('.bulletdiv').css({
		"width": "100px",
	    "height": "50px",
	    "font-weight": "bold",
	    "position": "relative",
	    "animation": "mymove 5s"
	});


    setTimeout(function() {
        var div2 = document.querySelector('#div2');
      div1.hidden = true;
    }, 5000);
}
