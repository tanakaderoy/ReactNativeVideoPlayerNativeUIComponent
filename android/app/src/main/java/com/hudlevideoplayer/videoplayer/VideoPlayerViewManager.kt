package com.hudlevideoplayer.videoplayer

import android.net.Uri
import android.widget.VideoView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.hudlevideoplayer.utils.NativeCommands
import com.hudlevideoplayer.videoplayer.CustomVideoView.CustomVideoViewInterface
import java.util.*

/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
class VideoPlayerViewManager : SimpleViewManager<VideoView>(), CustomVideoViewInterface {
    private lateinit var videoView: CustomVideoView
    private lateinit var context: ReactContext

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): VideoView {
        context = reactContext
        videoView = CustomVideoView(context)
        context.addLifecycleEventListener(videoView)
        videoView.setCustomVideoViewInterface(this)
        return videoView
    }

    @ReactProp(name = "url")
    fun setVideoPath(videoView: VideoView, urlPath: String?) {
        val uri = Uri.parse(urlPath)
        videoView.setVideoURI(uri)
        playFromManager()
        dispatchOnPlayerUpdate()
    }

    @ReactProp(name = "videoName")
    fun setVideoName(videoView: VideoView?, name: String?) {
        println(name)
    }

    @ReactProp(name = "thumbnailUrl")
    fun setThumbnailUrl(videoView: VideoView?, url: String?) {
        println(url)
    }

    @ReactMethod
    fun playFromManager() {
        videoView.play()
        dispatchOnPlayerUpdate()
    }

    @ReactMethod
    fun pauseFromManager() {
        videoView.pause()
        dispatchOnPlayerUpdate()
    }

    @ReactMethod
    fun goForwardFiveFromManager() {
        videoView.goForwardFive()
        dispatchOnPlayerUpdate()
    }

    @ReactMethod
    fun goBackFiveFromManager() {
        videoView.goBackFive()
        dispatchOnPlayerUpdate()
    }

    @ReactMethod
    fun seekToFromManager(time: Int) {
        videoView.seekTo(time)
        dispatchOnPlayerUpdate()
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
        return MapBuilder.of(
                "onPlayerUpdate",
                MapBuilder.of("registrationName", "onPlayerUpdate")
        )
    }

    private fun dispatchOnPlayerUpdate() {
        val event = Arguments.createMap()
        event.putString("duration", getTimeString(videoView.duration))
        event.putInt("sliderValue", videoView.currentPosition)
        event.putInt("sliderMaxValue", videoView.duration)
        event.putInt("sliderMinValue", 0)
        event.putInt("isPlaying", videoView.isVideoPlaying)
        event.putString("currentTime", getTimeString(videoView.currentPosition))
        context.getJSModule(RCTEventEmitter::class.java).receiveEvent(videoView.id, "onPlayerUpdate", event)
    }

    override fun receiveCommand(root: VideoView, commandId: String, args: ReadableArray?) {
        super.receiveCommand(root, commandId, args)
        println(commandId)
        val nativeCommands = NativeCommands(commandId)
        when (nativeCommands.command) {
            NativeCommands.GO_BACK_FIVE_FROM_MANAGER -> goBackFiveFromManager()
            NativeCommands.GO_FORWARD_FIVE_FROM_MANAGER -> goForwardFiveFromManager()
            NativeCommands.PAUSE_FROM_MANAGER -> pauseFromManager()
            NativeCommands.PLAY_FROM_MANAGER -> playFromManager()
            NativeCommands.SEEK_TO_FROM_MANAGER -> seekToFromManager(args?.getInt(0) ?: 0)
            else -> {
            }
        }
    }

    private fun getTimeString(time: Int): String {
        val totalSeconds = time / 1000.toLong()
        val hours = totalSeconds / 3600
        val minutes = totalSeconds / 60 % 60
        val seconds = totalSeconds % 60
        return if (hours > 60) String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds) else String.format(Locale.US, "%02d:%02d", minutes, seconds)
    }

    override fun peformDispatch() {
        dispatchOnPlayerUpdate()
    }

    companion object {
        const val REACT_CLASS = "VideoPlayerView"
    }
}