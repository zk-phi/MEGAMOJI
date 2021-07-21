float switch(float test, float threshold, float v1, float v2) {
    float flag = step(threshold, test);
    return (1. - flag) * v1 + flag * v2;
}
