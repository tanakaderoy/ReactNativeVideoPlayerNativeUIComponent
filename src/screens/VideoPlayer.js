import Slider from '@react-native-community/slider';
import React, {useState} from 'react';
import {Icon} from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  requireNativeComponent,
  UIManager,
  findNodeHandle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const VideoPlayerView = requireNativeComponent('VideoPlayerView');
const VideoPlayer = ({navigation}) => {
  const [videoPlayerRef, setVideoPlayerRef] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [duration, setDuration] = useState('00:00');
  const [currentTime, setCurrentTime] = useState('00:00');
  const [sliderMinValue, setSliderMinValue] = useState(0.0);
  const [sliderMaxValue, setSliderMaxValue] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(true);

  const video = navigation.state.params.video;
  const url = video.sources[0];

  const playOnNative = () => {
    setIsPlaying(true);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      UIManager.VideoPlayerView.Commands.playFromManager,
      [],
    );
  };
  const pauseOnNative = () => {
    setIsPlaying(false);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      UIManager.VideoPlayerView.Commands.pauseFromManager,
      [],
    );
  };

  const goBackFiveOnNative = (e) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      UIManager.VideoPlayerView.Commands.goBackFiveFromManager,
      [],
    );
  };

  const togglePlayOrPause = () => {
    if (isPlaying) {
      pauseOnNative();
    } else {
      playOnNative();
    }
  };

  const goForwardFiveOnNative = (e) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      UIManager.VideoPlayerView.Commands.goForwardFiveFromManager,
      [],
    );
  };
  const onDurationUpdate = (e) => {
    console.log(e.nativeEvent);

    setCurrentTime(e.nativeEvent.currentTime);
    setDuration(e.nativeEvent.duration);
    setSliderValue(e.nativeEvent.sliderValue);
    setSliderMaxValue(e.nativeEvent.sliderMaxValue);
    setSliderMinValue(e.nativeEvent.sliderMinValue);
  };

  const seekToOnNative = (value) => {
    console.log(value);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoPlayerRef),
      UIManager.VideoPlayerView.Commands.seekToFromManager,
      [value],
    );
  };
  return (
    <View style={styles.container}>
      <VideoPlayerView
        ref={(e) => setVideoPlayerRef(e)}
        style={styles.videoPlayer}
        onDurationUpdate={onDurationUpdate}
        url={url}
      />
      <View style={styles.seekBar}>
        <Text>{currentTime}</Text>
        <Slider
          step={1}
          minimumValue={sliderMinValue}
          maximumValue={sliderMaxValue}
          minimumTrackTintColor="#009688"
          onValueChange={(v) => seekToOnNative(v)}
          style={{width: '80%'}}
        />
        <Text>{duration}</Text>
      </View>
      <View style={styles.playerControls}>
        <TouchableOpacity onPress={goBackFiveOnNative}>
          <Icon name="replay-5" color="#00aced" type="material" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayOrPause}>
          {isPlaying ? (
            <Icon name="pause" color="#00aced" type="font-awesome-5" />
          ) : (
            <Icon name="play" color="#00aced" type="font-awesome-5" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={goForwardFiveOnNative}>
          <Icon name="forward-5" color="#00aced" type="material" />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{video.title}</Text>
      <Text>{video.description}</Text>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  videoPlayer: {
    height: 250,
    width: '100%',
    borderWidth: 4,
    borderColor: 'red',
    paddingBottom: -400,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: '600',
  },
});
