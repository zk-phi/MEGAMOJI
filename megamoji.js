var TEXT_CANVAS_SIZE    = 1500; /* a sufficiently large number */
var EMOJI_SIZE          = 128;
var ANIMATED_EMOJI_SIZE = 64;
var BINARY_SIZE_LIMIT   = 64000;

/* ---- FILTERS */

/*
 * A filter takes a source img object and returns a BlobURL of the filtered image.
 * Intended to be used as a preprocessor for input images.
 */

function filter_chromakey (image) {
    var canvas = document.createElement("canvas");
    var ctx    = canvas.getContext('2d');
    canvas.width  = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0);

    var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = image_data.data;
    var base_color = [data[0], data[1], data[2]];

    var queue = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1]
    ];

    while (queue.length) {
        var item = queue.shift();
        if (item[0] >= canvas.width || item[1] >= canvas.height || item[0] < 0 || item[1] < 0) {
            continue;
        }

        var ix = (item[1] * canvas.width + item[0]) * 4;
        if (!data[ix + 3]) continue;

        var norm = Math.hypot(
            data[ix] - base_color[0],
            data[ix + 1] - base_color[1],
            data[ix + 2] - base_color[2]
        );
        if (norm < 90) {
            data[ix + 3] = 0;
            queue.push(
                [item[0] - 1, item[1] - 1],
                [item[0],     item[1] - 1],
                [item[0] + 1, item[1] - 1],
                [item[0] - 1, item[1]],
                [item[0] + 1, item[1]],
                [item[0] - 1, item[1] + 1],
                [item[0],     item[1] + 1],
                [item[0] + 1, item[1] + 1]
            );
        }
    }

    ctx.putImageData(image_data, 0, 0);
    return canvas.toDataURL("image/png");
}

/* ---- EFFECTS */

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

function effect_kira (keyframe, ctx, cellWidth, cellHeight, background) {
    var current_filter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = current_filter + "saturate(1000%) hue-rotate(" + (keyframe * 360) + "deg)";
}

function effect_nega (keyframe, ctx, cellWidth, cellHeight, background) {
    var current_filter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = current_filter + "invert(" + Math.floor(50 + 50 * Math.sin(2 * Math.PI * keyframe)) + "%)";
}

function effect_moyamoya (keyframe, ctx, cellWidth, cellHeight, background) {
    var current_filter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = current_filter + "blur(" + (2 + Math.abs(1 * Math.cos(2 * Math.PI * keyframe))) + "px)";
}

function effect_foil (keyframe, ctx, cellWidth, cellHeight, background) {
    var current_filter = ctx.filter == "none" ? "" : ctx.filter + " ";
    ctx.filter = current_filter + "brightness(" + (120 + Math.floor(20 * Math.sin(2 * Math.PI * keyframe))) + "%)";
}

function effect_blink (keyframe, ctx, cellWidth, cellHeight, background) {
    if (keyframe >= 0.5) {
        ctx.translate(- cellWidth * 2, 0); /* hide */
    }
}

function effect_pyon (keyframe, ctx, cellWidth, cellHeight, background) {
    var resistance = 1.7; // バウンド時の強さ
    var y
    if(keyframe > 0.7) {
        y = - Math.abs(Math.cos(2 * Math.PI * keyframe)) * (cellHeight / 3)
    } else {
        y = - Math.abs(Math.cos(2 * Math.PI * keyframe)) * (cellHeight / 3) * Math.exp(-keyframe * resistance)
    }
    ctx.transform(1, 0, 0, 1, 0, y + cellHeight / 15);
}

function effect_shadow (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = 7;
    ctx.shadowOffsetX = 7;
}

function effect_natural_blur (keyframe, ctx, cellWidth, cellHeight, background) {
    var hsv_color = hsv_to_rgb(0, 0, keyframe)
    ctx.shadowColor = `rgb(${hsv_color[0]}, ${hsv_color[1]}, ${hsv_color[2]})`;
    ctx.shadowBlur = 50*keyframe;
}

function effect_neon(keyframe, ctx, cellWidth, cellHeight, background) {
    var hsv_color = hsv_to_rgb(keyframe*360*4%360, 1, 1)
    ctx.shadowColor = `rgb(${hsv_color[0]}, ${hsv_color[1]}, ${hsv_color[2]})`;
    ctx.shadowBlur = 10;
}

