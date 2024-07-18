const fileInput = document.getElementById("fileInput");
const backgroundInput = document.getElementById("backgroundInput");

const canvas = document.getElementById("canvas");
const canvasBack = document.getElementById("canvasBack");
const canvasphoto = document.getElementById("canvasphoto");
const newcanvas = document.getElementById("newcanvas");
const ctx = canvas.getContext("2d");
const ctxBack = canvasBack.getContext("2d");
const ctxPhoto = canvasphoto.getContext("2d");
const ctxnew = newcanvas.getContext("2d");
const eraseButton = document.getElementById("eraseBtn");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const eraserSizeInput = document.getElementById("eraseSize");
const restoreSizeInput = document.getElementById("restoreSize");

let erasedrawing = false;
let restoredrawing = false;
let iniputSize = eraserSizeInput.value;
let x = 0;
let y = 0;
let drawColor = "#000000";
let drawWidth = 5;
let history = [];
let redoStack = [];
let scale = 1;
let scaleX, scaleY;
var photoURl = "";
var prephotoUrl = "";
var backgroundimgUrl = "";
var removeurl = "";
var blursize = 0;
var colorName = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Gray",
    "Cyan",
    "Magenta",
    "Maroon",
    "Olive",
    "Lime",
    "Navy",
    "Teal",
    "Silver",
    "Gold",
    "Beige",
    "Coral",
    "Aqua",
    "Indigo",
    "Violet",
    "Crimson",
    "Turquoise",
    "Salmon",
    "Plum",
    "Khaki",
];

function zoomIn() {
    scale += 0.1;
    applyZoom();
}

function zoomOut() {
    scale -= 0.1;
    applyZoom();
}

function applyZoom() {
    canvas.style.transform = `scale(${scale})`;
    canvasBack.style.transform = `scale(${scale})`;
}

function blurimage(blur) {
    blursize = blur;
    // const aa = blur.split("/")
    // if()
    getImageUrl(backgroundimgUrl);
}

function backgroundblur() {
    ctxBack.filter = `blur(${blursize}px)`;
    ctxBack.drawImage(canvasBack, 0, 0);
    ctxBack.filter = "none";
}

function removeBackground() {
    fileInput.click();
}

function imageChange() {
    const preview = document.getElementById("b_preview");
    var file = fileInput.files[0];

    if (fileInput.files[0]) {
        document.getElementById("home_content").classList.add("hidden");
        document.getElementById("img_content").classList.remove("hidden");

        var formData = new FormData();
        formData.append("image_file", file);
        fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    // "X-Api-Key": "EUxiqEScPmMNJy86Zn8EUa5o",
                    // "X-Api-Key": "8UvDuz97hr15MGsPGKfkadNS",
                    // "X-Api-Key": "ikotWu1KRfNmsVrTKgEo6C6z",
                    // "X-Api-Key": "nf5b2tsteimAX9T3oVkS9wwR",
                    "X-Api-Key": "oqjR9dMxST4vcjrSTuYbnwet",
                },
                body: formData,
            })
            .then((response) => response.blob())
            .then((blob) => {
                var url = URL.createObjectURL(blob);
                var resultDiv = document.getElementById("a_preview");
                resultDiv.innerHTML += `<img src="${url}" alt="Image Preview" class="w-100" style="height: 400px">`;
                removeurl = url;

                prephotoImg();
                ctxBack.fillStyle = "white";
                ctxBack.fillRect(0, 0, canvasBack.width, canvasBack.height);
                photoURl = url;
                const img = new Image();
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    saveState();
                };
                img.src = url;

                // Create download link
                // var link = document.createElement("a");
                // link.href = url;
                // link.download = "background_removed.png";
                // var span = document.createElement("span");
                // span.innerHTML = "Download <i class='fa fa-download'></i>";
                // link.appendChild(span);
                // resultDiv.appendChild(link);
            })
            .catch((error) => {
                console.error(error);
            });

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Image Preview" class="w-100" style="height: 400px">`;
            prephotoUrl = e.target.result;

            // const img = new Image();
            // img.onload = function () {
            //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            //   // saveState();
            // };
            // img.src = e.target.result;
            // photoURl = e.target.result;

            // prephotoImg();
            // ctxBack.fillStyle = white;
            // ctxBack.fillRect(0, 0, canvasBack.width, canvasBack.height);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert("Please select a file first.");
    }
}
const blurselect = document.getElementById("blur_image");

