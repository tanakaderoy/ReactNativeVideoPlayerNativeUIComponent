import React from 'react';
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {BASE_VIDEO_STORAGE_URL, Routes, VIDEO_DATA} from '../utils/Util';

const VideoList = ({navigation}) => {
  return (
    <View style={styles.videoList}>
      <FlatList
        data={VIDEO_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          const imageURl = BASE_VIDEO_STORAGE_URL + item.thumb;
          return (
            <TouchableOpacity
              delayPressIn={50}
              onPress={() =>
                navigation.navigate(Routes.videoPlayer, {
                  video: item,
                })
              }>
              <View>
                <Image style={styles.thumb} source={{uri: imageURl}} />
                <Text> {item.title}</Text>
                <Text>{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default VideoList;

const styles = StyleSheet.create({
  videoList: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  thumb: {
    height: 200,
    width: 350,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#b3e5fc',
  },
});
