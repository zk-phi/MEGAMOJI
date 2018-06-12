function load_file () {
    var reader = new FileReader();
    reader.onload = function(e) { $("#JS_base-image").attr('src', e.target.result); };
    reader.readAsDataURL($("#JS_file")[0].files[0]);
}

function compute_recomended_configuration () {
    var image = $("#JS_base-image")[0];
    var v     = parseInt($("#JS_v").val());
    var h     = parseInt($("#JS_h").val());

    var zoom_ratio = Math.min(
        image.naturalHeight / (128.0 * v),
        image.naturalWidth / (128.0 * h)
    );

    var cell_size = 128 * zoom_ratio;

    $("#JS_zoom").val(zoom_ratio + "");
    $("#JS_left").val((image.naturalWidth - cell_size * h) / 2 + "");
    $("#JS_top").val(0);
    $("#JS_top").removeProp("checked");
}

function render_result_cell (image, trimLeft, trimRight, width, height, kira) {
    var canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    var ctx = canvas.getContext('2d');

    if (!kira) {
        ctx.drawImage(image, trimLeft, trimRight, width, height, 0, 0, 128, 128);
        return canvas.toDataURL();
    } else {
        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(30);
        encoder.start();

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 64, 64);
        for (var i = 0; i < 15; i++) {
            ctx.filter = "saturate(1000%) hue-rotate(" + (i * 24) + "deg)";
            ctx.drawImage(image, trimLeft, trimRight, width, height, 0, 0, 64, 64);
            encoder.addFrame(ctx);
        }

        encoder.finish();
        return "data:image/gif;base64," + encode64(encoder.stream().getData());
    }
}

function render_results () {
    var image      = $("#JS_base-image")[0];
    var v          = parseInt($("#JS_v").val());
    var h          = parseInt($("#JS_h").val());
    var zoom_ratio = parseFloat($("#JS_zoom").val());
    var left       = parseInt($("#JS_left").val());
    var top        = parseInt($("#JS_top").val());
    var kirality   = $("#JS_kira").prop("checked");

    var cell_size = 128 * zoom_ratio;
    var $results = $("#JS_results");
    $results.html("");
    for (var y = 0; y < v; y++) {
        for (var x = 0; x < h; x++) {
            var url = render_result_cell(
                image, left + x * cell_size, top + y * cell_size, cell_size, cell_size, kirality
            );
            $results.append("<img width='128px' src='" + url +"'>");
        }
        $results.append("<br>");
    }
}

$(function() {
    $("#JS_file").change(load_file);
    $("#JS_base-image").bind('load', compute_recomended_configuration);
    $("#JS_h,#JS_v").change(compute_recomended_configuration);
    $("#JS_render").click(render_results);
    $("#JS_render").click(render_results);
    $("#JS_toggle_details").click(function () {
        $(this).remove();
        $("#JS_details").show();
    });
});
