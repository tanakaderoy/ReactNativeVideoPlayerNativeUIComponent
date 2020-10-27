import React from 'react';
import * as renderer from 'react-test-renderer';
import PlayerControls from '../PlayerControls';
let isRan = false;
const func = () => {
  isRan = true;
};
it('renders player controls', () => {
  const playerControls = renderer
    .create(
      <PlayerControls
        onPlayPause={func}
        onSkipBack={func}
        onSkipForward={func}
        isPlaying={true}
      />,
    )
    .toJSON();
  expect(isRan).toEqual(false);
  expect(playerControls).toMatchSnapshot();
});

// /**
//  * @format
//  */

// import React from 'react';
// import 'react-native';
// // Note: test renderer must be required after react-native.
// import renderer, {act} from 'react-test-renderer';
// import App from '../App';

// it('renders correctly', () => {
//   act(() => {
//     renderer.create(<App />);
//   });
// });
