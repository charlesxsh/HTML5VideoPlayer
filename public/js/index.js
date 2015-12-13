var url;
var f; //video file

window.onload = function() {

    var socket = io();
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
            var stream = ss.createStream();
            // upload a file to the server. 
            ss(socket).emit('video', stream, {size: f.size, name: f.name});
            var blobStream = ss.createBlobReadStream(f);

            //track progress
            var size = 0;
            blobStream.on('data', function(chunk) {
                size += chunk.length;
                console.log(Math.floor(size / f.size * 100) + '%');
            });

            blobStream.pipe(stream);
        }
    });
}
