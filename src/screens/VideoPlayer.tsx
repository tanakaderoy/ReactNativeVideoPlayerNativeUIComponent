import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  findNodeHandle,
  FlatList,
  Image,
  NativeMethods,
  requireNativeComponent,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
import PlayerControls from '../components/PlayerControls';
import SeekBar from '../components/SeekBar';
import {
  BASE_VIDEO_STORAGE_URL,
  COLORS,
  NativeCommands,
  VideoItem,
  VIDEO_DATA,
} from '../utils/Util';

interface Props {
  navigation: StackNavigationProp<{}>;
  route: RouteProp<{video: {video: VideoItem}}, 'video'>;
}
interface VideoPlayerViewInterface {
  style: StyleProp<ViewStyle>;
  url: string;
  videoName: string;
  thumbnailUrl: string;
  onPlayerUpdate: (e: any) => void;
}
const VideoPlayerView = requireNativeComponent<VideoPlayerViewInterface>(
  'VideoPlayerView',
);
const VideoPlayer = ({route, navigation}: Props) => {
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
  const [videoPlayerRef, setVideoPlayerRef] = useState<NativeMethods | any>(
    null,
  );
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
  const routeVideo = route.params.video;
  const [video, setVideo] = useState(routeVideo);
  const url = video.sources[0];
  const imageURl = BASE_VIDEO_STORAGE_URL + video.thumb;
  const {
    pauseFromManager,
    playFromManager,
    seekToFromManager,
    goBackFiveFromManager,
    goForwardFiveFromManager,
    playVidFromManager,
  } = NativeCommands;
  const relatedVideos = VIDEO_DATA.filter((x) => x.id !== video.id);

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

  const goBackFiveOnNative = () => {
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

  const goForwardFiveOnNative = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      goForwardFiveFromManager,
      [],
    );
    showControlsTimer();
  };
  const onPlayerUpdate = (e: any) => {
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

  const seekToOnNative = (value: number) => {
    // console.log(value);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      seekToFromManager,
      [value],
    );
    showControlsTimer();
  };
  const playVid = (vidUrl: string) => {
    console.log(vidUrl);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      playVidFromManager,
      [vidUrl],
    );
  };
  const showControlsTimer = () => {
    if (showControls && isPlaying) {
      setTimeout(() => setState((s) => ({...s, showControls: false})), 2000);
    }
  };

  const handleOrientation = (orientation: string) => {
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

  const changeVideo = (item: VideoItem) => {
    setVideo(item);
    playVid(item.sources[0]);
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
            url={url}
            videoName={video.title}
            thumbnailUrl={imageURl}
            onPlayerUpdate={onPlayerUpdate}
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
      <ScrollView>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{video.title}</Text>
          <Text style={{...styles.text, marginStart: 8}}>
            {video.description}
          </Text>
          <View
            style={{
              flex: 1,
              height: '100%',
              paddingVertical: 10,
            }}>
            <Text style={{...styles.titleText, marginTop: 10}}>
              Related Videos
            </Text>
            <FlatList<VideoItem>
              data={relatedVideos}
              horizontal
              keyExtractor={(x) => x.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity onPress={() => changeVideo(item)}>
                    <Image
                      source={{uri: BASE_VIDEO_STORAGE_URL + item.thumb}}
                      style={{
                        height: 100,
                        width: 200,
                        marginStart: 8,
                        marginEnd: 5,
                        borderRadius: 10,
                      }}
                      height={200}
                      width={350}
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 16,
                        ...styles.text,
                        backgroundColor: '#092439',
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: COLORS.primary,
    marginBottom: 10,
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