function Editpreview() {
    const imgselect = document.getElementById("img_select_content");
    const colorselect = document.getElementById("color_select_content");

    imgselect.innerHTML = `<div style="width: 20%; cursor: pointer;" class="d-flex justify-content-center align-items-center"><i class="fa-solid fa-upload" style="font-size: 30px" onclick="backgroundupload()"></i></div>`;
    for (i = 0; i < 27; i++) {
        imgselect.innerHTML += `<img src="./pictures/${
      i + 1
    }.jpg"  class="select-img" alt="Image Select" style="cursor: pointer;" onclick="getImageUrl('./pictures/${
      i + 1
    }.jpg')">`;
    }

    colorselect.innerHTML = `<div style="width: 20%; cursor: pointer;" class="d-flex justify-content-center align-items-center"><i class="fa-solid fa-upload" style="font-size: 30px"></i></div>`;
    colorName.forEach((name) => {
        colorselect.innerHTML += `<div class="select-color" style="background-color: ${name};" onclick="getColorUrl('${name}')"></div>`;
    });

    blurselect.innerHTML = "";
    for (i = 9; i > -1; i -= 3) {
        blurselect.innerHTML += `<img src="./pictures/1.jpg" alt="Image Select" class="select-img" style="filter: blur(${i}px)" onclick="blurimage('${i}')">`;
    }
}

function backgroundupload() {
    backgroundInput.click();
}

function backgroundChange() {
    const preview = document.getElementById("b_preview");
    var backfile = backgroundInput.files[0];
    if (backfile) {
        const readers = new FileReader();
        readers.onload = function(e) {
            const backurl = e.target.result
            getImageUrl(backurl)

            // const img = new Image();
            // img.onload = function () {
            //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // };
            // img.src = e.target.result;
            // photoURl = e.target.result;
        };
        readers.readAsDataURL(backgroundInput.files[0]);
    } else {
        alert("Please select a file first.");
    }
}

function newCanvasImg() {
    const newimg = new Image();
    newimg.onload = function() {
        ctx.drawImage(newimg, 0, 0, canvas.width, canvas.height);
        saveState();
    };
    newimg.src = photoURl;
}

function prephotoImg() {
    const preimg = new Image();
    preimg.onload = function() {
        ctxPhoto.drawImage(preimg, 0, 0, canvasphoto.width, canvasphoto.height);
        saveState();
    };
    preimg.src = prephotoUrl;
}

function getImageUrl(imageUrl) {
    const blurselect = document.getElementById("blur_image");
    blurselect.innerHTML = "";
    for (i = 9; i > -1; i -= 3) {
        blurselect.innerHTML += `<img src="${imageUrl}" alt="Image Select" class="select-img" style="filter: blur(${i}px)" onclick="blurimage('${i}')">`;
    }
    const backgroundimg = new Image();
    backgroundimg.onload = function() {
        ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
        prephotoImg();
        ctxBack.drawImage(backgroundimg, 0, 0, canvasBack.width, canvasBack.height);
        backgroundblur();
        saveState();
    };
    // newCanvasImg();
    backgroundimg.src = imageUrl;
    backgroundimgUrl = imageUrl;
}

function getColorUrl(colorname) {
    ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
    prephotoImg();
    ctxBack.fillStyle = colorname;
    ctxBack.fillRect(0, 0, canvasBack.width, canvasBack.height);
    backgroundblur();
    backgroundimgUrl = colorname;
    // newCanvasImg();
}

