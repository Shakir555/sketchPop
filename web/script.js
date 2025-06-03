let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawing = false;
let tool = "draw";
let backend;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener("mouseout", () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = document.getElementById("sizePicker").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = tool === "erase" ? "#ffffff" : document.getElementById("colorPicker").value;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function setTool(selectedTool) {
    tool = selectedTool;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}

function saveImage() {
    const dataURL = canvas.toDataURL("image/png");
    if (backend && backend.saveImage) {
        backend.saveImage(dataURL);
        alert("Image saved to your home folder as miniPaint_saved.png!");
    } else {
        alert("Backend not ready!");
    }
}

new QWebChannel(qt.webChannelTransport, function(channel) {
    backend = channel.objects.backend;
});
