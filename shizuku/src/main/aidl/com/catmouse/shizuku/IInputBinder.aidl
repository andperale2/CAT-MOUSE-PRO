package com.catmouse.shizuku;

interface IInputBinder {
    void injectTap(int x, int y);
    void injectSwipe(int x1, int y1, int x2, int y2, int durationMs);
    void setPointerSpeedMultiplier(float multiplier);
    boolean isAuthorized();
}
