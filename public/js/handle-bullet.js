function handleBullet(socket){

	var cnt = 0;
	socket.onBullet(function (msg) {
		cnt++;
		var comment = msg.comment;
		var time = msg.time;
	// $('.bulletdiv').css({
	// 	"width": "100px",
	//     "height": "50px",
	//     "font-weight": "bold",
	//     "position": "absolute",
	//     "z-index":"2147483647",
	//     "top":"0"
	//     // "animation": "mymove 5s"
	// });
	var bullet = document.createElement("div");
	var parent = document.getElementById("playerarea");
	bullet.id = "bullet"+cnt;
	bullet.className += "bulletdiv";
	bullet.innerHTML = comment;
	parent.appendChild(bullet);

    setTimeout(function() {
        // var div2 = document.querySelector('#div2');
        
        parent.removeChild(bullet);
    }, 6000);
  


	// $('section').append(
	// 	"<div id='bullet'" + cnt + " class='bulletdiv'></div>");
	// $(".bulletdiv").show("slide",{direction:"left"}, 1000);

	// });


	// @keyframes mymove {
 //    from {left: 800px;}
 //    to {left: 0px;}
	// }
    // setTimeout(function() {
    //     var div = document.querySelector('.bulletdiv');
    // 	div.hidden = true;
    // }, 5000);
});

}
