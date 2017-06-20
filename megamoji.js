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
}

function render_result () {
    var image      = $("#preview")[0];
    var v          = parseInt($("#v").val());
    var h          = parseInt($("#h").val());
    var zoom_ratio = parseFloat($("#zoom").val());
    var left       = parseInt($("#left").val());
    var top        = parseInt($("#top").val());

    var cell_size = 128 * zoom_ratio;
    var $result_area = $("#result-area");
    $result_area.html("");
    for (var y = 0; y < v; y++) {
        for (var x = 0; x < h; x++) {
            var $canvas = $("<canvas width=128 height=128>").appendTo($result_area);
            var ctx = $canvas[0].getContext('2d');
            ctx.drawImage(
                image,
                left + x * cell_size, top + y * cell_size, cell_size, cell_size,
                0, 0, 128, 128
            );
            $result_area.append("&nbsp;");
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