function effect_aurora_blur(keyframe, ctx, cellWidth, cellHeight, background) {
    var hsv_color = hsv_to_rgb(keyframe*360, 1, 1)
    ctx.shadowColor = `rgb(${hsv_color[0]}, ${hsv_color[1]}, ${hsv_color[2]})`;
    ctx.shadowBlur = 50*keyframe;
}

function effect_shadow_rotate (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe)*5;
    ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe)*5;
}

function effect_patapata (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.transform(Math.cos(2 * Math.PI * keyframe), 0, 0, 1, cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0);
}

function effect_sidetoside (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.transform(1, 0, 0, 1, cellWidth * Math.sin(2 * Math.PI * keyframe), 0);
}

function effect_rotate (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(Math.PI * 2 * keyframe);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
}

function effect_kurukuru (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.translate(
        Math.cos(Math.PI * 2 * keyframe) * 0.1 * cellWidth,
        Math.sin(Math.PI * 2 * keyframe) * 0.1 * cellHeight,
    );
}

var last_gata = false;
function effect_gatagata (keyframe, ctx, cellWidth, cellHeight, background) {
    last_gata = !last_gata;
    ctx.translate(cellWidth / 2 + (Math.random() - 0.5) * 4, cellHeight / 2 + (Math.random() - 0.5) * 4);
    ctx.rotate(last_gata ? -0.05 : 0.05);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
}

function effect_yatta (keyframe, ctx, cellWidth, cellHeight, background) {
    if (keyframe >= 0.5) {
        ctx.transform(-1, 0, 0, 1, cellWidth, 0);
    }
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(0.1);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
    ctx.translate(0, cellHeight / 8 * Math.sin(8 * Math.PI * keyframe));
}

function effect_poyon (keyframe, ctx, cellWidth, cellHeight, background) {
    if (keyframe < 0.6) {
        ctx.translate(0, - cellHeight / 3 * Math.sin(Math.PI * keyframe / 0.6));
    } else {
        var ratio = Math.sin(Math.PI * (keyframe - 0.6) / 0.4) / 2;
        ctx.transform(1 + ratio, 0, 0, 1 - ratio, - ratio * cellWidth / 2, ratio * cellHeight);
    }
}

function effect_motimoti (keyframe, ctx, cellWidth, cellHeight, background) {
    var ratio = Math.sin(Math.PI * Math.abs(keyframe - 0.5) / 0.5) / 4;
    ctx.transform(1 + ratio, 0, 0, 1 - ratio, - ratio * cellWidth / 2, ratio * cellHeight);
}

function effect_yurayura (keyframe, ctx, cellWidth, cellHeight, background) {
    ctx.translate(cellWidth / 2, cellHeight);
    ctx.rotate(Math.PI * Math.abs(keyframe - 0.5) / 2 - Math.PI / 8);
    ctx.translate(- cellWidth / 2, - cellHeight);
}

function effect_zoom (keyframe, ctx, cellWidth, cellHeight, background) {
    var zoom = Math.abs(keyframe - 0.5) * 2 - 0.5;
    ctx.transform(1 + zoom, 0, 0, 1 + zoom, - cellWidth / 2 * zoom, - cellHeight / 2 * zoom);
}

