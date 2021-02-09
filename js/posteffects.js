// eslint-disable-next-line no-unused-vars
var POST_EFFECTS = [
  {
    label: 'エフェクト',
    effects: [
      { label: '集中線', fn: postEffectFocusLine },
      { label: 'グリッチ', fn: postEffectGlitch },
      { label: 'モザイク', fn: postEffectMosaic },
    ],
  },
];

/** the idea based on https://qiita.com/nekoneko-wanwan/items/0911a59bf835d5b9e35a */
function postEffectFocusLine (keyframe, ctx, w, h) {
  var circumPos = function (deg, r) {
    return {
      x: Math.cos(Math.PI / 180 * deg) * r + w / 2,
      y: Math.sin(Math.PI / 180 * deg) * r + h / 2,
    };
  }

  var outerRadius = Math.sqrt(Math.pow(w / 4, 2) + Math.pow(h / 4, 2));
  var innerRadiusMin = outerRadius * 0.6;
  var innerRadiusMax = outerRadius * 0.8;

  for (var i = 0; i < 200; i++) {
    var deg1 = Math.random() * 360;
    var deg2 = deg1 + Math.random() * 1.2;
    var innerRadius = Math.random() * (innerRadiusMax - innerRadiusMin) + innerRadiusMin;
    var pos1 = circumPos(deg1, outerRadius);
    var pos2 = circumPos(deg2, outerRadius);
    var pos3 = circumPos((deg1 + deg2) / 2, innerRadius);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = 'black';
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.lineTo(pos3.x, pos3.y);
    ctx.fill();
    ctx.closePath();
  }
}

/** the ideas based on https://qiita.com/uriuriuriu/items/7be0ed117ab8ae3e7f79 */
function postEffectGlitch (keyframe, ctx, w, h) {
  // wave
  !function () {
    var lineThickness = h / 25;
    var x = (h / 2 + lineThickness) * keyframe + h / 4 - lineThickness;
    var image = ctx.getImageData(0, x + lineThickness, w, lineThickness);
    ctx.putImageData(image, 0, x);
  }();

  // random fill
  !function () {
    for (var i = 0; i < 3; i++) {
      var glitchH = 14 * Math.random() + 1;
      var glitchW = (w / 2 - 1) * Math.random() * 0.7 + 1;
      var glitchX1 = w / 4 + (w / 2 - glitchW) * Math.random();
      var glitchX2 = Math.random() < 0.5 ? w / 4 : 3 * w / 4 - glitchW;
      var glitchY = h / 4 + (h / 2 - glitchH) * Math.random();
      var image = ctx.getImageData(glitchX1, glitchY, glitchW, glitchH);
      ctx.putImageData(image, glitchX2, glitchY);
    }
  }();

  // slip
  !function () {
    for (var y = h / 4; y < 3 * h / 4; y++) {
      if (Math.random() < 0.2) y++;
      var image = ctx.getImageData(0, y, w, 1);
      ctx.putImageData(image, Math.random() * 6 - 3, y);
    }
  }();
}

function postEffectMosaic (keyframe, ctx, w, h) {
  var image = ctx.getImageData(0, 0, w, h);
  var data = image.data;

  var cellSize = Math.floor(Math.min(w, h) / 16);
  var cellCountH = Math.ceil(w / cellSize + 1);
  var cellCountV = Math.ceil(h / cellSize + 1);
  var offsetX = Math.floor(w / 4 - cellSize + cellSize * keyframe);
  var offsetY = Math.floor(h / 4 - cellSize + cellSize * keyframe);

  for (var cellX = 0; cellX < cellCountH; cellX++) {
    for (var cellY = 0; cellY < cellCountV; cellY++) {
      var cellColor = [0, 0, 0];
      var x = offsetX + cellX * cellSize;
      var y = offsetY + cellY * cellSize;
      for (var dx = 0; dx < cellSize; dx++) {
        for (var dy = 0; dy < cellSize; dy++) {
          var ix = (y + dy) * w + x + dx;
          cellColor[0] += data[ix * 4 + 0];
          cellColor[1] += data[ix * 4 + 1];
          cellColor[2] += data[ix * 4 + 2];
        }
      }

      cellColor[0] /= cellSize * cellSize;
      cellColor[1] /= cellSize * cellSize;
      cellColor[2] /= cellSize * cellSize;
      for (dx = 0; dx < cellSize; dx++) {
        for (dy = 0; dy < cellSize; dy++) {
          ix = (y + dy) * w + x + dx;
          data[ix * 4 + 0] = cellColor[0];
          data[ix * 4 + 1] = cellColor[1];
          data[ix * 4 + 2] = cellColor[2];
        }
      }
    }
  }

  ctx.putImageData(image, 0, 0);
}
