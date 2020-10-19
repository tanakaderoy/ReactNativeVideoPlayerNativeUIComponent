/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  BASE_VIDEO_STORAGE_URL,
  COLORS,
  ROUTES,
  VIDEO_DATA,
} from '../utils/Util';

const VideoList = ({navigation}) => {
  useEffect(() => {
    const unsub = NetInfo.addEventListener((s) => {
      console.log('Connection type', s.type);
      console.log('Is connected?', s.isConnected);
    });
    return () => {
      unsub();
    };
  }, []);
  const renderItem = ({item}) => {
    const imageURl = BASE_VIDEO_STORAGE_URL + item.thumb;
    return (
      <TouchableOpacity
        delayPressIn={50}
        onPress={() =>
          NetInfo.fetch().then(({isConnected, type}) => {
            console.log('Connection type', type);
            console.log('Is connected?', isConnected);
            isConnected
              ? navigation.push(ROUTES.videoPlayer, {
                  video: item,
                })
              : alert('Must be connected to Internet');
          })
        }>
        <View style={styles.videoItem}>
          <View>
            <Image
              style={styles.thumb}
              source={{uri: imageURl}}
              resizeMode="cover"
            />
            <Icon
              containerStyle={{position: 'absolute', bottom: 10, right: 8}}
              name="play-circle"
              color={COLORS.textColor}
              type="font-awesome-5"
              size={40}
            />
          </View>

          <View style={styles.videoTitleContainer}>
            <Text style={styles.videoTitle}> {item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.videoList}
        showsVerticalScrollIndicator={false}
        data={VIDEO_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default VideoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  videoList: {
    flex: 1,
  },
  videoItem: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },

  videoTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
    backgroundColor: COLORS.lightPrimary,
  },
  videoTitle: {
    color: COLORS.textColor,
    fontSize: 18,
    fontWeight: '700',
  },
  thumb: {
    height: 200,
    width: 350,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    borderColor: COLORS.border,
  },
});
