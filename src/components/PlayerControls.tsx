import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {COLORS} from '../utils/Util';

interface Props {
  onSkipBack: () => void;
  onSkipForward: () => void;
  onPlayPause: () => void;
  isPlaying: boolean;
}

const PlayerControls = ({
  onSkipBack,
  onSkipForward,
  onPlayPause,
  isPlaying,
}: Props) => {
  const controlIconSize = 50;

  return (
    <View style={styles.playerControls}>
      <TouchableOpacity onPress={onSkipBack}>
        <Icon
          name="replay-5"
          color={COLORS.textColor}
          type="material"
          size={controlIconSize}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPlayPause}>
        <Icon
          name={
            isPlaying ? 'ios-pause-circle-outline' : 'ios-play-circle-sharp'
          }
          color={COLORS.textColor}
          type="ionicon"
          size={controlIconSize + 10}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onSkipForward}>
        <Icon
          name="forward-5"
          color={COLORS.textColor}
          type="material"
          size={controlIconSize}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerControls;

const styles = StyleSheet.create({
  playerControls: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
});
