function load_file () {
    var reader = new FileReader();
    reader.onload = function(e) { $("#JS_base-image").attr('src', e.target.result); };
    reader.readAsDataURL($("#JS_file")[0].files[0]);
}

function reload_file () {
    var url = $("#JS_url").val();
    if (url) {
        $("#JS_base-image").attr('src', url);
    } else {
        load_file();
    }
}

function crop_canvas (source_canvas, w, h) {
    var canvas    = document.createElement("canvas");
    var ctx       = canvas.getContext('2d');
    canvas.width  = w;
    canvas.height = h;

    ctx.drawImage(source_canvas, 0, 0, w, h, 0, 0, w, h);

    return canvas;
}

function generate_text_image () {
    var canvas_width = 1000;
    var canvas_height = 1000;

    var canvas = document.createElement("canvas");
    canvas.width = canvas_width;
    canvas.height = canvas_height;

    var ctx    = canvas.getContext('2d');
    var align  = $("#JS_text_align").val();

    ctx.fillStyle    = $("#JS_text_color").val();
    ctx.font         = $("#JS_text_font").val();
    ctx.textBaseline = "top";

    var lines       = $("#JS_text").val().split("\n");
    var line_widths = lines.map(function (line) { return ctx.measureText(line).width; });
    var line_height = ctx.measureText("あ").width; /* taken from tmlib.js */

    var img_width   = Math.ceil(Math.max.apply(null, line_widths));
    var img_height  = line_height * lines.length;

    var align_fn = align == "left" ? (
        function (width) { return 0; }
    ) : align == "right" ? (
        function (width) { return img_width - width; }
    ) : (
        function (width) { return (img_width - width) / 2; }
    );

    lines.forEach(function (line, ix) {
        ctx.fillText(line, align_fn(line_widths[ix]), ix * line_height);
    });

    $("#JS_base-image").attr('src', crop_canvas(canvas, img_width, img_height).toDataURL());
}

function compute_recomended_configuration () {
    var image    = $("#JS_base-image")[0];
    var v        = parseInt($("#JS_v").val());
    var h        = parseInt($("#JS_h").val());
    var trimming = $("#JS_trimming").val();

    var width_ratio  = (128.0 * h) / image.naturalWidth;
    var height_ratio = (128.0 * v) / image.naturalHeight;

    switch ($("#JS_trimming").val()) {
        case "cover":
            var zoom_ratio = Math.max(width_ratio, height_ratio);
            width_ratio = height_ratio = zoom_ratio;
            break;
        case "contain":
            var zoom_ratio = Math.min(width_ratio, height_ratio);
            width_ratio = height_ratio = zoom_ratio;
            break;
    }

    $("#JS_zoom_h").val(width_ratio + "");
    $("#JS_zoom_v").val(height_ratio + "");
    $("#JS_left").val((image.naturalWidth - 128 / width_ratio * h) / 2 + "");
    $("#JS_top").val(Math.min(0, (image.naturalHeight - 128 / height_ratio * v) / 2) + "");
    $("#JS_top").removeProp("checked");
}

function effect_kira (keyframe, ctx, cellWidth, cellHeight) {
    ctx.filter = "saturate(1000%) hue-rotate(" + (keyframe * 360) + "deg)";
}

function effect_blink (keyframe, ctx, cellWidth, cellHeight) {
    if (keyframe >= 0.5) {
        ctx.translate(- cellWidth * 2, 0); /* hide */
    }
}

function effect_patapata (keyframe, ctx, cellWidth, cellHeight) {
    ctx.transform(Math.cos(2 * Math.PI * keyframe), 0, 0, 1, cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0);
}

function effect_rotate (keyframe, ctx, cellWidth, cellHeight) {
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(Math.PI * 2 * keyframe);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
}

