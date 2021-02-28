const EMOJI_SIZE = 128;
const ANIMATED_EMOJI_SIZE = 96;
const BINARY_SIZE_LIMIT = 128000;

/* ---- COLOR UTILS */

function HEX2RGB(hex) {
    return {
        r: parseInt(hex.substring(1, 3), 16),
        g: parseInt(hex.substring(3, 5), 16),
        b: parseInt(hex.substring(5, 7), 16),
    };
}

function intToByte(int) {
    const str = Number(int).toString(16);
    if (str.length < 2) {
        return `0${str}`;
    } else {
        return str;
    }
}

function lighterColor(hexColor) {
    const rgb = HEX2RGB(hexColor);
    const newRgb = {
        r: Math.min(255, rgb.r + 96),
        g: Math.min(255, rgb.g + 96),
        b: Math.min(255, rgb.b + 96),
    };
    return `#${intToByte(newRgb.r)}${intToByte(newRgb.g)}${intToByte(newRgb.b)}`;
}

function darkerColor(hexColor) {
    const rgb = HEX2RGB(hexColor);
    const newRgb = {
        r: Math.max(0, rgb.r - 64),
        g: Math.max(0, rgb.g - 64),
        b: Math.max(0, rgb.b - 64),
    };
    return `#${intToByte(newRgb.r)}${intToByte(newRgb.g)}${intToByte(newRgb.b)}`;
}

/* ---- CANVAS UTILS */

/* Create a new canvas and render specified region of the source canvas. */
function cropCanvas(source, left, top, w, h) {
    const target = document.createElement("canvas");
    const ctx = target.getContext("2d");
    target.width = w;
    target.height = h;

    ctx.drawImage(source, left, top, w, h, 0, 0, w, h);

    return target;
}

/* drop transparent area from canvas and returns a new cropped canvas */
function shrinkCanvas(source) {
    const ctx = source.getContext("2d");
    const { data } = ctx.getImageData(0, 0, source.width, source.height);

    let top = 0;
    topLoop: for (; top < source.height; top += 1) {
        for (let x = 0; x < source.width; x += 1) {
            if (data[(top * source.width + x) * 4 + 3]) {
                break topLoop;
            }
        }
    }

    let bottom = source.height - 1;
    bottomLoop: for (; bottom >= top; bottom -= 1) {
        for (let x = 0; x < source.width; x += 1) {
            if (data[(bottom * source.width + x) * 4 + 3]) {
                break bottomLoop;
            }
        }
    }

    let left = 0;
    leftLoop: for (; left < source.width; left += 1) {
        for (let y = top + 1; y < bottom; y += 1) {
            if (data[(y * source.width + left) * 4 + 3]) {
                break leftLoop;
            }
        }
    }

    let right = source.width - 1;
    rightLoop: for (; right >= left; right -= 1) {
        for (let y = top + 1; y < bottom; y += 1) {
            if (data[(y * source.width + right) * 4 + 3]) {
                break rightLoop;
            }
        }
    }

    return cropCanvas(source, left, top, (right - left + 1) || 1, (bottom - top + 1) || 1);
}

/* Split canvas into a 2d-array of canvases */
function cutoutCanvasIntoCells(source, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight) {
    const cells = [];
    for (let y = 0; y < vCells; y += 1) {
        const row = [];
        for (let x = 0; x < hCells; x += 1) {
            row.push(
                cropCanvas(
                    source,
                    offsetH + x * cellWidth, offsetV + y * cellHeight,
                    cellWidth, cellHeight,
                ),
            );
        }
        cells.push(row);
    }
    return cells;
}

/* Merge images into one image and return as a BlobURL. */
function mergeImages(w, h, srcs, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = w;
    canvas.height = h;

    let ix = 0;
    const img = document.createElement("img");

    img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        ix += 1;
        if (ix === srcs.length) {
            callback(canvas.toDataURL());
        } else {
            img.src = srcs[ix];
        }
    };

    img.src = srcs[0];
}

