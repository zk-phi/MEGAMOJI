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

function animationEkken (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe < 0.5 ? 1 : (keyframe - 0.5) * 2;
    var size        = 1.0 * keyframe + 0.5 * (1 - keyframe);
    var ekkenOffset = cellWidth / 2 * keyframe;
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth * (2 - size) / 4, cellHeight * (2 - size) / 4, cellWidth / 2 * size, cellHeight / 2 * size);
    ctx.drawImage(image, offsetH, offsetV, width / 2, height, - ekkenOffset / 2, cellHeight / 4, cellWidth / 4, cellHeight / 2);
    ctx.drawImage(image, offsetH, offsetV, width / 2, height, - ekkenOffset / 2 + cellWidth / 4, cellHeight / 4, cellWidth / 4, cellHeight / 2);
    ctx.drawImage(image, offsetH + width / 2, offsetV, width / 2, height, cellWidth / 2 + ekkenOffset / 2, cellHeight / 4, cellWidth / 4, cellHeight / 2);
    ctx.drawImage(image, offsetH + width / 2, offsetV, width / 2, height, cellWidth * 3 / 4 + ekkenOffset / 2, cellHeight / 4, cellWidth / 4, cellHeight / 2);
}

function animationEkkenVertical (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe < 0.5 ? 1 : (keyframe - 0.5) * 2;
    var size        = 1.0 * keyframe + 0.5 * (1 - keyframe);
    var ekkenOffset = cellHeight / 2 * keyframe;
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth * (2 - size) / 4, cellHeight * (2 - size) / 4, cellWidth * size / 2, cellHeight * size / 2);
    ctx.drawImage(image, offsetH, offsetV, width, height / 2, cellWidth / 4, - ekkenOffset / 2, cellWidth / 2, cellHeight / 4);
    ctx.drawImage(image, offsetH, offsetV, width, height / 2, cellWidth / 4, cellWidth / 4 - ekkenOffset / 2, cellWidth / 2, cellHeight / 4);
    ctx.drawImage(image, offsetH, offsetV + height / 2, width, height / 2, cellWidth / 4, cellHeight / 2 + ekkenOffset / 2, cellWidth / 2, cellHeight / 4);
    ctx.drawImage(image, offsetH, offsetV + height / 2, width, height / 2, cellWidth / 4, cellHeight * 3 / 4 + ekkenOffset / 2, cellWidth / 2, cellHeight / 4);
}

function animationKanpai (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    var size = 0.35 + 0.25 * Math.cos(2 * Math.PI * keyframe); /* 0 ~ 0.6 */
    _flipContext(ctx, cellWidth);
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth / 2 * (1.5 - size), cellHeight / 4, cellWidth / 2, cellHeight / 2);
    _flipContext(ctx, cellWidth);
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth / 2 * (1.5 - size), cellHeight / 4, cellWidth / 2, cellHeight / 2);
}

function animationKanpaiLefty (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    var size = 0.35 + 0.25 * Math.cos(2 * Math.PI * keyframe); /* 0 ~ 0.6 */
    _flipContext(ctx, cellWidth);
    ctx.drawImage(image, offsetH, offsetV, width, height, - cellWidth / 2 * (0.5 - size), cellHeight / 4, cellWidth / 2, cellHeight / 2);
    _flipContext(ctx, cellWidth);
    ctx.drawImage(image, offsetH, offsetV, width, height, - cellWidth / 2 * (0.5 - size), cellHeight / 4, cellWidth / 2, cellHeight / 2);
}

function animationScrollHorizontal (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    ctx.drawImage(image, offsetH, offsetV, width, height, - cellWidth / 2 * keyframe, cellHeight / 4, cellWidth / 2, cellHeight / 2);
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth / 2 - cellWidth / 2 * keyframe, cellHeight / 4, cellWidth / 2, cellHeight / 2);
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth - cellWidth / 2 * keyframe, cellHeight / 4, cellWidth / 2, cellHeight / 2);
}

function animationScrollVertical (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth / 4, - cellHeight / 2 * keyframe, cellWidth / 2, cellHeight / 2);
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth / 4, cellHeight / 2 - cellHeight / 2 * keyframe, cellWidth / 2, cellHeight / 2);
    ctx.drawImage(image, offsetH, offsetV, width, height, cellWidth / 4, cellHeight - cellHeight / 2 * keyframe, cellWidth / 2, cellHeight / 2);
}

function animationPushHorizontal (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    /*   push: 0 0.5   0.5   1.0
     * scroll: 0 0.125 0.875 1.0 */
    keyframe = keyframe < 0.125 ? (
        keyframe * 4
    ) : keyframe < 0.875 ? (
        0.5
    ) : (
        (keyframe - 0.875) * 4 + 0.5
    );
    animationScrollHorizontal(keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight);
}

function animationPushVertical (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe < 0.125 ? (
        keyframe * 4
    ) : keyframe < 0.875 ? (
        0.5
    ) : (
        (keyframe - 0.875) * 4 + 0.5
    );
    animationScrollVertical(keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight);
}

function animationXile (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    for (var i = 0; i < 3; i++) {
        var x = Math.cos(Math.PI * 2 * (keyframe + i * 0.2)) * 0.3 * cellWidth / 2 + cellWidth / 4;
        var y = Math.sin(Math.PI * 2 * (keyframe + i * 0.2)) * 0.3 * cellHeight / 2 + cellHeight / 4;
        ctx.drawImage(image, offsetH, offsetV, width, height, x, y, cellWidth / 2 * 0.8, cellHeight / 2 * 0.8);
    }
}
