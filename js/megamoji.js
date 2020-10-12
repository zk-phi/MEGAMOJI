var TEXT_CANVAS_SIZE    = 1500; /* a sufficiently large number */
var EMOJI_SIZE          = 128;
var ANIMATED_EMOJI_SIZE = 64;
var BINARY_SIZE_LIMIT   = 64000;

/* ---- CANVAS UTILS */

/* Create a new canvas and render specified region of the source canvas. */
function cropCanvas (source, left, top, w, h) {
    var target    = document.createElement("canvas");
    var ctx       = target.getContext('2d');
    target.width  = w;
    target.height = h;

    ctx.drawImage(source, left, top, w, h, 0, 0, w, h);

    return target;
}

/* Split canvas into a 2d-array of canvases */
function cutoutCanvasIntoCells (source, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight) {
    var cells = [];
    for (var y = 0; y < vCells; y++) {
        for (var x = 0, row = []; x < hCells; x++) {
            row.push(
                cropCanvas(
                    source,
                    offsetH + x * cellWidth, offsetV + y * cellHeight,
                    cellWidth, cellHeight
                )
            );
        }
        cells.push(row);
    }
    return cells;
}

/* Merge images into one image and return as a BlobURL. */
function mergeImages (w, h, srcs, callback) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;

    var ix = 0;
    var img = document.createElement("img");

    img.onload = function (e) {
        ctx.drawImage(img, 0, 0, w, h);
        if (++ix == srcs.length) {
            callback(canvas.toDataURL());
        } else {
            img.src = srcs[ix];
        }
    };

    img.src = srcs[0];
}

/* Load a local image via specified path and call-back with the BlobURL of the loaded image. */
function loadFileAsBlobURL (path, callback) {
    var reader = new FileReader();
    reader.onload = function (e) { callback(e.target.result); };
    reader.readAsDataURL(path);
}

/* Create an img object, set src attr to the specified url, and return it. */
function urlToImg (url, cb) {
    var img = document.createElement("img");
    img.src = url;
    img.onload = function () {
        cb(img);
    }
}

/* compute binary size from a dataurl. return 0 if uncomputable. */
function dataurlSize (str) {
    var ix = str.indexOf(',');
    if (ix < 0) return 0;
    return Math.ceil((str.length - ix - 1) / 4.0 * 3);
}

/* ---- TEXT IMAGE GENERATOR */

/* Create a new canvas and render a single-line text. Returns the cropped canvas object. */
function _makeTextImageSingleLine (line, color, font) {
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

    var width  = ctx.measureText(line || " ").width;
    var height = bottom - top;

    return cropCanvas(canvas, 0, top, width, height);
}

/* Create an image from a (possibly) multi-line text and return as a BlobURL. */
function makeTextImage (text, color, font, align, lineSpacing) {
    var images       = text.split("\n").map(function (line) { return _makeTextImageSingleLine(line, color, font); });
    var lineWidths  = images.map(function (canvas) { return canvas.width; })
    var maxWidth    = Math.max.apply(null, lineWidths);
    var totalHeight = images.reduce(function (l, r) { return l + r.height; }, 0) + lineSpacing * (images.length - 1);

    var canvas = document.createElement("canvas");
    canvas.width  = maxWidth;
    canvas.height = totalHeight;

    var ctx = canvas.getContext('2d');

    var currentHeight = 0;
    images.forEach(function (image, ix) {
        ctx.save();

        if (align == "right") {
            ctx.translate(maxWidth - lineWidths[ix], 0)
        } else if (align == "center") {
            ctx.translate((maxWidth - lineWidths[ix]) / 2, 0);
        } else if (align == "stretch") {
            ctx.transform(maxWidth / lineWidths[ix], 0, 0, 1, 0, 0);
        }

        ctx.drawImage(image, 0, currentHeight);
        currentHeight += image.height + lineSpacing;

        ctx.restore();
    });

    return canvas.toDataURL();
}

/* ---- CORE */

function _renderFrameUncut (keyframe, image, offsetH, offsetV, width, height, targetWidth, targetHeight, noCrop, animation, animationInvert, effects, framerate, framecount, fillStyle) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    /* use larger canvas, because some effects may translate the canvas */
    canvas.width = targetWidth * 2;
    canvas.height = targetHeight * 2;

    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, targetWidth * 2, targetHeight * 2);

    effects.forEach(function (effect) {
        effect(keyframe, ctx, targetWidth * 2, targetHeight * 2, fillStyle);
    });
    if (animation) {
        animation(keyframe, ctx, image, offsetH, offsetV, width, height, targetWidth * 2, targetHeight * 2);
    } else {
        var left = offsetH - width / 2;
        var top = offsetV - height / 2;
        var targetLeft = left >= 0 ? 0 : - left * targetWidth / width;
        var targetTop = top >= 0 ? 0 : - top * targetHeight / height;
        ctx.drawImage(image, Math.max(0, left), Math.max(0, top), width * 2, height * 2, targetLeft, targetTop, targetWidth * 2, targetHeight * 2);
    }

    if (noCrop) {
        return canvas;
    } else {
        return cropCanvas(canvas, targetWidth / 2, targetHeight / 2, targetWidth, targetHeight);
    }
}

