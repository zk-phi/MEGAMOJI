/*
 * An effect takes a 2d rendering context and makes modifications to it.
 * These functions are called just before rendering an animation frame.
 * Note that users can enable multiple effects at the same time.
 *
 * [arguments]
 * - keyframe   ... a 0.0 - 1.0 progress of the animation
 * - ctx        ... the rendering context to be modified
 * - cellWidth  ... width of the image to be rendered
 * - cellHeight ... height of the image to be rendered
 * - background ... hex notation of the background color
 */

function effectKira (keyframe, ctx, cellWidth, cellHeight, background) {
    var currentFilter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = currentFilter + "saturate(1000%) hue-rotate(" + (keyframe * 360) + "deg)";
}

function effectNega (keyframe, ctx, cellWidth, cellHeight, background) {
    var currentFilter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = currentFilter + "invert(" + Math.floor(50 + 50 * Math.sin(2 * Math.PI * keyframe)) + "%)";
}

function effectMoyamoya (keyframe, ctx, cellWidth, cellHeight, background) {
    var currentFilter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = currentFilter + "blur(" + (2 + Math.abs(1 * Math.cos(2 * Math.PI * keyframe))) + "px)";
}

function effectFoil (keyframe, ctx, cellWidth, cellHeight, background) {
    var currentFilter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = currentFilter + "brightness(" + (120 + Math.floor(20 * Math.sin(2 * Math.PI * keyframe))) + "%)";
}

function effectBlink (keyframe, ctx, cellWidth, cellHeight, background) {
    if (keyframe >= 0.5) {
        ctx.translate(- cellWidth * 2, 0); /* hide */
    }
}

function effectPyon (keyframe, ctx, cellWidth, cellHeight, background) {
    var resistance = 1.7; // バウンド時の強さ
    var y
    if(keyframe > 0.7) {
        y = - Math.abs(Math.cos(2 * Math.PI * keyframe)) * (cellHeight / 6)
    } else {
        y = - Math.abs(Math.cos(2 * Math.PI * keyframe)) * (cellHeight / 6) * Math.exp(-keyframe * resistance)
    }
    ctx.transform(1, 0, 0, 1, 0, y + cellHeight / 30);
}

function effectShadow (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = 7;
    ctx.shadowOffsetX = 7;
}

function effectNaturalBlur (keyframe, ctx, cellWidth, cellHeight, background) {
    var HSVColor = _HSV2RGB(0, 0, keyframe)
    ctx.shadowColor = `rgb(${HSVColor[0]}, ${HSVColor[1]}, ${HSVColor[2]})`;
    ctx.shadowBlur = 50*keyframe;
}

function effectNeon (keyframe, ctx, cellWidth, cellHeight, background) {
    var HSVColor = _HSV2RGB(keyframe*360*4%360, 1, 1)
    ctx.shadowColor = `rgb(${HSVColor[0]}, ${HSVColor[1]}, ${HSVColor[2]})`;
    ctx.shadowBlur = 10;
}

function effectAuroraBlur (keyframe, ctx, cellWidth, cellHeight, background) {
    var HSVColor = _HSV2RGB(keyframe*360, 1, 1)
    ctx.shadowColor = `rgb(${HSVColor[0]}, ${HSVColor[1]}, ${HSVColor[2]})`;
    ctx.shadowBlur = 50*keyframe;
}

function effectShadowRotate (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe)*5;
    ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe)*5;
}

function effectPatapata (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.transform(Math.cos(2 * Math.PI * keyframe), 0, 0, 1, cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0);
}

function effectSidetoside (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.transform(1, 0, 0, 1, cellWidth * Math.sin(2 * Math.PI * keyframe) / 2, 0);
}

function effectRotate (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(Math.PI * 2 * keyframe);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
}

function effectKurukuru (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.translate(
        Math.cos(Math.PI * 2 * keyframe) * 0.05 * cellWidth,
        Math.sin(Math.PI * 2 * keyframe) * 0.05 * cellHeight,
    );
}

var lastGata = false;
function effectGatagata (keyframe, ctx, cellWidth, cellHeight, background) {
    lastGata = !lastGata;
    ctx.translate(cellWidth / 2 + (Math.random() - 0.5) * 4, cellHeight / 2 + (Math.random() - 0.5) * 4);
    ctx.rotate(lastGata ? -0.05 : 0.05);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
}

