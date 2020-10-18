package com.hudlevideoplayer.videoplayer

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext

/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
class VideoPlayerViewPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<VideoPlayerViewManager> {
        return listOf(
                VideoPlayerViewManager()
        )
    }
}