let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawing = false;
let tool = "draw";
let backend;

// Undo/Redo Stacks
let undoStack = [];
let redoStack = [];
const maxStackSize = 20;

// Shape tool variables
let startX = 0;
let startY = 0;

// Mouse Events
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    drawing = true;
    saveState(undoStack);
    redoStack = [];
});

canvas.addEventListener("mouseup", (e) => {
    if (tool === "shape") {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        drawShape(startX, startY, endX, endY);
    }
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mouseout", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
    if (tool !== "draw" && tool !== "erase") return;
    draw(e);
});

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

function drawShape(x1, y1, x2, y2) {
    const shape = document.getElementById("shapeType").value;
    const angle = parseFloat(document.getElementById("rotationInput").value || 0) * Math.PI / 180;
    const color = document.getElementById("colorPicker").value;
    const size = parseInt(document.getElementById("sizePicker").value);

    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.lineWidth = size;
    ctx.strokeStyle = color;

    ctx.beginPath();
    switch (shape) {
        case "rectangle":
            ctx.strokeRect(-w / 2, -h / 2, w, h);
            break;
        case "square":
            const side = Math.min(w, h);
            ctx.strokeRect(-side / 2, -side / 2, side, side);
            break;
        case "circle":
            ctx.arc(0, 0, Math.min(w, h) / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case "triangle":
            ctx.moveTo(0, -h / 2);
            ctx.lineTo(-w / 2, h / 2);
            ctx.lineTo(w / 2, h / 2);
            ctx.closePath();
            ctx.stroke();
            break;
    }
    ctx.restore();
}

function setTool(selectedTool) {
    tool = selectedTool;
}

function clearCanvas() {
    saveState(undoStack);
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
    if (stack.length >= maxStackSize) stack.shift();
    stack.push(canvas.toDataURL());
}

function restoreState(stackFrom, stackTo) {
    if (stackFrom.length === 0) return;
    saveState(stackTo);
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
