package com.hudlevideoplayer.VideoPlayer;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.VideoView;

import com.facebook.react.bridge.LifecycleEventListener;

/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
class CustomVideoView extends VideoView implements LifecycleEventListener {
    int isVideoPlaying = 0;
    boolean running = false;
    CustomVideoViewInterface customVideoViewInterface;

    public void setCustomVideoViewInterface(CustomVideoViewInterface customVideoViewInterface) {
        this.customVideoViewInterface = customVideoViewInterface;
    }

    public CustomVideoView(Context context) {
        super(context);
        setOnCompletionListener(mp -> {
            customVideoViewInterface.peformDispatch();
            running = false;
        });
        setOnPreparedListener(mp -> {
            running = true;
            final int duration = getDuration();

            new Thread(() -> {
                do {
                    post(() -> customVideoViewInterface.peformDispatch());
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if (!running) break;
                }
                while (getCurrentPosition() < duration);
            }).start();
        });
    }

    public CustomVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomVideoView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }


    @Override
    public void onHostResume() {
        running = true;
    }

    @Override
    public void onHostPause() {
        running = false;
    }

    @Override
    public void onHostDestroy() {
        running = false;
    }

    public void play() {
        isVideoPlaying = 1;
        start();
    }

    @Override
    public void pause() {
        super.pause();
        isVideoPlaying = 0;
    }

    public void goForwardFive() {
        int newTime = getCurrentPosition() + 5000;
        seekTo(newTime > getDuration() ? 0 : newTime);
    }

    public void goBackFive() {
        int newTime = getCurrentPosition() - 5000;
        seekTo(Math.max(newTime, 0));
    }

    interface CustomVideoViewInterface {
        void peformDispatch();
    }
}
