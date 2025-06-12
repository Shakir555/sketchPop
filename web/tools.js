// Undo and Redo
let undoStack = [];
let redoStack = [];
const undo_redo_stackSize = 20;

// Canvas Size
let canvas_width;
let canvas_height;

// Save current drawing state
function saveState(stack)
{
    if (stack.length >= undo_redo_stackSize)
    {
        stack.shift();
    }
    stack.push(canvas.toDataURL());
}

// Restore drawing state
function restoreState(stackFrom, stackTo)
{
    if (stackFrom.length === 0)
    {
        return;
    }
    saveState(stackTo);
    const imgData = stackFrom.pop();
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = imgData;
}

// Undo function
function undo()
{
    restoreState(undoStack, redoStack);
}

// Redo function
function redo()
{
    restoreState(redoStack, undoStack);
}

// Clean the canvas
function clearCanvas()
{
    saveState(undoStack);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}

// Save Image
function saveImage()
{
    const dataURL = canvas.toDataURL("image/png");
    if (backend && backend.saveImage)
    {
        backend.saveImage(dataURL);
        alert("Image saved to home folder as miniPaint_saved.png!");
    }
    else
    {
        alert("backend not ready");
    }
}

// Switch Canvas Size
function changeCanvasSize(canvas_size)
{
    saveState(undoStack);
    redoStack = [];

    switch(canvas_size)
    {
        case "A4":
            canvas_width = 784;
            canvas_height = 1123;
            break;
        case "A3":
            canvas_width = 1123;
            canvas_height = 1587;
            break;
        case "A2":
            canvas_width = 1587;
            canvas_height = 2245;
            break;
        case "A1":
            canvas_width = 2245;
            canvas_height = 3179;
            break;
        default:
            canvas_width = 800;
            canvas_height = 500;
    }

    const oldImage = new Image();
    oldImage.src = canvas.toDataURL();
    oldImage.onload = () => {
        canvas.canvas_width = canvas_width;
        canvas.canvas_height = canvas_height;
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        ctx.drawImage(oldImage, 0, 0);
    };
}

