function load_file () {
    var reader = new FileReader();
    reader.onload = function(e) { $("#JS_base-image").attr('src', e.target.result); };
    reader.readAsDataURL($("#JS_file")[0].files[0]);
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
    var canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;

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

function animation_kira (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    ctx.filter = "saturate(1000%) hue-rotate(" + (keyframe * 360) + "deg)";
    ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, cellWidth, cellHeight);
}

function animation_scroll (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    offsetH = (offsetH + image.naturalWidth * keyframe) % image.naturalWidth;
    ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, cellWidth, cellHeight);
    if (offsetH + width > image.naturalWidth) {
        var endPos = (image.naturalWidth - offsetH) * (cellWidth / width);
        ctx.drawImage(image, 0, offsetV, width, height, endPos, 0, cellWidth, cellHeight);
    }
}

function animation_rotate (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    ctx.save();
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(Math.PI * 2 * keyframe);
    ctx.drawImage(image, offsetH, offsetV, width, height, - cellWidth / 2, - cellHeight / 2, cellWidth, cellHeight);
    ctx.restore();
}

var last_gata = false;
function animation_gatagata (keyframe, ctx, image, offsetH, offsetV, width, height, cellWidth, cellHeight) {
    last_gata = !last_gata;
    ctx.save();
    ctx.translate(cellWidth / 2 + (Math.random() - 0.5) * 2, cellHeight / 2 + (Math.random() - 0.5) * 2);
    ctx.rotate(last_gata ? -0.05 : 0.05);
    ctx.drawImage(image, offsetH, offsetV, width, height, - cellWidth / 2, - cellHeight / 2, cellWidth, cellHeight);
    ctx.restore();
}

function render_result_cell (image, offsetH, offsetV, width, height, animation) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    if (!animation) {
        canvas.width = 128;
        canvas.height = 128;

        ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, 128, 128);

        return canvas.toDataURL();
    } else {
        canvas.width = 64;
        canvas.height = 64;

        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(20);
        encoder.start();
        for (var i = 0; i < 12; i++) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 64, 64);
            animation(i / 12.0, ctx, image, offsetH, offsetV, width, height, 64, 64);
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
    var animation    = $("#JS_animation").val();

    animation = window[animation];

    var cell_width = 128 / width_ratio;
    var cell_height = 128 / height_ratio;
    var $results = $("#JS_results");
    $results.html("");
    for (var y = 0; y < v; y++) {
        for (var x = 0; x < h; x++) {
            var url = render_result_cell(
                image, left + x * cell_width, top + y * cell_height, cell_width, cell_height, animation
            );
            $results.append("<img width='128px' src='" + url +"'>");
        }
        $results.append("<br>");
    }
}

$(function() {
    $("#JS_file").change(load_file);
    $("#JS_generate").click(generate_text_image);
    $("#JS_base-image").bind('load', compute_recomended_configuration);
    $("#JS_h,#JS_v,#JS_trimming").change(compute_recomended_configuration);
    $("#JS_render").click(render_results);
    $("#JS_toggle_details").click(function () {
        $(this).remove();
        $("#JS_details").show();
    });
});
