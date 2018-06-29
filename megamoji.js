var TEXT_CANVAS_SIZE    = 1000; /* a sufficiently large number */
var EMOJI_SIZE          = 128;
var ANIMATED_EMOJI_SIZE = 64;
var ANIMATION_FRAMES    = 12;

function load_file () {
    var reader = new FileReader();
    reader.onload = function(e) { $("#JS_base-image").attr('src', e.target.result); };
    reader.readAsDataURL($("#JS_file")[0].files[0]);
}

function reload_file () {
    var url    = $("#JS_url").val();
    var filter = window[$("#JS_filter").val()];

    if (url) {
        $("#JS_base-image").attr('src', url);
        if (filter) filter();
    } else {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#JS_base-image").attr('src', e.target.result);
            if (filter) filter();
        };
        reader.readAsDataURL($("#JS_file")[0].files[0]);
    }
}

function filter_chromakey () {
    var image  = $("#JS_base-image")[0];
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
    $("#JS_base-image").attr('src', canvas.toDataURL("image/png"));
}

function crop_canvas (source_canvas, w, h) {
    var canvas    = document.createElement("canvas");
    var ctx       = canvas.getContext('2d');
    canvas.width  = w;
    canvas.height = h;

    ctx.drawImage(source_canvas, 0, 0, w, h, 0, 0, w, h);

    return canvas;
}

function generate_text_image (text, color, font, align) {
    var canvas = document.createElement("canvas");
    canvas.width  = TEXT_CANVAS_SIZE;
    canvas.height = TEXT_CANVAS_SIZE;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle    = color;
    ctx.font         = font;
    ctx.textBaseline = "top";

    var lines       = text.split("\n");
    var line_widths = lines.map(function (line) { return ctx.measureText(line).width; });
    var total_width = Math.ceil(Math.max.apply(null, line_widths));

    var current_total_height = 0;
    lines.forEach(function (line, ix) {
        ctx.save();
        if (align == "right") {
            ctx.translate(total_width - line_widths[ix], 0)
        } else if (align == "center") {
            ctx.translate((total_width - line_widths[ix]) / 2, 0);
        } else if (align == "stretch") {
            ctx.transform(total_width / line_widths[ix], 0, 0, 1, 0, 0);
        }

        ctx.fillText(line, 0, current_total_height);
        ctx.restore();

        /* measure total height */
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (var row = current_total_height; row < canvas.height; row++) {
            for (var column = 0; column < canvas.width; column++) {
                if (data[(row * canvas.width + column) * 4 + 3]) {
                    current_total_height = row;
                    break;
                }
            }
        }
    });

    return crop_canvas(canvas, total_width, current_total_height).toDataURL();
}

function compute_recomended_configuration () {
    var image    = $("#JS_base-image")[0];
    var v        = parseInt($("#JS_v").val());
    var h        = parseInt($("#JS_h").val());
    var trimming = $("#JS_trimming").val();

    var width_ratio  = (EMOJI_SIZE * h) / image.naturalWidth;
    var height_ratio = (EMOJI_SIZE * v) / image.naturalHeight;

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
    $("#JS_left").val((image.naturalWidth - EMOJI_SIZE / width_ratio * h) / 2 + "");
    $("#JS_top").val(Math.min(0, (image.naturalHeight - EMOJI_SIZE / height_ratio * v) / 2) + "");
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

function effect_pyon (keyframe, ctx, cellWidth, cellHeight) {
    var resistance = 1.7; // バウンド時の強さ
    var y
    if(keyframe > 0.7) {
        y = - Math.abs(Math.cos(2 * Math.PI * keyframe)) * (cellHeight / 3)
    } else {
        y = - Math.abs(Math.cos(2 * Math.PI * keyframe)) * (cellHeight / 3) * Math.exp(-keyframe * resistance)
    }
    ctx.transform(1, 0, 0, 1, 0, y + cellHeight / 15);
}

function effect_shadow (keyframe, ctx, cellWidth, cellHeight) {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = 7;
    ctx.shadowOffsetX = 7;
}
function effect_natural_blur (keyframe, ctx, cellWidth, cellHeight) {
    var hsv_color = hsvToRgb(0, 0, keyframe)
    ctx.shadowColor = `rgb(${hsv_color[0]}, ${hsv_color[1]}, ${hsv_color[2]})`;
    ctx.shadowBlur = 50*keyframe;
}
function effect_neon(keyframe, ctx, cellWidth, cellHeight) {
    var hsv_color = hsvToRgb(keyframe*360*4%360, 1, 1)
    ctx.shadowColor = `rgb(${hsv_color[0]}, ${hsv_color[1]}, ${hsv_color[2]})`;
    ctx.shadowBlur = 10;
}
function effect_aurora_blur(keyframe, ctx, cellWidth, cellHeight) {
    var hsv_color = hsvToRgb(keyframe*360, 1, 1)
    ctx.shadowColor = `rgb(${hsv_color[0]}, ${hsv_color[1]}, ${hsv_color[2]})`;
    ctx.shadowBlur = 50*keyframe;
}
function effect_shadow_rotate (keyframe, ctx, cellWidth, cellHeight) {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe)*5;
    ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe)*5;
}
function effect_patapata (keyframe, ctx, cellWidth, cellHeight) {
    ctx.transform(Math.cos(2 * Math.PI * keyframe), 0, 0, 1, cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0);
}

