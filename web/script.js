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
let currentX = 0;
let currentY = 0;
let isPreviewing = false;

// Mouse Events
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    drawing = true;
    isPreviewing = false;
    saveState(undoStack);
    redoStack = [];

    if (tool === "shape") {
        isPreviewing = true;
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (tool === "shape" && isPreviewing) {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        drawShape(startX, startY, endX, endY);
    }
    drawing = false;
    isPreviewing = false;
    ctx.beginPath();
});

canvas.addEventListener("mouseout", () => {
    drawing = false;
    isPreviewing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;

    if (tool === "draw" || tool === "erase") {
        draw(e);
    } else if (tool === "shape" && drawing && isPreviewing) {
        restorePreview();
        drawShape(startX, startY, currentX, currentY, true);
    }
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

function drawShape(x1, y1, x2, y2, preview = false) {
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

    if (!preview) ctx.beginPath();
}

function restorePreview() {
    const lastState = undoStack[undoStack.length - 1];
    if (!lastState) return;
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = lastState;
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

function changeCanvasSize(size) {
    // Save current canvas state
    saveState(undoStack);
    redoStack = [];

    let width, height;
    switch (size) {
        case "A4":
            width = 794;
            height = 1123;
            break;
        case "A3":
            width = 1123;
            height = 1587;
            break;
        case "A2":
            width = 1587;
            height = 2245;
            break;
        case "A1":
            width = 2245;
            height = 3179;
            break;
        default:
            width = 800;
            height = 500;
    }

    // Preserve current image
    const oldImage = new Image();
    oldImage.src = canvas.toDataURL();
    oldImage.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(oldImage, 0, 0);
    };
}

new QWebChannel(qt.webChannelTransport, function(channel) {
    backend = channel.objects.backend;
});
