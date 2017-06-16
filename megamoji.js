$(function() {
    $("#file").change(function() {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#preview").attr("src", e.target.result);
        };
        reader.readAsDataURL($(this)[0].files[0]);
    });

    $("#render").click(function() {
        var image = $("#preview")[0];
        var v     = parseInt($("#v").val());
        var h     = parseInt($("#h").val());

        var zoom_ratio = Math.min(
            image.naturalHeight / (128.0 * v),
            image.naturalWidth / (128.0 * h)
        );

        var cell_size = 128 * zoom_ratio;
        var $result_area = $("#result-area");
        $result_area.html();
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < v; x++) {
                var $canvas = $("<canvas width=128 height=128>").appendTo($result_area);
                var ctx = $canvas[0].getContext('2d');
                ctx.drawImage(
                    image,
                    x * cell_size, y * cell_size, cell_size, cell_size,
                    0, 0, 128, 128
                );
                $result_area.append("&nbsp;");
            }
            $result_area.append("<br>");
        }
    });
});
