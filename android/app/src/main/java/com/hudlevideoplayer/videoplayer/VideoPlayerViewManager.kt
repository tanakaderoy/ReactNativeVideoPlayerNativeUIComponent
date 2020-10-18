package com.hudlevideoplayer.VideoPlayer;

import android.net.Uri;
import android.os.Handler;
import android.widget.VideoView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.hudlevideoplayer.Utils.NativeCommands;

import java.util.Locale;
import java.util.Map;

/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
public class VideoPlayerViewManager extends SimpleViewManager<VideoView> implements CustomVideoView.CustomVideoViewInterface {
    public static final String REACT_CLASS = "VideoPlayerView";
    CustomVideoView videoView;
    ReactContext context;


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected VideoView createViewInstance(@NonNull ThemedReactContext reactContext) {
        context = reactContext;
        videoView = new CustomVideoView(context);

        context.addLifecycleEventListener(videoView);
        videoView.setCustomVideoViewInterface(this);

        return videoView;
    }

    @ReactProp(name = "url")
    public void setVideoPath(VideoView videoView, String urlPath) {
        Uri uri = Uri.parse(urlPath);
        videoView.setVideoURI(uri);
        playFromManager();

        dispatchOnPlayerUpdate();
    }

    @ReactProp(name = "videoName")
    public void setVideoName(VideoView videoView, String name) {
        System.out.println(name);
    }

    @ReactProp(name = "thumbnailUrl")
    public void setThumbnailUrl(VideoView videoView, String url) {
        System.out.println(url);
    }

    @ReactMethod
    public void playFromManager() {
        videoView.play();
        dispatchOnPlayerUpdate();
    }

    @ReactMethod
    public void pauseFromManager() {
        videoView.pause();
        dispatchOnPlayerUpdate();
    }

    @ReactMethod
    public void goForwardFiveFromManager() {
        videoView.goForwardFive();
        dispatchOnPlayerUpdate();
    }

    @ReactMethod
    public void goBackFiveFromManager() {
        videoView.goBackFive();
        dispatchOnPlayerUpdate();
    }

    @ReactMethod
    public void seekToFromManager(int time) {
        videoView.seekTo(time);
        dispatchOnPlayerUpdate();
    }

    @Override
    public @Nullable
    Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onPlayerUpdate",
                MapBuilder.of("registrationName", "onPlayerUpdate")
        );
    }

    private void dispatchOnPlayerUpdate() {
        WritableMap event = Arguments.createMap();
        event.putString("duration", getTimeString(videoView.getDuration()));
        event.putInt("sliderValue", videoView.getCurrentPosition());
        event.putInt("sliderMaxValue", videoView.getDuration());
        event.putInt("sliderMinValue", 0);
        event.putInt("isPlaying", videoView.isVideoPlaying);
        event.putString("currentTime", getTimeString(videoView.getCurrentPosition()));


        context.getJSModule(RCTEventEmitter.class).receiveEvent(videoView.getId(), "onPlayerUpdate", event);


    }

    @Override
    public void receiveCommand(@NonNull VideoView root, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        System.out.println(commandId);
        NativeCommands nativeCommands = new NativeCommands(commandId);
        switch (nativeCommands.command) {
            case NativeCommands.GO_BACK_FIVE_FROM_MANAGER:
                goBackFiveFromManager();
                break;
            case NativeCommands.GO_FORWARD_FIVE_FROM_MANAGER:
                goForwardFiveFromManager();
                break;
            case NativeCommands.PAUSE_FROM_MANAGER:
                pauseFromManager();
                break;
            case NativeCommands.PLAY_FROM_MANAGER:
                playFromManager();
                break;
            case NativeCommands.SEEK_TO_FROM_MANAGER:
                seekToFromManager(args != null ? args.getInt(0) : 0);
                break;
            default:
        }
    }

    private String getTimeString(int time) {
        long totalSeconds = time / 1000;
        long hours = totalSeconds / 3600;
        long minutes = totalSeconds / 60 % 60;
        long seconds = totalSeconds % 60;
        return hours > 60 ? String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds) : String.format(Locale.US, "%02d:%02d", minutes, seconds);
    }

    @Override
    public void peformDispatch() {
        dispatchOnPlayerUpdate();
    }


}