/**
 * returns a 2d-array of (possibly animated) images of specified size (tragetSize).
 * each images may exceed BINARY_SIZE_LIMIT.
 */
function _renderAllCellsFixedSize (image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, targetSize, noCrop, animation, animationInvert, effects, framerate, framecount, backgroundColor, transparent) {
    if (!animation && !effects.length) {
        var img = _renderFrameUncut(
            0, image,
            offsetH, offsetV, cellWidth * hCells, cellHeight * vCells,
            targetSize * hCells, targetSize * vCells, noCrop,
            animation, animationInvert, effects, framerate, framecount,
            transparent ? 'rgba(0, 0, 0, 0)' : backgroundColor
        );
        var cells = noCrop ? (
            cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
        ) : (
            cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize, targetSize)
        );
        return cells.map(function (row) {
            return row.map(function (cell) {
                return cell.toDataURL();
            });
        });
    } else {
        /* instantiate GIF encoders for each cells */
        var cells = [];
        for (var y = 0; y < vCells; y++) {
            for (var x = 0, row = []; x < hCells; x++) {
                var encoder = new GIFEncoder();
                encoder.setRepeat(0);
                encoder.setFrameRate(framerate);
                if (transparent) encoder.setTransparent(0xffffff);
                encoder.start();
                row.push(encoder);
            }
            cells.push(row);
        }
        for (var i = 0; i < framecount; i++) {
            var keyframe = animationInvert ? 1 - (i / framecount) : i / framecount;
            var img = _renderFrameUncut(
                keyframe, image,
                offsetH, offsetV, cellWidth * hCells, cellHeight * vCells,
                targetSize * hCells, targetSize * vCells, noCrop,
                animation, animationInvert, effects, framerate, framecount,
                transparent ? '#ffffff' : backgroundColor
            );
            var imgCells = noCrop ? (
                cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
            ) : (
                cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize, targetSize)
            );
            for (y = 0; y < vCells; y++) {
                for (x = 0, row = []; x < hCells; x++) {
                    cells[y][x].addFrame(imgCells[y][x].getContext('2d'));
                }
            }
        }
        return cells.map(function (row) {
            return row.map(function (cell) {
                cell.finish();
                return "data:image/gif;base64," + encode64(cell.stream().getData());
            });
        });
    }
}

/* returns a 2d-array of (possibly animated) images. */
function renderAllCells (image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, noCrop, animation, animationInvert, effects, framerate, framecount, backgroundColor, transparent) {
    var targetSize = (animation || effects.length) ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
    while (true) {
        var ret = _renderAllCellsFixedSize(
            image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, targetSize, noCrop,
            animation, animationInvert, effects, framerate, framecount,
            backgroundColor, transparent
        );
        /**
         * If a cell exceeds the limitation, retry with smaller targetSize.
         * This does not happen in most cases.
         */
        var shouldRetry = ret.some(function (row) {
            return row.some(function (cell) {
                return dataurlSize(cell) >= BINARY_SIZE_LIMIT;
            });
        });
        if (shouldRetry) {
            targetSize = Math.floor(targetSize * 0.9);
        } else {
            return ret;
        }
    }
}

