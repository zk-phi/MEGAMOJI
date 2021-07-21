vec4 premultiplied(vec4 rgba) {
    return vec4(rgba.rgb * rgba.a, rgba.a);
}
