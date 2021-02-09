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
  const target = document.createElement('canvas');
  const ctx = target.getContext('2d');
  target.width = w;
  target.height = h;

  ctx.drawImage(source, left, top, w, h, 0, 0, w, h);

  return target;
}

/* drop transparent area from canvas and returns a new cropped canvas */
function shrinkCanvas(source) {
  const ctx = source.getContext('2d');
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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = w;
  canvas.height = h;

  let ix = 0;
  const img = document.createElement('img');

  img.onload = function () {
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
  reader.onload = function (e) { callback(e.target.result); };
  reader.readAsDataURL(path);
}

/* Create an img object, set src attr to the specified url, and return it. */
function urlToImg(url, cb) {
  const img = document.createElement('img');
  img.src = url;
  img.onload = function () {
    cb(img);
  };
}

/* compute binary size from a dataurl. return 0 if uncomputable. */
function dataurlSize(str) {
  const ix = str.indexOf(',');
  if (ix < 0) return 0;
  return Math.ceil((str.length - ix - 1) / 4.0 * 3);
}

/* ---- TEXT IMAGE GENERATOR */

/* Create a new canvas and render a single-line text. Returns the cropped canvas object. */
function makeTextImageSingleLine(line, color, font, fontHeight, outlineColor, gradient) {
  const canvas = document.createElement('canvas');
  canvas.width = fontHeight * (line.length || 1) * 2;
  canvas.height = fontHeight * 2;

  const ctx = canvas.getContext('2d');
  ctx.font = font;
  ctx.textBaseline = 'top';

  if (outlineColor) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 8;
    ctx.strokeText(line, 25, 25);
  }

  if (gradient.length) {
    const gradientObj = ctx.createLinearGradient(0, 0, 0, fontHeight + 50);
    gradient.forEach(function (colorStop) {
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
function makeTextImage(text, color, font, fontHeight, align, lineSpacing, outlineColor, gradient) {
  const images = text.split('\n').map(function (line) {
    return makeTextImageSingleLine(line, color, font, fontHeight, outlineColor, gradient);
  });
  const lineWidths  = images.map(function (canvas) { return canvas.width; })
  const maxWidth = Math.max.apply(null, lineWidths);
  const totalHeight = lineSpacing * (images.length - 1) + images.reduce(function (l, r) {
    return l + r.height;
  }, 0);

  const canvas = document.createElement('canvas');
  canvas.width = maxWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');

  let currentHeight = 0;
  images.forEach(function (image, ix) {
    ctx.save();

    if (align == 'right') {
      ctx.translate(maxWidth - lineWidths[ix], 0)
    } else if (align == 'center') {
      ctx.translate((maxWidth - lineWidths[ix]) / 2, 0);
    } else if (align == 'stretch') {
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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  /* use larger canvas, because some effects may translate the canvas */
  canvas.width = targetWidth * 2;
  canvas.height = targetHeight * 2;

  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, targetWidth * 2, targetHeight * 2);

  effects.forEach(function (effect) {
    effect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
  });
  if (animation) {
    animation(
      keyframe, ctx, image, offsetH, offsetV, width, height, targetWidth * 2, targetHeight * 2,
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
  postEffects.forEach(function (postEffect) {
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
      transparent ? 'rgba(0, 0, 0, 0)' : backgroundColor,
    );
    cells = noCrop ? (
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
        transparent ? '#ffffff' : backgroundColor,
      );
      const imgCells = noCrop ? (
        cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
      ) : (
        cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize, targetSize)
      );
      for (let y = 0; y < vCells; y += 1) {
        for (let x = 0; x < hCells; x += 1) {
          cells[y][x].addFrame(imgCells[y][x].getContext('2d'));
        }
      }
    }
    return cells.map(function (row) {
      return row.map(function (cell) {
        cell.finish();
        return `data:image/gif;base64,${encode64(cell.stream().getData())}`;
      });
    });
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
    const shouldRetry = ret.some(function (row) {
      return row.some(function (cell) {
        return dataurlSize(cell) >= binarySizeLimit;
      });
    });
    if (shouldRetry) {
      targetSize = Math.floor(targetSize * 0.9);
    } else {
      return ret;
    }
  }
}

const store = {
  baseImage: null,
  resultImages: [['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB0UlEQVR4Xu3UAQ0AAAyDsM+/6QspcwAh2zXawGj64K8A8AgKoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7ADyAB6SPAIFm19U7AAAAAElFTkSuQmCC']],
  resultBgClass: 'default',
  /* ui */
  ui: {
    mode: 'text',
    showTargetPanel: false,
    fukumojiTab: 'base',
    showTextDetails: false,
    showTargetDetails: false,
  },
  /* form inputs */
  source: {
    file: {
      file: null,
      filter: '',
    },
    text: {
      /* basic */
      content: '',
      align: 'left',
      color: '#ffbf00',
      gradient: [],
      outline: '',
      font: 'normal sans-serif',
      /* advanced */
      lineSpacing: 0.05,
    },
    fukumoji: {
      base: 'assets/void.svg',
      textures: 'assets/void.svg',
      eyes: 'assets/void.svg',
      mouths: 'assets/void.svg',
      others: 'assets/void.svg',
    },
  },
  target: {
    /* basic */
    trimming: '',
    hCells: 1,
    vCells: 1,
    animation: '',
    animationInvert: false,
    staticEffects: [],
    effects: [],
    postEffects: [],
    /* advanced */
    offsetLeft: 0,
    offsetTop: 0,
    hZoom: '1.0',
    vZoom: '1.0',
    noCrop: false,
    framerate: 18,
    framecount: 12,
    backgroundColor: '#ffffff',
    transparent: false,
  },
};

const watch = {
  baseImage: function () {
    vm.refreshDefaultSettings();
    vm.render();
  },
  'source.file': {
    handler: function () {
      vm.loadFile();
    },
    deep: true,
  },
  'source.text': {
    handler: function () {
      vm.renderText();
    },
    deep: true,
  },
  'source.text.color': function () {
    vm.source.text.gradient = [];
  },
  'source.fukumoji': {
    handler: function () {
      vm.renderFukumoji();
    },
    deep: true,
  },
  target: {
    handler: function () {
      vm.render();
    },
    deep: true,
  },
};

const computed = {
  outlineColor: function () {
    const { color } = vm.source.text;
    if (vm.source.text.outline == 'lighter') {
      return lighterColor(color);
    } else if (vm.source.text.outline == 'darker') {
      return darkerColor(color);
    } else {
      return vm.source.text.outline;
    }
  },
};

const methods = {
  loadFile: function () {
    if (vm.source.file.file) {
      loadFileAsBlobURL(vm.source.file.file, function (blobUrl) {
        urlToImg(blobUrl, function (img) {
          if (vm.source.file.filter) {
            urlToImg(vm.source.file.filter(img), function (img) {
              vm.baseImage = img;
            });
          } else {
            vm.baseImage = img;
          }
        });
      });
    }
  },
  renderText: function () {
    if (vm.source.text.content || vm.baseImage) {
      const blobUrl = makeTextImage(
        vm.source.text.content,
        vm.source.text.color,
        vm.source.text.font.replace(/^([^ ]+)/, `$1 ${EMOJI_SIZE}px`),
        EMOJI_SIZE,
        vm.source.text.align,
        vm.source.text.lineSpacing * EMOJI_SIZE,
        vm.outlineColor, vm.source.text.gradient,
      );
      urlToImg(blobUrl, function (img) { vm.baseImage = img; });
    }
  },
  renderFukumoji: function () {
    mergeImages(128, 128, [
      vm.source.fukumoji.base,
      vm.source.fukumoji.textures,
      vm.source.fukumoji.mouths,
      vm.source.fukumoji.eyes,
      vm.source.fukumoji.others,
    ], function (blobUrl) {
      urlToImg(blobUrl, function (img) {
        vm.baseImage = img;
      });
    });
  },
  initializeGradient: function () {
    vm.source.text.gradient = [
      { color: '#ffffff', pos: 0 },
      { color: vm.source.text.color, pos: 45 },
      { color: lighterColor(vm.source.text.color), pos: 55 },
      { color: darkerColor(vm.source.text.color), pos: 65 },
    ];
  },
  addGradientColorStop: function () {
    vm.source.text.gradient.push({
      color: vm.source.text.color,
      pos: 50,
    });
  },
  removeGradientColorStop: function (ix) {
    vm.source.text.gradient.splice(ix, 1);
  },
  refreshDefaultSettings: function () {
    const image = vm.baseImage;
    const v = vm.target.vCells;
    const h = vm.target.hCells;
    let widthRatio = (EMOJI_SIZE * h) / image.naturalWidth;
    let heightRatio = (EMOJI_SIZE * v) / image.naturalHeight;

    if (vm.target.trimming == 'cover') {
      widthRatio = heightRatio = Math.max(widthRatio, heightRatio);
    } else if (vm.target.trimming == 'contain') {
      widthRatio = heightRatio = Math.min(widthRatio, heightRatio);
    }

    vm.target.hZoom = `${widthRatio}`;
    vm.target.vZoom = `${heightRatio}`;
    vm.target.offsetLeft = `${(image.naturalWidth - EMOJI_SIZE / widthRatio * h) / 2}`;
    vm.target.offsetTop = `${Math.min(0, (image.naturalHeight - EMOJI_SIZE / heightRatio * v) / 2)}`;
  },
  onSetShowTarget: function (value) {
    vm.ui.showTargetPanel = value;
    ga('send', 'pageview', value ? '/target' : (`/${vm.ui.mode}`));
  },
  onSelectMode: function (value) {
    vm.ui.mode = value;
    vm.ui.showTargetPanel = false;
    ga('send', 'pageview', `/${value}`);
  },
  onSelectFukumojiTab: function (value) {
    vm.ui.fukumojiTab = value;
  },
  onSelectFukumojiPart: function (key, value) {
    vm.source.fukumoji[key] = value;
  },
  onSelectSpeedPreset: function (e) {
    const speed = e.target.value;
    if (speed == '') {
      vm.target.framerate = 18;
      vm.target.framecount = 12;
    } else if (speed == 'turbo') {
      vm.target.framerate = 60;
      vm.target.framecount = 12;
    } else if (speed == 'super-turbo') {
      vm.target.framerate = 60;
      vm.target.framecount = 6;
    }
  },
  onToggleTextDetails: function () {
    vm.ui.showTextDetails = !vm.ui.showTextDetails;
  },
  onToggleTargetDetails: function () {
    vm.ui.showTargetDetails = !vm.ui.showTargetDetails;
  },
  onChangeFile: function (e) {
    vm.source.file.file = e.target.files[0];
  },
  render: function () {
    if (!vm.baseImage) return;

    const offsetLeft = Math.floor(Number(vm.target.offsetLeft));
    const offsetTop = Math.floor(Number(vm.target.offsetTop));

    const cellWidth = EMOJI_SIZE / vm.target.hZoom;
    const cellHeight = EMOJI_SIZE / vm.target.vZoom;

    ga('send', 'event', vm.ui.mode, 'render');

    const animated = (
      vm.target.animation || vm.target.effects.length || vm.target.postEffects.length
    );
    const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
    vm.resultImages = renderAllCells(
      vm.baseImage,
      offsetLeft, offsetTop,
      vm.target.hCells, vm.target.vCells, cellWidth, cellHeight,
      maxSize, vm.target.noCrop,
      animated, vm.target.animation, vm.target.animationInvert,
      vm.target.effects.concat(vm.target.staticEffects),
      vm.target.postEffects, vm.target.framerate, vm.target.framecount,
      vm.target.backgroundColor, vm.target.transparent, BINARY_SIZE_LIMIT,
    );
  },
};

var vm = new Vue({ el: '#app', data: store, methods: methods, watch: watch, computed: computed });

window.onerror = function (msg, file, line, col) {
  ga('send', 'event', 'error', 'thrown', `${file}:${line}:${col} ${msg}`);
};

!function () {
  const match = location.href.match(/\?([^=]+)(=(.*))?$/);
  if (match) {
    if (match[1] == 'test') {
      vm.ui.mode = 'text';
      vm.ui.showTargetPanel = true;
      vm.source.text.content = 'あ';
    } else if (match[1] == 'mode') {
      vm.ui.mode = match[3];
    }
  }
  ga('send', 'pageview', '/');
}();
