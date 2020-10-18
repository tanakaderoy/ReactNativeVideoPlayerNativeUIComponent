package com.hudlevideoplayer.utils

import androidx.annotation.StringDef

/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
class NativeCommands(@param:NativeCommand var command: String) {
    @StringDef(PAUSE_FROM_MANAGER, SEEK_TO_FROM_MANAGER, GO_BACK_FIVE_FROM_MANAGER, GO_FORWARD_FIVE_FROM_MANAGER, PLAY_FROM_MANAGER)
    @Retention(AnnotationRetention.SOURCE)
    annotation class NativeCommand
    companion object {
        const val PAUSE_FROM_MANAGER = "pauseFromManager"
        const val SEEK_TO_FROM_MANAGER = "seekToFromManager"
        const val GO_BACK_FIVE_FROM_MANAGER = "goBackFiveFromManager"
        const val GO_FORWARD_FIVE_FROM_MANAGER = "goForwardFiveFromManager"
        const val PLAY_FROM_MANAGER = "playFromManager"
    }
}