function effectYatta (keyframe, ctx, cellWidth, cellHeight, background) {
    if (keyframe >= 0.5) {
        _flipContext(ctx, cellWidth);
    }
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(0.1);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
    ctx.translate(0, cellHeight / 16 * Math.sin(8 * Math.PI * keyframe));
}

function effectPoyon (keyframe, ctx, cellWidth, cellHeight, background) {
    if (keyframe < 0.6) {
        ctx.translate(0, - cellHeight / 6 * Math.sin(Math.PI * keyframe / 0.6));
    } else {
        var ratio = Math.sin(Math.PI * (keyframe - 0.6) / 0.4) / 2;
        ctx.transform(1 + ratio, 0, 0, 1 - ratio, - ratio * cellWidth / 2, ratio * cellHeight * 3 / 4);
    }
}

function effectMotimoti (keyframe, ctx, cellWidth, cellHeight, background) {
    var ratio = Math.sin(Math.PI * Math.abs(keyframe - 0.5) / 0.5) / 4;
    ctx.transform(1 + ratio, 0, 0, 1 - ratio, - ratio * cellWidth / 2, ratio * cellHeight * 3 / 4);
}

function effectYurayura (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.translate(cellWidth / 2, cellHeight * 3 / 4);
    ctx.rotate(Math.PI * Math.abs(keyframe - 0.5) / 2 - Math.PI / 8);
    ctx.translate(- cellWidth / 2, - cellHeight * 3 / 4);
}

function effectZoom (keyframe, ctx, cellWidth, cellHeight, background) {
    var zoom = Math.abs(keyframe - 0.5) * 2 - 0.5;
    ctx.transform(1 + zoom, 0, 0, 1 + zoom, - cellWidth / 2 * zoom, - cellHeight / 2 * zoom);
}

function effectTiritiri (keyframe, ctx, cellWidth, cellHeight, background) {
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            data[(row * cellWidth + col) * 4 + 3] = parseInt(255 * Math.random());
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectStripe (keyframe, ctx, cellWidth, cellHeight, background) {
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if (col % 3 === 1)  {
                data[(row * cellWidth + col) * 4 + 3] = 0;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectRiver (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = _hex2HSV(background);
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < (cellHeight * cellWidth * 4); row = row + 4) {
        if ((row / 4 + (keyframe * 40)) % 40 < 40 && (row / 4 + (keyframe * 40)) % 40 > 20) {
            var color = _HSV2RGB(bgColorHSV["h"] + 180, 1, 1);
            data[row] = color[0];
            data[row + 1] = color[1];
            data[row + 2] = color[2];
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectSignPole (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = _hex2HSV(background);
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if ((row + col + (keyframe * 40)) % 40 < 40 && (row + col + (keyframe * 40)) % 40 > 20) {
                var color = _HSV2RGB(bgColorHSV["h"] + 180, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectPsych (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = _hex2HSV(background);
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if (row % 10 <= 5 && col % 10 >= 5) {
                var color = _HSV2RGB((keyframe * 360 * 4 + 180) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else if (row % 10 < 5 ^ col % 10 < 5) {
                var color = _HSV2RGB((keyframe * 360 * 4 + 90) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else {
                var color = _HSV2RGB((keyframe * 360 * 4) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectCheck (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = _hex2HSV(background);
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if (row % 16 <= 8 && col % 16 >= 8) {
                var color = _HSV2RGB(bgColorHSV['h'], 1, 0.8);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else if (row % 16 < 8 ^ col % 16 < 8) {
                var color = _HSV2RGB(bgColorHSV['h'], 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else {
                var color = _HSV2RGB(bgColorHSV['h'], 1, 0.5);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectTimemachine (keyframe, ctx, cellWidth, cellHeight, background) {
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < (cellHeight * cellWidth * 4); row = row + 4) {
        if ((row / 4) % 40 < 40 * keyframe) {
            var color = _HSV2RGB(keyframe * 360 * 4 % 360 + 180, 1, 1);
            data[row] = color[0];
            data[row + 1] = color[1];
            data[row + 2] = color[2];
            data[row + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectDizzy (keyframe, ctx, cellWidth, cellHeight, background) {
    var imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = imageData.data;
    for (var row = 0; row < (cellHeight * cellWidth * 4); row = row + 4) {
        if ((row / 4+(keyframe * 40)) % 40 < 40 && (row / 4 + (keyframe * 40)) % 40 > 20) {
            var color = _HSV2RGB(keyframe * 360 * 4 % 360 + 180, 1, 1);
            data[row] = color[0];
            data[row + 1] = color[1];
            data[row + 2] = color[2];
            data[row + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
