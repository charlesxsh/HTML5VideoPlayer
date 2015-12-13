var url;
var f; //video file

window.onload = function() {

    var socket = new Socket();
    var vp = new VideoPlayer(document.getElementById('playerarea'));

    document.getElementById('input_select_video').addEventListener('change', function(event) {
        f = event.target.files[0];
        if(f) {
            console.log(f.name);
            URL.revokeObjectURL(url);
            url = URL.createObjectURL(f);
            vp.loadSrc(url, "video/mp4");
        }
    });

    $('#select_video').click(function(){
        $('#input_select_video').click();
    });

    $('#creat_stream').click(function() {
        console.log(f);
        if(f) {
            console.log("try to stream " + f.name);
            socket.emitVideoStream(f);
        }
    });
}
