float quantize(float val, float from, float to, float count) {
    return floor((val - from) / (to - from) * count) / count * (to - from) + from;
}