function effect_tiritiri (keyframe, ctx, cellWidth, cellHeight, background) {
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            data[(row * cellWidth + col) * 4 + 3] = parseInt(255 * Math.random());
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_stripe (keyframe, ctx, cellWidth, cellHeight, background) {
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if (col % 3 === 1)  {
                data[(row * cellWidth + col) * 4 + 3] = 0;
            }
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_river (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = hex_to_hsv(background);
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < (cellHeight * cellWidth * 4); row = row + 4) {
        if ((row / 4 + (keyframe * 40)) % 40 < 40 && (row / 4 + (keyframe * 40)) % 40 > 20) {
            var color = hsv_to_rgb(bgColorHSV["h"] + 180, 1, 1);
            data[row] = color[0];
            data[row + 1] = color[1];
            data[row + 2] = color[2];
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_sign_pole (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = hex_to_hsv(background);
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if ((row + col + (keyframe * 40)) % 40 < 40 && (row + col + (keyframe * 40)) % 40 > 20) {
                var color = hsv_to_rgb(bgColorHSV["h"] + 180, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
            }
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_psych (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = hex_to_hsv(background);
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if (row % 10 <= 5 && col % 10 >= 5) {
                var color = hsv_to_rgb((keyframe * 360 * 4 + 180) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else if (row % 10 < 5 ^ col % 10 < 5) {
                var color = hsv_to_rgb((keyframe * 360 * 4 + 90) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else {
                var color = hsv_to_rgb((keyframe * 360 * 4) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            }
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_check (keyframe, ctx, cellWidth, cellHeight, background) {
    var bgColorHSV = hex_to_hsv(background);
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < cellHeight; row++) {
        for (var col = 0; col < cellWidth; col++) {
            if (row % 16 <= 8 && col % 16 >= 8) {
                var color = hsv_to_rgb(bgColorHSV['h'], 1, 0.8);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else if (row % 16 < 8 ^ col % 16 < 8) {
                var color = hsv_to_rgb(bgColorHSV['h'], 1, 1);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else {
                var color = hsv_to_rgb(bgColorHSV['h'], 1, 0.5);
                data[(row * cellWidth + col) * 4] = color[0];
                data[(row * cellWidth + col) * 4 + 1] = color[1];
                data[(row * cellWidth + col) * 4 + 2] = color[2];
                data[(row * cellWidth + col) * 4 + 3] = 255;
            }
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_time_machine (keyframe, ctx, cellWidth, cellHeight, background) {
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < (cellHeight * cellWidth * 4); row = row + 4) {
        if ((row / 4) % 40 < 40 * keyframe) {
            var color = hsv_to_rgb(keyframe * 360 * 4 % 360 + 180, 1, 1);
            data[row] = color[0];
            data[row + 1] = color[1];
            data[row + 2] = color[2];
            data[row + 3] = 255;
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

function effect_dizzy (keyframe, ctx, cellWidth, cellHeight, background) {
    var image_data = ctx.getImageData(0, 0, cellWidth, cellHeight);
    var data = image_data.data;
    for (var row = 0; row < (cellHeight * cellWidth * 4); row = row + 4) {
        if ((row / 4+(keyframe * 40)) % 40 < 40 && (row / 4 + (keyframe * 40)) % 40 > 20) {
            var color = hsv_to_rgb(keyframe * 360 * 4 % 360 + 180, 1, 1);
            data[row] = color[0];
            data[row + 1] = color[1];
            data[row + 2] = color[2];
            data[row + 3] = 255;
        }
    }
    ctx.putImageData(image_data, 0, 0);
}

/* ---- ANIMATIONS */

/*
 * An animation is a function which actually renders each animation frames.
 *
 * [arguments]
 * - keyframe ... a 0.0 - 1.0 progress of the animation
 * - ctx      ... a (possively) effected 2d rendering context
 * - image    ... the source image to be rendered
 * - offsetH, offsetV, width, height ... range of the source image to be rendered
 * - cellWidth, cellHeight ... size of the image to be rendered
 */

function animation_ekken (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe < 0.5 ? 1 : (keyframe - 0.5) * 2;
    var size        = 1.0 * keyframe + 0.5 * (1 - keyframe);
    var ekkenOffset = cellWidth * keyframe;
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth * (1 - size) / 2, cellHeight * (1 - size) / 2, cellWidth * size, cellHeight * size);
    ctx.drawImage(image, offsetH, offsetV, width / 2, height, - ekkenOffset / 2, 0, cellWidth / 2, cellHeight);
    ctx.drawImage(image, offsetH + width / 2, offsetV, width / 2, height, cellWidth / 2 + ekkenOffset / 2, 0, cellWidth / 2, cellHeight);
}

function animation_ekken_vertical (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe < 0.5 ? 1 : (keyframe - 0.5) * 2;
    var size        = 1.0 * keyframe + 0.5 * (1 - keyframe);
    var ekkenOffset = cellWidth * keyframe;
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth * (1 - size) / 2, cellHeight * (1 - size) / 2, cellWidth * size, cellHeight * size);
    ctx.drawImage(image, offsetH, offsetV, width, height / 2, 0, - ekkenOffset / 2, cellWidth, cellHeight / 2);
    ctx.drawImage(image, offsetH, offsetV + height / 2, width, height / 2, 0, cellHeight / 2 + ekkenOffset / 2, cellWidth, cellHeight / 2);
}

function animation_kanpai (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    var size = 0.35 + 0.25 * Math.cos(2 * Math.PI * keyframe); /* 0 ~ 0.6 */
    flip_context(ctx, cellWidth);
    ctx.drawImage(image, offsetH, offsetV, width * size, height, cellWidth * (1 - size), 0, cellWidth * size, cellHeight);
    flip_context(ctx, cellWidth);
    ctx.drawImage(image, offsetH, offsetV, width * size, height, cellWidth * (1 - size), 0, cellWidth * size, cellHeight);
}

function animation_kanpai_lefty (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    var size = 0.35 + 0.25 * Math.cos(2 * Math.PI * keyframe); /* 0 ~ 0.6 */
    flip_context(ctx, cellWidth);
    ctx.drawImage(image, offsetH + width * (1 - size), offsetV, width * size, height, 0, 0, cellWidth * size, cellHeight);
    flip_context(ctx, cellWidth);
    ctx.drawImage(image, offsetH + width * (1 - size), offsetV, width * size, height, 0, 0, cellWidth * size, cellHeight);
}

function animation_scroll_horizontal (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    offsetH = (offsetH + image.naturalWidth * keyframe) % image.naturalWidth;
    ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, cellWidth, cellHeight);
    if (offsetH + width > image.naturalWidth) {
        ctx.drawImage(image, 0, offsetV, width, height, (image.naturalWidth - offsetH) * (cellWidth / width), 0, cellWidth, cellHeight);
    }
}

function animation_scroll_vertical (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    offsetV = (offsetV + image.naturalHeight * keyframe) % image.naturalHeight;
    ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, cellWidth, cellHeight);
    if (offsetV + height > image.naturalHeight) {
        ctx.drawImage(image, offsetH, 0, width, height, 0, (image.naturalHeight - offsetV) * (cellHeight / height), cellWidth, cellHeight);
    }
}

function animation_push_horizontal (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe > 0.75 ? (keyframe - 0.75) * 4 : 0;
    animation_scroll_horizontal(keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight);
}

function animation_push_vertical (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe > 0.75 ? (keyframe - 0.75) * 4 : 0;
    animation_scroll_vertical(keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight);
}

function animation_xile (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    for (var i = 0; i < 3; i++) {
        var x = Math.cos(Math.PI * 2 * (keyframe + i * 0.2)) * 0.3 * cellWidth;
        var y = Math.sin(Math.PI * 2 * (keyframe + i * 0.2)) * 0.3 * cellHeight;
        ctx.drawImage(image, offsetH, offsetV, width, height, x, y, cellWidth * 0.8, cellHeight * 0.8);
    }
}

/* ---- COLOR UTILS */

// taken from https://qiita.com/hachisukansw/items/633d1bf6baf008e82847
function hsv_to_rgb(H,S,V) {
    // see also: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

    var C = V * S;
    var Hp = H / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {[R,G,B]=[C,X,0]};
    if (1 <= Hp && Hp < 2) {[R,G,B]=[X,C,0]};
    if (2 <= Hp && Hp < 3) {[R,G,B]=[0,C,X]};
    if (3 <= Hp && Hp < 4) {[R,G,B]=[0,X,C]};
    if (4 <= Hp && Hp < 5) {[R,G,B]=[X,0,C]};
    if (5 <= Hp && Hp < 6) {[R,G,B]=[C,0,X]};

    var m = V - C;
    [R, G, B] = [R+m, G+m, B+m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return [R ,G, B];
}

// taken from https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function hex_to_hsv (hex) {
    var r = parseInt(hex.substring(1, 3), 16) / 255;
    var g = parseInt(hex.substring(3, 5), 16) / 255;
    var b = parseInt(hex.substring(5, 7), 16) / 255;

    var v     = Math.max(r, g, b);
    var vDiff = v - Math.min(r, g, b);

    var h, s;
    if (vDiff == 0) {
        h = s = 0;
    } else {
        s = vDiff / v;

        var rr = (v - r) / 6 / vDiff + 1 / 2;
        var gg = (v - g) / 6 / vDiff + 1 / 2;
        var bb = (v - b) / 6 / vDiff + 1 / 2;

        if (r === v) {
            h = bb - gg;
        } else if (g === v) {
            h = (1 / 3) + rr - bb;
        } else if (b === v) {
            h = (2 / 3) + gg - rr;
        }

        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

/* ---- CANVAS UTILS */

/* Create a new canvas and render specified region of the source canvas. */
function crop_canvas (source_canvas, left, top, w, h) {
    var canvas    = document.createElement("canvas");
    var ctx       = canvas.getContext('2d');
    canvas.width  = w;
    canvas.height = h;

    ctx.drawImage(source_canvas, left, top, w, h, 0, 0, w, h);

    return canvas;
}

/* Split canvas into a 2d-array of canvases */
function splitCanvasIntoCells (canvas, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight) {
    var cells = [];
    for (var y = 0; y < vCells; y++) {
        for (var x = 0, row = []; x < hCells; x++) {
            row.push(
                crop_canvas(
                    canvas,
                    offsetH + x * cellWidth, offsetV + y * cellHeight,
                    cellWidth, cellHeight
                )
            );
        }
        cells.push(row);
    }
    return cells;
}

/* Load a local image via specified path and call-back with the BlobURL of the loaded image. */
function load_file (path, callback) {
    var reader = new FileReader();
    reader.onload = function (e) { callback(e.target.result); };
    reader.readAsDataURL(path);
}

/* Create an img object, set src attr to the specified url, and return it. */
function url_to_image (url) {
    var img = document.createElement("img");
    img.src = url;
    return img;
}

/* flip a rendering context */
function flip_context (renderingContext2d, width) {
    renderingContext2d.translate(width, 0);
    renderingContext2d.scale(-1, 1);
}

/* compute binary size from a dataurl. return 0 if uncomputable. */
function dataurl_size (str) {
    var ix = str.indexOf(',');
    if (ix < 0) return 0;
    return Math.ceil((str.length - ix - 1) / 4.0 * 3);
}

/* ---- TEXT IMAGE GENERATOR */

/* Create a new canvas and render a single-line text. Returns the cropped canvas object. */
function line_image (line, color, font) {
    var canvas = document.createElement("canvas");
    canvas.width  = TEXT_CANVAS_SIZE;
    canvas.height = TEXT_CANVAS_SIZE;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle    = color;
    ctx.font         = font;
    ctx.textBaseline = "top";
    ctx.fillText(line, 0, 0);

    /* find topmost and bottommost non-transparent pixels */
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (var row = 0, top = -1, bottom = 0; row < canvas.height; row++) {
        for (var column = 0; column < canvas.width; column++) {
            if (data[(row * canvas.width + column) * 4 + 3]) {
                if (top == -1) top = row;
                bottom = row;
                break;
            }
        }
    }

    var width  = ctx.measureText(line).width;
    var height = bottom - top;

    return crop_canvas(canvas, 0, top, width, height);
}

/* Create an image from a (possibly) multi-line text and return as a BlobURL. */
function generate_text_image (text, color, font, align, line_spacing) {
    var images       = text.split("\n").map(function (line) { return line_image(line, color, font); });
    var line_widths  = images.map(function (canvas) { return canvas.width; })
    var max_width    = Math.max.apply(null, line_widths);
    var total_height = images.reduce(function (l, r) { return l + r.height; }, 0) + line_spacing * (images.length - 1);

    var canvas = document.createElement("canvas");
    canvas.width  = max_width;
    canvas.height = total_height;

    var ctx = canvas.getContext('2d');

    var current_height = 0;
    images.forEach(function (image, ix) {
        ctx.save();

        if (align == "right") {
            ctx.translate(max_width - line_widths[ix], 0)
        } else if (align == "center") {
            ctx.translate((max_width - line_widths[ix]) / 2, 0);
        } else if (align == "stretch") {
            ctx.transform(max_width / line_widths[ix], 0, 0, 1, 0, 0);
        }

        ctx.drawImage(image, 0, current_height);
        current_height += image.height + line_spacing;

        ctx.restore();
    });

    return canvas.toDataURL();
}

/* ---- CORE */

function render_single_frame (keyframe, image, offsetH, offsetV, width, height, targetWidth, targetHeight, animation, animationInvert, effects, framerate, framecount, fillStyle) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    effects.forEach(function (effect) {
        effect(keyframe, ctx, targetWidth, targetHeight, fillStyle);
    });
    if (animation) {
        animation(keyframe, ctx, image, offsetH, offsetV, width, height, targetWidth, targetHeight);
    } else {
        ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, targetWidth, targetHeight);
    }

    return canvas;
}

function render_result_cell (image, offsetH, offsetV, width, height, targetWidth, targetHeight, animation, animationInvert, effects, framerate, framecount, background, transparent) {
    if (!animation && !effects.length) {
        return render_single_frame(
            0, image,
            offsetH, offsetV, width, height, targetWidth, targetHeight,
            animation, animationInvert, effects, framerate, framecount,
            transparent ? 'rgba(0, 0, 0, 0)' : background
        ).toDataURL();
    } else {
        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(framerate);
        if (transparent) {
            encoder.setTransparent(0xffffff);
        }
        encoder.start();
        for (var i = 0; i < framecount; i++) {
            var keyframe = animationInvert ? 1 - (i / framecount) : i / framecount;
            encoder.addFrame(
                render_single_frame(
                    keyframe, image,
                    offsetH, offsetV, width, height, targetWidth, targetHeight,
                    animation, animationInvert, effects, framerate, framecount,
                    transparent ? '#ffffff' : background
                ).getContext('2d')
            );
        }
        encoder.finish();

        return "data:image/gif;base64," + encode64(encoder.stream().getData());
    }
}

function render_all_cells_with_fixed_size (image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, targetSize, animation, animationInvert, effects, framerate, framecount, backgroundColor, transparent) {
    var renderedCells = [];
    for (var y = 0; y < vCells; y++) {
        for (var x = 0, row = []; x < hCells; x++) {
            row.push(
                render_result_cell(
                    image,
                    offsetH + x * cellWidth, offsetV + y * cellHeight,
                    cellWidth, cellHeight, targetSize, targetSize,
                    animation, animationInvert,
                    effects, framerate, framecount,
                    backgroundColor, transparent
                )
            );
        }
        renderedCells.push(row);
    }
    return renderedCells;
}

function render_all_cells (image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, animation, animationInvert, effects, framerate, framecount, backgroundColor, transparent) {
    var target_size = (animation || effects.length) ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
    while (true) {
        var ret = render_all_cells_with_fixed_size(
            image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, target_size,
            animation, animationInvert, effects, framerate, framecount,
            backgroundColor, transparent
        );
        /**
         * If a cell exceeds the limitation, retry with smaller target_size.
         * This does not happen in most cases.
         */
        var shouldRetry = ret.some(function (row) {
            return row.some(function (cell) {
                return dataurl_size(cell) >= BINARY_SIZE_LIMIT;
            });
        });
        if (shouldRetry) {
            target_size = Math.floor(target_size * 0.9);
        } else {
            return ret;
        }
    }
}

var store = {
    baseImage: null,
    resultImages: [],
    /* form inputs */
    source: {
        sourceMode: "unselected",
        file: {
            /* basic */
            file: null,
            /* advanced */
            showDetails: false,
            filter: ""
        },
        text: {
            /* basic */
            content: "",
            align: "left",
            color: "#e85600",
            font: "bold sans-serif",
            /* advanced */
            showDetails: false,
            lineSpacing: 0.1
        },
        fukumoji: {
            base: "assets/void.svg",
            textures: "assets/void.svg",
            eyes: "assets/void.svg",
            mouths: "assets/void.svg",
            others: "assets/void.svg"
        }
    },
    target: {
        /* basic */
        trimming: "",
        hCells: 1,
        vCells: 1,
        animation: "",
        speed: "",
        animationInvert: false,
        effects: [],
        /* advanced */
        showDetails: false,
        showAnimeDetails: false,
        offsetLeft: 0,
        offsetTop: 0,
        hZoom: "1.0",
        vZoom: "1.0",
        framerate: 18,
        framecount: 12,
        backgroundColor: "#ffffff",
        transparent: false
    },
};

var methods = {
    loadFile: function () {
        load_file(vm.source.file.file, function (blobUrl) {
            var filter = window[vm.source.file.filter];
            vm.baseImage = filter ? filter(url_to_image(blobUrl)) : blobUrl;
        });
    },
    fukumojiSelect: function (key, value) {
        vm.source.fukumoji[key] = value;

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');

        canvas.width = 128;
        canvas.height = 128;

        // images are expected to be loaded here
        var img = document.createElement("img");
        img.src = vm.source.fukumoji.base;
        ctx.drawImage(img, 0, 0, 128, 128);
        img.src = vm.source.fukumoji.textures;
        ctx.drawImage(img, 0, 0, 128, 128);
        img.src = vm.source.fukumoji.mouths;
        ctx.drawImage(img, 0, 0, 128, 128);
        img.src = vm.source.fukumoji.eyes;
        ctx.drawImage(img, 0, 0, 128, 128);
        img.src = vm.source.fukumoji.others;
        ctx.drawImage(img, 0, 0, 128, 128);

        vm.baseImage = canvas.toDataURL();
    },
    refreshDefaultSettings: function () {
        var image = vm.$refs.baseImage;
        var v     = vm.target.vCells;
        var h     = vm.target.hCells;
        var width_ratio  = (EMOJI_SIZE * h) / image.naturalWidth;
        var height_ratio = (EMOJI_SIZE * v) / image.naturalHeight;

        if (vm.target.trimming == "cover") {
            width_ratio = height_ratio = Math.max(width_ratio, height_ratio);
        } else if (vm.target.trimming == "contain") {
            width_ratio = height_ratio = Math.min(width_ratio, height_ratio);
        }

        vm.target.hZoom      = width_ratio + "";
        vm.target.vZoom      = height_ratio + "";
        vm.target.offsetLeft = (image.naturalWidth - EMOJI_SIZE / width_ratio * h) / 2 + "";
        vm.target.offsetTop  = Math.min(0, (image.naturalHeight - EMOJI_SIZE / height_ratio * v) / 2) + "";
    },
    refreshFrameSettings: function () {
        if (vm.target.speed == "") {
            vm.target.framerate = 18;
            vm.target.framecount = 12;
        } else if (vm.target.speed == "turbo") {
            vm.target.framerate = 60;
            vm.target.framecount = 12;
        } else if (vm.target.speed == "super-turbo") {
            vm.target.framerate = 60;
            vm.target.framecount = 6;
        }
    },
    render: function () {
        var image     = vm.$refs.baseImage;
        var animation = window[vm.target.animation];
        var effects   = vm.target.effects.map(function (x) { return window[x]; });

        var offsetLeft = parseInt(vm.target.offsetLeft);
        var offsetTop  = parseInt(vm.target.offsetTop);

        var cell_width = EMOJI_SIZE / vm.target.hZoom;
        var cell_height = EMOJI_SIZE / vm.target.vZoom;

        var settings = vm.target.animation + "/" + vm.target.effects.join(",");
        ga("send", "event", vm.source.sourceMode, "render", settings);

        vm.resultImages = render_all_cells(
            image,
            offsetLeft, offsetTop,
            vm.target.hCells, vm.target.vCells, cell_width, cell_height,
            animation, vm.target.animationInvert,
            effects, vm.target.framerate, vm.target.framecount,
            vm.target.backgroundColor, vm.target.transparent
        );
    },
    onToggleFileDetails: function () {
        vm.source.file.showDetails = !vm.source.file.showDetails;
    },
    onToggleTextDetails: function () {
        vm.source.text.showDetails = !vm.source.text.showDetails;
    },
    onToggleTargetDetails: function () {
        vm.target.showDetails = !vm.target.showDetails;
    },
    onToggleTargetAnimeDetails: function () {
        vm.target.showAnimeDetails = !vm.target.showAnimeDetails;
    },
    onChangeFile: function (e) {
        vm.source.file.filter = "";
        vm.source.file.file = e.target.files[0];
        vm.loadFile();
    },
    onClickReload: function () {
        vm.loadFile();
    },
    onClickGenerateText: function () {
        vm.baseImage = generate_text_image(
            vm.source.text.content,
            vm.source.text.color,
            vm.source.text.font.replace(/^([^ ]+)/, "$1 " + EMOJI_SIZE + "px"),
            vm.source.text.align,
            vm.source.text.lineSpacing * EMOJI_SIZE
        );
    }
};

var vm = new Vue({ el: "#app", data: store, methods: methods });

window.onerror = function (msg, file, line, col) {
    ga('send', 'event', "error", "thrown", file + ":" + line + ":" + col + " " + msg);
};

!function () {
    var match = location.href.match(/\?([^=]+)(=(.*))?$/);
    if (match) {
        if (match[1] == "test") {
            vm.source.sourceMode = "text";
            vm.baseImage = generate_text_image(
                "あ",
                "#e85600",
                "bold 128px sans-serif",
                "center",
                12.8
            )
        } else if (match[1] == "mode") {
            vm.source.sourceMode = match[3];
        }
    }
}();
