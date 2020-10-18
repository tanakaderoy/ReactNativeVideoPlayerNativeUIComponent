package com.hudlevideoplayer.videoplayer

import android.content.Context
import android.widget.VideoView
import com.facebook.react.bridge.LifecycleEventListener
import kotlin.math.max


/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
class CustomVideoView(context: Context) : VideoView(context), LifecycleEventListener {
    var isVideoPlaying = 0
    private var running = false
    private lateinit var customVideoViewInterface: CustomVideoViewInterface
    fun setCustomVideoViewInterface(customVideoViewInterface: CustomVideoViewInterface) {
        this.customVideoViewInterface = customVideoViewInterface
    }

    init {
        setOnCompletionListener {
            isVideoPlaying = 0
            customVideoViewInterface.peformDispatch()
            running = false
        }
        setOnPreparedListener {
            running = true
            val duration = duration
            Thread {
                do {
                    post { customVideoViewInterface.peformDispatch() }
                    try {
                        Thread.sleep(500)
                    } catch (e: InterruptedException) {
                        e.printStackTrace()
                    }
                    if (!running) break
                } while (currentPosition < duration)
            }.start()
        }
    }

    override fun onHostResume() {
        running = true
    }

    override fun onHostPause() {
        running = false
    }

    override fun onHostDestroy() {
        running = false
        stopPlayback()
    }

    fun play() {
        isVideoPlaying = 1
        start()
    }

    override fun pause() {
        super.pause()
        isVideoPlaying = 0
    }

    fun goForwardFive() {
        val newTime = currentPosition + 5000
        seekTo(if (newTime > duration) 0 else newTime)
    }

    fun goBackFive() {
        val newTime = currentPosition - 5000
        seekTo(max(newTime, 0))
    }


    interface CustomVideoViewInterface {
        fun peformDispatch()
    }


}