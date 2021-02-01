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