var store = {
    baseImage: null,
    resultImages: [],
    /* ui */
    ui: {
        mode: "text",
        fukumojiTab: "base",
        showTargetDetails: false
    },
    /* form inputs */
    source: {
        file: {
            file: null,
            filter: ""
        },
        text: {
            /* basic */
            content: "",
            align: "left",
            color: "#e85600",
            font: "normal sans-serif",
            /* advanced */
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
        animationInvert: false,
        effects: [],
        /* advanced */
        offsetLeft: 0,
        offsetTop: 0,
        hZoom: "1.0",
        vZoom: "1.0",
        noCrop: false,
        framerate: 18,
        framecount: 12,
        backgroundColor: "#ffffff",
        transparent: false
    },
};

var watch = {
    baseImage: function () {
        vm.refreshDefaultSettings();
        vm.render();
    },
    'source.file': {
        handler: function () {
            vm.loadFile();
        },
        deep: true
    },
    'source.text': {
        handler: function () {
            vm.renderText();
        },
        deep: true
    },
    'source.fukumoji': {
        handler: function () {
            vm.renderFukumoji();
        },
        deep: true
    },
    target: {
        handler: function () {
            vm.render();
        },
        deep: true
    }
};

var methods = {
    loadFile: function () {
        if (vm.source.file.file) {
            loadFileAsBlobURL(vm.source.file.file, function (blobUrl) {
                urlToImg(blobUrl, function (img) {
                    var filter = window[vm.source.file.filter];
                    if (filter) {
                        urlToImg(filter(img), function (img) { vm.baseImage = img; });
                    } else {
                        vm.baseImage = img;
                    }
                });
            });
        }
    },
    renderText: function () {
        if (vm.source.text.content || vm.baseImage) {
            var blobUrl = makeTextImage(
                vm.source.text.content,
                vm.source.text.color,
                vm.source.text.font.replace(/^([^ ]+)/, "$1 " + EMOJI_SIZE + "px"),
                vm.source.text.align,
                vm.source.text.lineSpacing * EMOJI_SIZE
            );
            urlToImg(blobUrl, function (img) { vm.baseImage = img; });
        }
    },
    renderFukumoji: function () {
        var blobUrl = mergeImages(128, 128, [
            vm.source.fukumoji.base,
            vm.source.fukumoji.textures,
            vm.source.fukumoji.mouths,
            vm.source.fukumoji.eyes,
            vm.source.fukumoji.others
        ], function (blobUrl) {
            urlToImg(blobUrl, function (img) {
                vm.baseImage = img;
            });
        });
    },
    refreshDefaultSettings: function () {
        var image = vm.baseImage;
        var v     = vm.target.vCells;
        var h     = vm.target.hCells;
        var widthRatio  = (EMOJI_SIZE * h) / image.naturalWidth;
        var heightRatio = (EMOJI_SIZE * v) / image.naturalHeight;

        if (vm.target.trimming == "cover") {
            widthRatio = heightRatio = Math.max(widthRatio, heightRatio);
        } else if (vm.target.trimming == "contain") {
            widthRatio = heightRatio = Math.min(widthRatio, heightRatio);
        }

        vm.target.hZoom      = widthRatio + "";
        vm.target.vZoom      = heightRatio + "";
        vm.target.offsetLeft = (image.naturalWidth - EMOJI_SIZE / widthRatio * h) / 2 + "";
        vm.target.offsetTop  = Math.min(0, (image.naturalHeight - EMOJI_SIZE / heightRatio * v) / 2) + "";
    },
    onSelectMode: function (value) {
        vm.ui.mode = value;
    },
    onSelectFukumojiTab: function (value) {
        vm.ui.fukumojiTab = value;
    },
    onSelectFukumojiPart: function (key, value) {
        vm.source.fukumoji[key] = value;
    },
    onSelectSpeedPreset: function (e) {
        var speed = e.target.value;
        if (speed == "") {
            vm.target.framerate = 18;
            vm.target.framecount = 12;
        } else if (speed == "turbo") {
            vm.target.framerate = 60;
            vm.target.framecount = 12;
        } else if (speed == "super-turbo") {
            vm.target.framerate = 60;
            vm.target.framecount = 6;
        }
    },
    onToggleTargetDetails: function () {
        vm.ui.showTargetDetails = !vm.ui.showTargetDetails;
    },
    onChangeFile: function (e) {
        vm.source.file.file = e.target.files[0];
    },
    render: function () {
        if (!vm.baseImage) return;

        var image     = vm.baseImage;
        var animation = window[vm.target.animation];
        var effects   = vm.target.effects.map(function (x) { return window[x]; });

        var offsetLeft = parseInt(vm.target.offsetLeft);
        var offsetTop  = parseInt(vm.target.offsetTop);

        var cellWidth = EMOJI_SIZE / vm.target.hZoom;
        var cellHeight = EMOJI_SIZE / vm.target.vZoom;

        var settings = vm.target.animation + "/" + vm.target.effects.join(",");
        ga("send", "event", vm.ui.mode, "render", settings);

        vm.resultImages = renderAllCells(
            image,
            offsetLeft, offsetTop,
            vm.target.hCells, vm.target.vCells, cellWidth, cellHeight, vm.target.noCrop,
            animation, vm.target.animationInvert,
            effects, vm.target.framerate, vm.target.framecount,
            vm.target.backgroundColor, vm.target.transparent
        );
    }
};

var vm = new Vue({ el: "#app", data: store, methods: methods, watch: watch });

window.onerror = function (msg, file, line, col) {
    ga('send', 'event', "error", "thrown", file + ":" + line + ":" + col + " " + msg);
};

!function () {
    var match = location.href.match(/\?([^=]+)(=(.*))?$/);
    if (match) {
        if (match[1] == "test") {
            vm.ui.mode = "text";
            vm.source.text.content = "あ";
        } else if (match[1] == "mode") {
            vm.ui.mode = match[3];
        }
    }
}();
