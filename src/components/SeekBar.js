import Slider from '@react-native-community/slider';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../utils/Util';

const SeekBar = ({
  currentTime,
  sliderMinValue,
  sliderMaxValue,
  sliderValue,
  onSeek,
  duration,
}) => (
  <View style={styles.seekBar}>
    <Text style={{...styles.text, paddingRight: 8}}>{currentTime}</Text>
    <Slider
      tapToSeek
      step={1}
      minimumValue={sliderMinValue}
      maximumValue={sliderMaxValue}
      minimumTrackTintColor={COLORS.accent}
      value={sliderValue}
      onValueChange={onSeek}
      style={{width: '80%'}}
    />
    <Text style={{...styles.text, paddingLeft: 8}}>{duration}</Text>
  </View>
);

export default SeekBar;

const styles = StyleSheet.create({
  seekBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  text: {
    color: COLORS.textColor,
  },
});
