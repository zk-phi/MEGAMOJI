function update_preview () {
    var reader = new FileReader();
    reader.onload = function(e) { $("#preview").attr('src', e.target.result); };
    reader.readAsDataURL($("#file")[0].files[0]);
}

function update_default_configuration () {
    var image = $("#preview")[0];
    var v     = parseInt($("#v").val());
    var h     = parseInt($("#h").val());

    var zoom_ratio = Math.min(
        image.naturalHeight / (128.0 * v),
        image.naturalWidth / (128.0 * h)
    );

    var cell_size = 128 * zoom_ratio;

    $("#zoom").val(zoom_ratio + "");
    $("#left").val((image.naturalWidth - cell_size * h) / 2 + "");
    $("#top").val(0);
    $("#top").removeProp("checked");
}

function render_cell (image, trimLeft, trimRight, width, height, kira) {
    var canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    var ctx = canvas.getContext('2d');

    if (!kira) {
        ctx.drawImage(image, trimLeft, trimRight, width, height, 0, 0, 128, 128);
        return canvas.toDataURL();
    } else {
        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(14);
        encoder.start();

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 128, 128);
        for (var i = 0; i < 7; i++) {
            ctx.filter = "saturate(1000%) hue-rotate(" + (i * 102) + "deg)";
            ctx.drawImage(image, trimLeft, trimRight, width, height, 0, 0, 128, 128);
            encoder.addFrame(ctx);
        }

        encoder.finish();
        return "data:image/gif;base64," + encode64(encoder.stream().getData());
    }
}

function render_result () {
    var image      = $("#preview")[0];
    var v          = parseInt($("#v").val());
    var h          = parseInt($("#h").val());
    var zoom_ratio = parseFloat($("#zoom").val());
    var left       = parseInt($("#left").val());
    var top        = parseInt($("#top").val());
    var kirality   = $("#kira").prop("checked");

    var cell_size = 128 * zoom_ratio;
    var $result_area = $("#result-area");
    $result_area.html("");
    for (var y = 0; y < v; y++) {
        for (var x = 0; x < h; x++) {
            var url = render_cell(
                image, left + x * cell_size, top + y * cell_size, cell_size, cell_size, kirality
            );
            $result_area.append("<img src='" + url +"'>&nbsp;");
        }
        $result_area.append("<br>");
    }
}

$(function() {
    $("#file").change(update_preview);
    $("#preview").bind('load', update_default_configuration);
    $("#h,#v").change(update_default_configuration);
    $("#render").click(render_result);
    $("#toggle_details").click(function() {
        $(this).remove();
        $("#details").show();
    });
});