function effect_sidetoside (keyframe, ctx, cellWidth, cellHeight) {
    ctx.transform(1, 0, 0, 1, cellWidth * Math.sin(2 * Math.PI * keyframe), 0);
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

function effect_yatta (keyframe, ctx, cellWidth, cellHeight) {
    if (keyframe >= 0.5) {
        ctx.transform(-1, 0, 0, 1, cellWidth, 0);
    }
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(0.1);
    ctx.translate(- cellWidth / 2, - cellHeight / 2);
    ctx.translate(0, cellHeight / 8 * Math.sin(8 * Math.PI * keyframe));
}

function effect_poyon (keyframe, ctx, cellWidth, cellHeight) {
    if (keyframe < 0.6) {
        ctx.translate(0, - cellHeight / 3 * Math.sin(Math.PI * keyframe / 0.6));
    } else {
        var ratio = Math.sin(Math.PI * (keyframe - 0.6) / 0.4) / 2;
        ctx.transform(1 + ratio, 0, 0, 1 - ratio, - ratio * cellWidth / 2, ratio * cellHeight);
    }
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
        canvas.width = EMOJI_SIZE;
        canvas.height = EMOJI_SIZE;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
        ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, EMOJI_SIZE, EMOJI_SIZE);

        return canvas.toDataURL();
    } else {
        canvas.width = ANIMATED_EMOJI_SIZE;
        canvas.height = ANIMATED_EMOJI_SIZE;

        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(framerate);
        encoder.start();
        for (var i = 0; i < ANIMATION_FRAMES; i++) {
            ctx.save();
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, ANIMATED_EMOJI_SIZE, ANIMATED_EMOJI_SIZE);
            effects.forEach(function (effect) { effect(i / ANIMATION_FRAMES, ctx, ANIMATED_EMOJI_SIZE, ANIMATED_EMOJI_SIZE); });
            if (animation) {
                animation(i / ANIMATION_FRAMES, ctx, image, offsetH, offsetV, width, height, ANIMATED_EMOJI_SIZE, ANIMATED_EMOJI_SIZE);
            } else {
                ctx.drawImage(image, offsetH, offsetV, width, height, 0, 0, ANIMATED_EMOJI_SIZE, ANIMATED_EMOJI_SIZE);
            }
            ctx.restore();
            encoder.addFrame(ctx);
        }
        encoder.finish();

        return "data:image/gif;base64," + encode64(encoder.stream().getData());
    }
}

//from https://qiita.com/hachisukansw/items/633d1bf6baf008e82847
function hsvToRgb(H,S,V) {
    //https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

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

    var cell_width = EMOJI_SIZE / width_ratio;
    var cell_height = EMOJI_SIZE / height_ratio;
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
            $results.append("<img width='" + EMOJI_SIZE + "px' src='" + url +"'>");
        }
        $results.append("<br>");
    }
}

$(function() {
    $("#JS_file").change(load_file);
    $("#JS_file,#JS_url").change(function () { $("#JS_filter").val(""); });
    $("#JS_reload").click(reload_file);
    $("#JS_generate").click(function () {
        $("#JS_base-image").attr('src', generate_text_image(
            $("#JS_text").val(),
            $("#JS_text_color").val(),
            $("#JS_text_font").val(),
            $("#JS_text_align").val()
        ));
    });
    $("#JS_base-image").bind('load', compute_recomended_configuration);
    $("#JS_h,#JS_v,#JS_trimming").change(compute_recomended_configuration);
    $("#JS_render").click(render_results);
    $("#JS_open_details").click(function () { $(this).hide(); $("#JS_details").show(); });
    $("#JS_close_details").click(function () { $("#JS_open_details").show(); $("#JS_details").hide(); });
    $("#JS_open_image_details").click(function () { $(this).hide(); $("#JS_image_details").show(); });
    $("#JS_close_image_details").click(function () { $("#JS_open_image_details").show(); $("#JS_image_details").hide(); });
});
