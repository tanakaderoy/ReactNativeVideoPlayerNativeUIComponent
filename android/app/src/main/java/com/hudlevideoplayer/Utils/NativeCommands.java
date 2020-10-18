package com.hudlevideoplayer.Utils;

import androidx.annotation.StringDef;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Created by Tanaka Mazivanhanga on 10/18/2020
 */
public class NativeCommands {
    public static final String PAUSE_FROM_MANAGER = "pauseFromManager";
    public static final String SEEK_TO_FROM_MANAGER = "seekToFromManager";
    public static final String GO_BACK_FIVE_FROM_MANAGER = "goBackFiveFromManager";
    public static final String GO_FORWARD_FIVE_FROM_MANAGER = "goForwardFiveFromManager";
    public static final String PLAY_FROM_MANAGER = "playFromManager";
    public String command;

    public NativeCommands(@NativeCommand String command) {
        this.command = command;
    }

    @StringDef({PAUSE_FROM_MANAGER, SEEK_TO_FROM_MANAGER, GO_BACK_FIVE_FROM_MANAGER, GO_FORWARD_FIVE_FROM_MANAGER, PLAY_FROM_MANAGER})
    @Retention(RetentionPolicy.SOURCE)
    public @interface NativeCommand {
    }

}
