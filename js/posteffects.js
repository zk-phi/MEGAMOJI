/** the idea based on https://qiita.com/nekoneko-wanwan/items/0911a59bf835d5b9e35a */
function postEffectFocusLine (keyframe, ctx, w, h) {
    var circumPos = function (deg, r) {
        return {
            x: Math.cos(Math.PI / 180 * deg) * r + w / 2,
            y: Math.sin(Math.PI / 180 * deg) * r + h / 2
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
        ctx.lineTo(pos2.x,  pos2.y);
        ctx.lineTo(pos3.x,   pos3.y);
        ctx.fill();
        ctx.closePath();
    }
}

/** ideas based on https://qiita.com/uriuriuriu/items/7be0ed117ab8ae3e7f79 */
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
