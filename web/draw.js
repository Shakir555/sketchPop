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
