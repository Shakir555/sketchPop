// Tool and Drawing
let tool = "draw";
let drawing = false;

// Shape Tool Variables
let shapeStartX = 0;
let shapeStartY = 0;
let shapeCurrentX = 0;
let shapeCurrentY = 0;
let shapeisPreview = false;

// Draw Events Mousedown
Canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    shapeStartX = e.clientX - rect.left;
    shapeStartY = e.clientY - rect.top;
    drawing = true;
    shapeisPreview = false;
    saveState(undoStack);
    redoStack = [];

    if (tool === "shape")
    {
        shapeisPreview = true;
    }
});

// Draw Events Mouseup
canvas.addEventListener("mouseup", (e) => {
    if (tool==="shape" && shapeisPreview)
    {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        drawShape(shapeStartX, shapeStartY, endX, endY);
    }
    drawing = false;
    shapeisPreview = false;
    ctx.beginPath();
});

// Draw Events Mouseout
canvas.addEventListener("mousedown", () => {
    drawing = false;
    isPreviewing = false;
    ctx.beginPath();
});

// Draw Events Mousemove
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    shapeCurrentX = e.clientX - rect.left;
    shapeCurrentY = e.clientY - rect.top;

    if (tool === "draw" || tool === "erase")
    {
        draw(e);
    }
    else if (tool === "shape" && drawing && shapeisPreview)
    {
        restorePreview();
        drawShape(shapeStartX, shapeStartY, shapeCurrentX, shapeCurrentY, true);
    }
});

function setTool(selectedTool)
{
    tool = selectedTool;
}