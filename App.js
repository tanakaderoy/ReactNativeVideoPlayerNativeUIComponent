/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import VideoList from './src/screens/VideoList';
import VideoPlayer from './src/screens/VideoPlayer';
import { Routes } from './src/utils/Util';

const navigator = createStackNavigator({
  Videos: VideoList,
  VideoPlayer: VideoPlayer
},
{
  initialRouteName: Routes.videos,
  defaultNavigationOptions: {
    title: 'Hudl Video Player'
  }
})
export default createAppContainer(navigator)
