float map(float val, float domainMin, float domainMax, float rangeMin, float rangeMax) {
    return rangeMin + (val - domainMin) * (rangeMax - rangeMin) / (domainMax - domainMin);
}