/* Load a local image via specified path and call-back with the BlobURL of the loaded image. */
function loadFileAsBlobURL(path, callback) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(path);
}

/* Create an img object, set src attr to the specified url, and return it. */
function urlToImg(url, cb) {
    const img = document.createElement("img");
    img.src = url;
    img.onload = () => cb(img);
}

/* compute binary size from a dataurl. return 0 if uncomputable. */
function dataurlSize(str) {
    const ix = str.indexOf(",");
    if (ix < 0) return 0;
    return Math.ceil((str.length - ix - 1) / 4.0 * 3);
}

/* ---- TEXT IMAGE GENERATOR */

/* Create a new canvas and render a single-line text. Returns the cropped canvas object. */
function makeTextImageSingleLine(line, color, font, fontHeight, outlineColors, gradient) {
    const canvas = document.createElement("canvas");
    canvas.width = fontHeight * (line.length || 1) * 2;
    canvas.height = fontHeight * 2;

    const ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.textBaseline = "top";

    for (let i = outlineColors.length - 1; i >= 0; i -= 1) {
        ctx.strokeStyle = outlineColors[i];
        ctx.lineWidth = (i + 1) * 8;
        ctx.strokeText(line, 25, 25);
    }

    if (gradient.length) {
        const gradientObj = ctx.createLinearGradient(0, 0, 0, fontHeight + 50);
        gradient.forEach((colorStop) => {
            gradientObj.addColorStop(colorStop.pos / 100, colorStop.color);
        });
        ctx.fillStyle = gradientObj;
    } else {
        ctx.fillStyle = color;
    }
    ctx.fillText(line, 25, 25);

    return shrinkCanvas(canvas);
}

/* Create an image from a (possibly) multi-line text and return as a BlobURL. */
function makeTextImage(text, color, font, fontHeight, align, lineSpacing, outlineColors, gradient) {
    const images = text.split("\n").map((line) => (
        makeTextImageSingleLine(line, color, font, fontHeight, outlineColors, gradient)
    ));
    const lineWidths = images.map((canvas) => canvas.width);
    const maxWidth = Math.max.apply(null, lineWidths);
    const totalHeight = lineSpacing * (images.length - 1) + images.reduce((l, r) => (
        l + r.height
    ), 0);

    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = totalHeight;

    const ctx = canvas.getContext("2d");

    let currentHeight = 0;
    images.forEach((image, ix) => {
        ctx.save();

        if (align === "right") {
            ctx.translate(maxWidth - lineWidths[ix], 0);
        } else if (align === "center") {
            ctx.translate((maxWidth - lineWidths[ix]) / 2, 0);
        } else if (align === "stretch") {
            ctx.transform(maxWidth / lineWidths[ix], 0, 0, 1, 0, 0);
        }

        ctx.drawImage(image, 0, currentHeight);
        currentHeight += image.height + lineSpacing;

        ctx.restore();
    });

    return canvas.toDataURL();
}

/* ---- CORE */

function renderFrameUncut(
    keyframe,
    image, offsetH, offsetV, width, height, targetWidth, targetHeight, noCrop,
    animation, animationInvert, effects, postEffects, framerate, framecount,
    fillStyle,
) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    /* use larger canvas, because some effects may translate the canvas */
    canvas.width = targetWidth * 2;
    canvas.height = targetHeight * 2;

    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, targetWidth * 2, targetHeight * 2);

    effects.forEach((effect) => {
        effect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
    });
    if (animation) {
        animation(
            keyframe,
            ctx, image, offsetH, offsetV, width, height, targetWidth * 2, targetHeight * 2,
        );
    } else {
        const left = offsetH - width / 2;
        const top = offsetV - height / 2;
        const targetLeft = left >= 0 ? 0 : -left * targetWidth / width;
        const targetTop = top >= 0 ? 0 : -top * targetHeight / height;
        ctx.drawImage(
            image,
            Math.max(0, left), Math.max(0, top), width * 2, height * 2,
            targetLeft, targetTop, targetWidth * 2, targetHeight * 2,
        );
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    postEffects.forEach((postEffect) => {
        postEffect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
    });

    if (noCrop) {
        return canvas;
    } else {
        return cropCanvas(canvas, targetWidth / 2, targetHeight / 2, targetWidth, targetHeight);
    }
}

