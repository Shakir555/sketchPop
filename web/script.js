let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawing = false;
let tool = "draw";
let backend;

// Undo/Redo Stacks
let undoStack = [];
let redoStack = [];
const maxStackSize = 20;

canvas.addEventListener("mousedown", () => {
    drawing = true;
    saveState(undoStack); // Save before drawing
    redoStack = [];       // Clear redo history on new draw
});
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
    saveState(undoStack); // Save before clearing
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

function saveState(stack) {
    if (stack.length >= maxStackSize) stack.shift(); // Limit stack size
    stack.push(canvas.toDataURL());
}

function restoreState(stackFrom, stackTo) {
    if (stackFrom.length === 0) return;
    saveState(stackTo); // Save current state to opposite stack
    const imgData = stackFrom.pop();
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = imgData;
}

function undo() {
    restoreState(undoStack, redoStack);
}

function redo() {
    restoreState(redoStack, undoStack);
}

new QWebChannel(qt.webChannelTransport, function(channel) {
    backend = channel.objects.backend;
});