function SizeInput(size) {
    size.addEventListener("input", (event) => {
        iniputSize = event.target.value;
    });
}

function erase() {
    paintErase();
}

function paintErase() {
    // SizeInput(eraserSizeInput);
    // // erasedrawing = false;
    // restoredrawing = false;
    // canvas.addEventListener("mousedown", () => {
    //   erasedrawing = true;
    //   ctx.beginPath();
    //   saveState();
    //   redoStack = [];
    // });

    // canvas.addEventListener("mousemove", (event) => {
    //   if (!erasedrawing) return;
    //   ctx.lineWidth = iniputSize;
    //   const rect = canvas.getBoundingClientRect();
    //   const x = ((event.clientX - rect.left) * 800) / rect.width;
    //   const y = ((event.clientY - rect.top) * 600) / rect.height;
    //   ctx.clearRect(
    //     x - iniputSize / 2,
    //     y - iniputSize / 2,
    //     iniputSize,
    //     iniputSize
    //   );
    // });

    // canvas.addEventListener("mouseup", () => {
    //   erasedrawing = false;
    //   ctx.closePath();
    //   saveState();
    // });

    // undoButton.addEventListener("click", () => {
    //   if (history.length > 1) {
    //     redoStack.push(history.pop());
    //     const lastState = history[history.length - 1];
    //     const img = new Image();
    //     img.src = lastState;
    //     img.onload = () => {
    //       ctx.clearRect(0, 0, canvas.width, canvas.height);
    //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //     };
    //   }
    // });

    // redoButton.addEventListener("click", () => {
    //   if (redoStack.length > 0) {
    //     const redoState = redoStack.pop();
    //     history.push(redoState);
    //     const img = new Image();
    //     img.src = redoState;
    //     img.onload = () => {
    //       ctx.clearRect(0, 0, canvas.width, canvas.height);
    //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //     };
    //   }
    // });

    // function saveState() {
    //   const currentState = canvas.toDataURL();
    //   history.push(currentState);
    // }

    /////////////////////////////

    erasedrawing = false;
    // restoredrawing = true;
    SizeInput(eraserSizeInput);

    newcanvas.addEventListener("mousedown", () => {
        restoredrawing = true;
        ctxnew.beginPath();
        saveState();
        redoStack = [];
    });

    newcanvas.addEventListener("mouseup", () => {
        restoredrawing = false;
        ctxnew.closePath();
        saveState();
    });

    newcanvas.addEventListener("mousemove", (event) => {
        if (!restoredrawing) return;
        ctxnew.lineWidth = iniputSize;
        const rect = newcanvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) * 800) / rect.width;
        const y = ((event.clientY - rect.top) * 600) / rect.height;

        ctxnew.globalCompositeOperation = "source-over";
        const image = new Image();
        // image.src = prephotoUrl;
        // image.src = removeurl;
        image.src = backgroundimgUrl;

        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;

        scaleX = newcanvas.width / imgWidth;
        scaleY = newcanvas.height / imgHeight;
        // ctxnewBack.filter = `blur(${blursize}px)`;
        // ctxnewBack.drawImage(canvasBack, 0, 0);
        ctxnew.drawImage(
            image,
            (x - (iniputSize / 2) * scaleX) / scaleX,
            // x - iniputSize / 2,
            (y - (iniputSize / 2) * scaleY) / scaleY,
            // y - iniputSize / 2,
            iniputSize,
            iniputSize,
            x - iniputSize / 2,
            y - iniputSize / 2,
            iniputSize,
            iniputSize
        );
        // saveState();
    });
    // function saveState() {
    //   const currentState = canvas.toDataURL();
    //   history.push(currentState);
    // }
}

