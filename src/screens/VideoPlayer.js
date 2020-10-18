import React, {useEffect, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {Icon} from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {BASE_VIDEO_STORAGE_URL, COLORS, NativeCommands} from '../utils/Util';
import SeekBar from '../components/SeekBar';
import PlayerControls from '../components/PlayerControls';

const VideoPlayerView = requireNativeComponent('VideoPlayerView');
const VideoPlayer = ({navigation, route}) => {
  const [state, setState] = useState({
    duration: '00:00',
    sliderValue: 0,
    currentTime: '00:00',
    sliderMinValue: 0.0,
    sliderMaxValue: 0.0,
    isPlaying: true,
    fullscreen: false,
    showControls: true,
  });
  const [videoPlayerRef, setVideoPlayerRef] = useState(null);
  const {
    sliderMaxValue,
    sliderMinValue,
    sliderValue,
    isPlaying,
    currentTime,
    duration,
    fullscreen,
    showControls,
  } = state;
  const {video} = route.params;
  const url = video.sources[0];
  const imageURl = BASE_VIDEO_STORAGE_URL + video.thumb;
  const {
    pauseFromManager,
    playFromManager,
    seekToFromManager,
    goBackFiveFromManager,
    goForwardFiveFromManager,
  } = NativeCommands;

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    showControlsTimer();
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  const playOnNative = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      playFromManager,
      [],
    );
  };
  const pauseOnNative = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      pauseFromManager,
      [],
    );
  };

  const goBackFiveOnNative = (e) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      goBackFiveFromManager,
      [],
    );
    showControlsTimer();
  };

  const togglePlayOrPause = () => {
    if (isPlaying) {
      setState({...state, showControls: true});
      pauseOnNative();
      return;
    }
    setTimeout(() => setState((s) => ({...s, showControls: false})), 2000);
    playOnNative();
  };

  const goForwardFiveOnNative = (e) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      goForwardFiveFromManager,
      [],
    );
    showControlsTimer();
  };
  const onPlayerUpdate = (e) => {
    // console.log(e.nativeEvent);
    setState({
      ...state,
      currentTime: e.nativeEvent.currentTime,
      duration: e.nativeEvent.duration,
      sliderValue: e.nativeEvent.sliderValue,
      sliderMaxValue: e.nativeEvent.sliderMaxValue,
      sliderMinValue: e.nativeEvent.sliderMinValue,
      isPlaying: e.nativeEvent.isPlaying === 1 ? true : false,
    });
  };

  const seekToOnNative = (value) => {
    // console.log(value);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      seekToFromManager,
      [value],
    );
    showControlsTimer();
  };
  const showControlsTimer = () => {
    if (showControls && isPlaying) {
      setTimeout(() => setState((s) => ({...s, showControls: false})), 2000);
    }
  };

  const handleOrientation = (orientation) => {
    Orientation.getDeviceOrientation((deviceOrientation) => {
      console.log('Current Device Orientation: ', deviceOrientation);
    });
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState((s) => ({...s, fullscreen: true})),
        StatusBar.setHidden(true),
        navigation.setOptions({headerShown: false}))
      : (setState((s) => ({...s, fullscreen: false})),
        StatusBar.setHidden(false),
        navigation.setOptions({headerShown: true}));
  };

  const handleFullscreen = () => {
    console.log('pYurrr');

    state.fullscreen
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToLandscapeLeft();
  };
  const handleShowControls = () => {
    showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleShowControls}>
        <View>
          <VideoPlayerView
            ref={(e) => setVideoPlayerRef(e)}
            style={
              fullscreen ? styles.fullscreenVideoPlayer : styles.videoPlayer
            }
            onPlayerUpdate={onPlayerUpdate}
            url={url}
            videoName={video.title}
            thumbnailUrl={imageURl}
          />
          {showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                onPress={handleFullscreen}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                style={styles.fullscreenButton}>
                <Icon
                  name={fullscreen ? 'screen-normal' : 'screen-full'}
                  type="octicon"
                  color={COLORS.textColor}
                  size={30}
                />
              </TouchableOpacity>

              <PlayerControls
                onSkipBack={goBackFiveOnNative}
                onSkipForward={goForwardFiveOnNative}
                onPlayPause={togglePlayOrPause}
                isPlaying={isPlaying}
              />
              <SeekBar
                currentTime={currentTime}
                sliderMinValue={sliderMinValue}
                sliderMaxValue={sliderMaxValue}
                sliderValue={sliderValue}
                onSeek={seekToOnNative}
                duration={duration}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{video.title}</Text>
        <Text style={styles.text}>{video.description}</Text>
      </View>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  videoPlayer: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    paddingBottom: -400,
  },
  fullscreenVideoPlayer: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
  },

  textContainer: {
    backgroundColor: COLORS.lightPrimary,
    height: '100%',
  },
  titleText: {
    fontSize: 40,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: 50,
  },
  text: {
    color: COLORS.textColor,
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});
