/* eslint-disable react-native/no-inline-styles */
import Slider from '@react-native-community/slider';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../utils/Util';

interface Props {
  currentTime: string;
  sliderMinValue: number;
  sliderMaxValue: number;
  sliderValue: number;
  onSeek: (value: number) => void;
  duration: string;
}

const SeekBarTs = ({
  currentTime,
  sliderMinValue,
  sliderMaxValue,
  sliderValue,
  onSeek,
  duration,
}: Props) => {
  const [mySliderValue, setMySliderValue] = useState(sliderValue);
  return (
    <View style={styles.seekBar}>
      <Text style={{...styles.text, paddingRight: 8}}>{currentTime}</Text>
      <Slider
        onSlidingComplete={(v) => {
          onSeek(v);
          setMySliderValue(v);
        }}
        step={1}
        minimumValue={sliderMinValue}
        maximumValue={sliderMaxValue}
        minimumTrackTintColor={COLORS.accent}
        value={mySliderValue}
        onValueChange={onSeek}
        style={{width: '80%'}}
      />
      <Text style={{...styles.text, paddingLeft: 8}}>{duration}</Text>
    </View>
  );
};

export default SeekBarTs;

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
