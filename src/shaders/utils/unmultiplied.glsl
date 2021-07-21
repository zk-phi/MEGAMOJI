vec4 unmultiplied(vec4 rgba) {
    // avoid division-by-zero
    return vec4(rgba.rgb / (rgba.a + 0.00001), rgba.a);
}
