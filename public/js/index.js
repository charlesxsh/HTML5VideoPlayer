window.onload = function() {

    var vp = new VideoPlayer(document.getElementById('playerarea'));

    document.getElementById('input_select_video').addEventListener('change', function(event) {
        var files = event.target.files; // FileList object
        var url;
        for (var i = 0, f; f = files[i]; i++) {
            console.log(f.name);
            url = URL.createObjectURL(f);
        }
        vp.loadSrc(url, "video/mp4");
        //TODO revoke
        URL.createObjectURL(url);
    });

    $('#select_video').click(function(){
        $('#input_select_video').click();
    });
}