/**
 * returns a 2d-array of (possibly animated) images of specified size (tragetSize).
 * each images may exceed binarySizeLimit.
 */
function renderAllCellsFixedSize(
    image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, targetSize, noCrop,
    animated, animation, animationInvert, effects, postEffects, framerate, framecount,
    backgroundColor, transparent,
) {
    let cells = [];
    if (!animated) {
        const img = renderFrameUncut(
            0, image,
            offsetH, offsetV, cellWidth * hCells, cellHeight * vCells,
            targetSize * hCells, targetSize * vCells, noCrop,
            animation, animationInvert, effects, postEffects, framerate, framecount,
            transparent ? "rgba(0, 0, 0, 0)" : backgroundColor,
        );
        cells = noCrop ? (
            cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
        ) : (
            cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize, targetSize)
        );
        return cells.map((row) => row.map((cell) => cell.toDataURL()));
    } else {
        /* instantiate GIF encoders for each cells */
        for (let y = 0; y < vCells; y += 1) {
            const row = [];
            for (let x = 0; x < hCells; x += 1) {
                const encoder = new GIFEncoder();
                encoder.setRepeat(0);
                encoder.setFrameRate(framerate);
                if (transparent) encoder.setTransparent(0xffffff);
                encoder.start();
                row.push(encoder);
            }
            cells.push(row);
        }
        for (let i = 0; i < framecount; i += 1) {
            const keyframe = animationInvert ? 1 - (i / framecount) : i / framecount;
            const frame = renderFrameUncut(
                keyframe, image,
                offsetH, offsetV, cellWidth * hCells, cellHeight * vCells,
                targetSize * hCells, targetSize * vCells, noCrop,
                animation, animationInvert, effects, postEffects, framerate, framecount,
                transparent ? "#ffffff" : backgroundColor,
            );
            const imgCells = noCrop ? (
                cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
            ) : (
                cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize, targetSize)
            );
            for (let y = 0; y < vCells; y += 1) {
                for (let x = 0; x < hCells; x += 1) {
                    cells[y][x].addFrame(imgCells[y][x].getContext("2d"));
                }
            }
        }
        return cells.map((row) => row.map((cell) => {
            cell.finish();
            return `data:image/gif;base64,${encode64(cell.stream().getData())}`;
        }));
    }
}

/* returns a 2d-array of (possibly animated) images. */
function renderAllCells(
    image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, maxSize, noCrop,
    animated, animation, animationInvert, effects, postEffects, framerate, framecount,
    backgroundColor, transparent,
    binarySizeLimit,
) {
    let targetSize = maxSize;
    for (;;) {
        const ret = renderAllCellsFixedSize(
            image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, targetSize, noCrop,
            animated, animation, animationInvert, effects, postEffects, framerate, framecount,
            backgroundColor, transparent,
        );
        /**
         * If a cell exceeds the limitation, retry with smaller targetSize.
         * This does not happen in most cases.
         */
        const shouldRetry = ret.some((row) => row.some((cell) => (
            dataurlSize(cell) >= binarySizeLimit
        )));
        if (shouldRetry) {
            targetSize = Math.floor(targetSize * 0.9);
        } else {
            return ret;
        }
    }
}