var last_gata = false;
function effect_gatagata (keyframe, ctx, cellWidth, cellHeight) {
    last_gata = !last_gata;
    ctx.translate(cellWidth / 2 + (Math.random() - 0.5) * 4, cellHeight / 2 + (Math.random() - 0.5) * 4);
    ctx.rotate(last_gata ? -0.05 : 0.05);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
}

function effect_zoom (keyframe, ctx, cellWidth, cellHeight) {
    var zoom = Math.abs(keyframe - 0.5) * 2 - 0.5;
    ctx.transform(1 + zoom, 0, 0, 1 + zoom, - cellWidth / 2 * zoom, - cellHeight / 2 * zoom);
}

function animation_scroll (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    offsetH = (offsetH + image.naturalWidth * keyframe) % image.naturalWidth;
    ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, cellWidth, cellHeight);
    if (offsetH + width > image.naturalWidth) {
        var endPos = (image.naturalWidth - offsetH) * (cellWidth / width);
        ctx.drawImage(image, 0, offsetV, width, height, endPos, 0, cellWidth, cellHeight);
    }
}

function animation_push (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    keyframe = keyframe > 0.75 ? (keyframe - 0.75) * 4 : 0;
    animation_scroll(keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight);
}

function render_result_cell (image, offsetH, offsetV, width, height, animation, effects, framerate, background) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    if (!animation && !effects.length) {
        var canvas_width = 128;
        var canvas_height = 128;

        canvas.width = canvas_width;
        canvas.height = canvas_height;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas_width, canvas_height);
        ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, canvas_width, canvas_height);

        return canvas.toDataURL();
    } else {
        var canvas_width = 64;
        var canvas_height = 64;
        canvas.width = canvas_width;
        canvas.height = canvas_height;

        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(framerate);
        encoder.start();
        for (var i = 0; i < 12; i++) {
            ctx.save();
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas_width, canvas_height);
            effects.forEach(function (effect) { effect(i / 12.0, ctx, canvas_width, canvas_height); });
            if (animation) {
                animation(i / 12.0, ctx, image, offsetH, offsetV, width, height, canvas_width, canvas_height);
            } else {
                ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, canvas_width, canvas_height);
            }
            ctx.restore();
            encoder.addFrame(ctx);
        }
        encoder.finish();

        return "data:image/gif;base64," + encode64(encoder.stream().getData());
    }
}

function render_results () {
    var image        = $("#JS_base-image")[0];
    var v            = parseInt($("#JS_v").val());
    var h            = parseInt($("#JS_h").val());
    var width_ratio  = parseFloat($("#JS_zoom_h").val());
    var height_ratio = parseFloat($("#JS_zoom_v").val());
    var left         = parseInt($("#JS_left").val());
    var top          = parseInt($("#JS_top").val());
    var framerate    = parseInt($("#JS_framerate").val());
    var animation    = window[$("#JS_animation").val()];
    var effects      = $(".JS_effect:checked").map(function () { return window[$(this).val()]; }).toArray();
    var background   = $("#JS_background_color").val();

    var cell_width = 128 / width_ratio;
    var cell_height = 128 / height_ratio;
    var $results = $("#JS_results");
    $results.html("");
    for (var y = 0; y < v; y++) {
        for (var x = 0; x < h; x++) {
            var url = render_result_cell(
                image,
                left + x * cell_width, top + y * cell_height,
                cell_width, cell_height,
                animation, effects, framerate, background
            );
            $results.append("<img width='128px' src='" + url +"'>");
        }
        $results.append("<br>");
    }
}

$(function() {
    $("#JS_file").change(load_file);
    $("#JS_reload").click(reload_file);
    $("#JS_generate").click(generate_text_image);
    $("#JS_base-image").bind('load', compute_recomended_configuration);
    $("#JS_h,#JS_v,#JS_trimming").change(compute_recomended_configuration);
    $("#JS_render").click(render_results);
    $("#JS_toggle_details").click(function () {
        $(this).remove();
        $("#JS_details").show();
    });
});
