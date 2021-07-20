float quantize(float val, float from, float to, float count) {
    return map(floor(map(val, from, to, 0., 1.) * count) / count, 0., 1., from, to);
}
