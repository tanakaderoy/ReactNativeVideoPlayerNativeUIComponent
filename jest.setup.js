import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('react-native-orientation-locker', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    lockToPortrait: jest.fn(),
    lockToLandscapeLeft: jest.fn(),
    lockToLandscapeRight: jest.fn(),
    unlockAllOrientations: jest.fn(),
  };
});