const data = {
    baseImage: null,
    resultImages: [["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB0UlEQVR4Xu3UAQ0AAAyDsM+/6QspcwAh2zXawGj64K8A8AgKoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7ADyAB6SPAIFm19U7AAAAAElFTkSuQmCC"]],
    resultBgClass: "default",
    /* ui */
    ui: {
        mode: "text",
        showTargetPanel: false,
        fukumojiTab: "base",
        showTextDetails: false,
        showTargetDetails: false,
    },
    /* form inputs */
    source: {
        file: {
            file: null,
            filter: "",
        },
        text: {
            /* basic */
            content: "",
            align: "stretch",
            color: "#ffbf00",
            gradient: [],
            outlines: [],
            font: "normal sans-serif",
            /* advanced */
            lineSpacing: 0.05,
        },
        fukumoji: {
            base: "assets/void.svg",
            textures: "assets/void.svg",
            eyes: "assets/void.svg",
            mouths: "assets/void.svg",
            others: "assets/void.svg",
        },
    },
    target: {
        /* basic */
        trimming: "",
        hCells: 1,
        vCells: 1,
        animation: "",
        animationInvert: false,
        staticEffects: [],
        effects: [],
        postEffects: [],
        /* advanced */
        offsetLeft: 0,
        offsetTop: 0,
        hZoom: "1.0",
        vZoom: "1.0",
        noCrop: false,
        framerate: 18,
        framecount: 12,
        backgroundColor: "#ffffff",
        transparent: false,
    },
};

const watch = {
    baseImage: {
        handler() {
            this.refreshDefaultSettings();
            this.render();
        },
    },
    "source.file": {
        handler() {
            this.loadFile();
        },
        deep: true,
    },
    "source.text": {
        handler() {
            this.renderText();
        },
        deep: true,
    },
    "source.text.color": {
        handler() {
            this.source.text.gradient = [];
        },
    },
    "source.fukumoji": {
        handler() {
            this.renderFukumoji();
        },
        deep: true,
    },
    target: {
        handler() {
            this.render();
        },
        deep: true,
    },
};

const computed = {
    outlineColors() {
        const { color } = this.source.text;
        return this.source.text.outlines.map((outline) => (
            outline === "lighter" ? (
                lighterColor(color)
            ) : outline === "darker" ? (
                darkerColor(color)
            ) : (
                outline
            )
        ));
    },
};

