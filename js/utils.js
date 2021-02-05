// taken from https://qiita.com/hachisukansw/items/633d1bf6baf008e82847
function _HSV2RGB (H,S,V) {
    // see also: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

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

function _hex2rgb (hex) {
    return {
        r: parseInt(hex.substring(1, 3), 16),
        g: parseInt(hex.substring(3, 5), 16),
        b: parseInt(hex.substring(5, 7), 16)
    }
}

// taken from https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function _hex2HSV (hex) {
    var r = parseInt(hex.substring(1, 3), 16) / 255;
    var g = parseInt(hex.substring(3, 5), 16) / 255;
    var b = parseInt(hex.substring(5, 7), 16) / 255;

    var v     = Math.max(r, g, b);
    var vDiff = v - Math.min(r, g, b);

    var h, s;
    if (vDiff == 0) {
        h = s = 0;
    } else {
        s = vDiff / v;

        var rr = (v - r) / 6 / vDiff + 1 / 2;
        var gg = (v - g) / 6 / vDiff + 1 / 2;
        var bb = (v - b) / 6 / vDiff + 1 / 2;

        if (r === v) {
            h = bb - gg;
        } else if (g === v) {
            h = (1 / 3) + rr - bb;
        } else if (b === v) {
            h = (2 / 3) + gg - rr;
        }

        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function _intToByte (int) {
    var str = Number(int).toString(16);
    if (str.length < 2) {
        return "0" + str;
    } else {
        return str;
    }
}

function _lighterColor (hexColor) {
    var rgb = _hex2rgb(hexColor);
    var newRgb = {
        r: Math.min(255, rgb.r + 96),
        g: Math.min(255, rgb.g + 96),
        b: Math.min(255, rgb.b + 96),
    };
    return "#" + _intToByte(newRgb.r) + _intToByte(newRgb.g) + _intToByte(newRgb.b);
}

function _darkerColor (hexColor) {
    var rgb = _hex2rgb(hexColor);
    var newRgb = {
        r: Math.max(0, rgb.r - 64),
        g: Math.max(0, rgb.g - 64),
        b: Math.max(0, rgb.b - 64),
    };
    return "#" + _intToByte(newRgb.r) + _intToByte(newRgb.g) + _intToByte(newRgb.b);
}

/* flip a rendering context */
function _flipContext (renderingContext2d, width) {
    renderingContext2d.translate(width, 0);
    renderingContext2d.scale(-1, 1);
}

/* flip a rendering context */
function _flipContextVert (renderingContext2d, height) {
    renderingContext2d.translate(0, height);
    renderingContext2d.scale(1, -1);
}
