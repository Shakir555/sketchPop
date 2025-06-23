let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let backend;

    new QWebChannel(qt.webChannelTransport, function(channel) {
        backend = channel.objects.backend;
    });