const methods = {
    loadFile() {
        if (this.source.file.file) {
            loadFileAsBlobURL(this.source.file.file, (blobUrl) => {
                urlToImg(blobUrl, (originalImg) => {
                    if (this.source.file.filter) {
                        urlToImg(this.source.file.filter(originalImg), (filteredImg) => {
                            this.baseImage = filteredImg;
                        });
                    } else {
                        this.baseImage = originalImg;
                    }
                });
            });
        }
    },
    renderText() {
        if (this.source.text.content || this.baseImage) {
            const blobUrl = makeTextImage(
                this.source.text.content,
                this.source.text.color,
                this.source.text.font.replace(/^([^ ]+)/, `$1 ${EMOJI_SIZE}px`),
                EMOJI_SIZE,
                this.source.text.align,
                this.source.text.lineSpacing * EMOJI_SIZE,
                this.outlineColors, this.source.text.gradient,
            );
            urlToImg(blobUrl, (img) => { this.baseImage = img; });
        }
    },
    renderFukumoji() {
        mergeImages(128, 128, [
            this.source.fukumoji.base,
            this.source.fukumoji.textures,
            this.source.fukumoji.mouths,
            this.source.fukumoji.eyes,
            this.source.fukumoji.others,
        ], (blobUrl) => {
            urlToImg(blobUrl, (img) => {
                this.baseImage = img;
            });
        });
    },
    initializeGradient() {
        this.source.text.gradient = [
            { color: "#ffffff", pos: 0 },
            { color: this.source.text.color, pos: 45 },
            { color: lighterColor(this.source.text.color), pos: 55 },
            { color: darkerColor(this.source.text.color), pos: 65 },
        ];
    },
    addGradientColorStop() {
        this.source.text.gradient.push({
            color: this.source.text.color,
            pos: 50,
        });
    },
    removeGradientColorStop(ix) {
        this.source.text.gradient.splice(ix, 1);
    },
    addOutline() {
        this.source.text.outlines.push(this.source.text.color);
    },
    removeOutline(ix) {
        this.source.text.outlines.splice(ix, 1);
    },
    refreshDefaultSettings() {
        const image = this.baseImage;
        const v = this.target.vCells;
        const h = this.target.hCells;
        let widthRatio = (EMOJI_SIZE * h) / image.naturalWidth;
        let heightRatio = (EMOJI_SIZE * v) / image.naturalHeight;

        if (this.target.trimming === "cover") {
            widthRatio = Math.max(widthRatio, heightRatio);
            heightRatio = widthRatio;
        } else if (this.target.trimming === "contain") {
            widthRatio = Math.min(widthRatio, heightRatio);
            heightRatio = widthRatio;
        }

        this.target.hZoom = `${widthRatio}`;
        this.target.vZoom = `${heightRatio}`;
        this.target.offsetLeft = `${(image.naturalWidth - EMOJI_SIZE / widthRatio * h) / 2}`;
        this.target.offsetTop = `${Math.min(0, (image.naturalHeight - EMOJI_SIZE / heightRatio * v) / 2)}`;
    },
    onSetShowTarget(value) {
        this.ui.showTargetPanel = value;
        ga("send", "pageview", value ? "/target" : (`/${this.ui.mode}`));
    },
    onSelectMode(value) {
        this.ui.mode = value;
        this.ui.showTargetPanel = false;
        ga("send", "pageview", `/${value}`);
    },
    onSelectFukumojiTab(value) {
        this.ui.fukumojiTab = value;
    },
    onSelectFukumojiPart(key, value) {
        this.source.fukumoji[key] = value;
    },
    onSelectSpeedPreset(e) {
        const speed = e.target.value;
        if (speed === "") {
            this.target.framerate = 18;
            this.target.framecount = 12;
        } else if (speed === "turbo") {
            this.target.framerate = 60;
            this.target.framecount = 12;
        } else if (speed === "super-turbo") {
            this.target.framerate = 60;
            this.target.framecount = 6;
        }
    },
    onToggleTextDetails() {
        this.ui.showTextDetails = !this.ui.showTextDetails;
    },
    onToggleTargetDetails() {
        this.ui.showTargetDetails = !this.ui.showTargetDetails;
    },
    onChangeFile(e) {
        this.source.file.file = e.target.files[0];
    },
    render() {
        if (!this.baseImage) return;

        const offsetLeft = Math.floor(Number(this.target.offsetLeft));
        const offsetTop = Math.floor(Number(this.target.offsetTop));

        const cellWidth = EMOJI_SIZE / this.target.hZoom;
        const cellHeight = EMOJI_SIZE / this.target.vZoom;

        ga("send", "event", this.ui.mode, "render");

        const animated = (
            this.target.animation || this.target.effects.length || this.target.postEffects.length
        );
        const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
        this.resultImages = renderAllCells(
            this.baseImage,
            offsetLeft, offsetTop,
            this.target.hCells || 1, this.target.vCells || 1, cellWidth, cellHeight,
            maxSize, this.target.noCrop,
            animated, this.target.animation, this.target.animationInvert,
            this.target.effects.concat(this.target.staticEffects),
            this.target.postEffects, this.target.framerate, this.target.framecount,
            this.target.backgroundColor, this.target.transparent, BINARY_SIZE_LIMIT,
        );
    },
};

const vm = new Vue({
    el: "#app", data, methods, watch, computed,
});

window.onerror = (msg, file, line, col) => {
    ga("send", "event", "error", "thrown", `${file}:${line}:${col} ${msg}`);
};

const match = window.location.href.match(/\?([^=]+)(=(.*))?$/);
if (match) {
    if (match[1] === "test") {
        vm.ui.mode = "text";
        vm.ui.showTargetPanel = true;
        vm.source.text.content = "あ";
    } else if (match[1] === "mode") {
        vm.ui.mode = match[3];
    }
}

ga("send", "pageview", "/");