function restore() {
    // erasedrawing = false;
    // // restoredrawing = true;
    // SizeInput(restoreSizeInput);

    // canvas.addEventListener("mousedown", () => {
    //   restoredrawing = true;
    //   ctx.beginPath();
    // saveState();
    //   redoStack = [];
    // });

    // canvas.addEventListener("mouseup", () => {
    //   restoredrawing = false;
    //   ctx.closePath();
    // saveState();
    // });

    // canvas.addEventListener("mousemove", (event) => {
    //   if (!restoredrawing) return;
    //   ctx.lineWidth = iniputSize;
    //   const rect = canvas.getBoundingClientRect();
    //   const x = ((event.clientX - rect.left) * 800) / rect.width;
    //   const y = ((event.clientY - rect.top) * 600) / rect.height;

    //   ctx.globalCompositeOperation = "source-over";
    //   const image = new Image();
    //   // image.src = prephotoUrl;
    //   // image.src = removeurl;
    //   image.src = backgroundimgUrl;

    //   const imgWidth = image.naturalWidth;
    //   const imgHeight = image.naturalHeight;

    //   scaleX = canvas.width / imgWidth;
    //   scaleY = canvas.height / imgHeight;

    //   ctx.drawImage(
    //     image,
    //     // (x - (iniputSize / 2) * scaleX) / scaleX,
    //     x - iniputSize / 2,
    //     // (y - (iniputSize / 2) * scaleY) / scaleY,
    //     y - iniputSize / 2,
    //     iniputSize,
    //     iniputSize,
    //     x - iniputSize / 2,
    //     y - iniputSize / 2,
    //     iniputSize,
    //     iniputSize
    //   );
    //   // console.log(x, y, 20);
    // });
    // function saveState() {
    //   const currentState = canvas.toDataURL();
    //   history.push(currentState);
    // }

    ///////////////////////////////////////////////

    SizeInput(restoreSizeInput);
    // erasedrawing = false;
    restoredrawing = false;
    newcanvas.addEventListener("mousedown", () => {
        erasedrawing = true;
        ctxnew.beginPath();
        saveState();
        redoStack = [];
    });

    newcanvas.addEventListener("mousemove", (event) => {
        if (!erasedrawing) return;
        ctxnew.lineWidth = iniputSize;
        ctxBack.lineWidth = iniputSize;
        const rect = newcanvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) * 800) / rect.width;
        const y = ((event.clientY - rect.top) * 600) / rect.height;
        ctxnew.clearRect(
            x - iniputSize / 2,
            y - iniputSize / 2,
            iniputSize,
            iniputSize
        );
        ctxBack.clearRect(
            x - iniputSize / 2,
            y - iniputSize / 2,
            iniputSize,
            iniputSize
        );
        // saveState();
    });

    newcanvas.addEventListener("mouseup", () => {
        erasedrawing = false;
        ctxnew.closePath();
        saveState();
    });

    undoButton.addEventListener("click", () => {
        if (history.length > 1) {
            redoStack.push(history.pop());
            const lastState = history[history.length - 1];
            const img = new Image();
            img.src = lastState;
            img.onload = () => {
                ctxnew.clearRect(0, 0, newcanvas.width, newcanvas.height);
                ctxnew.drawImage(img, 0, 0, newcanvas.width, newcanvas.height);
            };
        }
    });

    redoButton.addEventListener("click", () => {
        if (redoStack.length > 0) {
            const redoState = redoStack.pop();
            history.push(redoState);
            const img = new Image();
            img.src = redoState;
            img.onload = () => {
                ctxnew.clearRect(0, 0, newcanvas.width, newcanvas.height);
                ctxnew.drawImage(img, 0, 0, newcanvas.width, newcanvas.height);
            };
        }
    });

    // function saveState() {
    //   const currentState = canvas.toDataURL();
    //   history.push(currentState);
    // }
}

function saveState() {
    const currentState = canvas.toDataURL();
    history.push(currentState);
}