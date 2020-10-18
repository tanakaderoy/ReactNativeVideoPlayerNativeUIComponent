/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import VideoList from './src/screens/VideoList';
import VideoPlayer from './src/screens/VideoPlayer';
import {COLORS, ROUTES} from './src/utils/Util';
import {StatusBar, View} from 'react-native';

const Stack = createStackNavigator();
const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.videos}
        screenOptions={{
          headerTintColor: COLORS.textColor,
          headerStyle: {
            backgroundColor: COLORS.darkPrimary,
            shadowColor: 'transparent',
          },
        }}>
        <Stack.Screen
          name={ROUTES.videos}
          component={VideoList}
          options={{
            title: 'Hudl Video Player',
          }}
        />
        <Stack.Screen name={ROUTES.videoPlayer} component={VideoPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const App = () => (
  <View style={{flex: 1}}>
    <StatusBar backgroundColor="blue" barStyle="light-content" />
    <MainStack />
  </View>
);

export default App;
