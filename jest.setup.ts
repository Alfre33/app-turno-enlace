// Minimal jest setup: mock reanimated and expo-router and use fake timers
// Avoid importing packages that require react-native during setup.
// Let React know we're in act environment
process.env.IS_REACT_ACT_ENVIRONMENT = '1';
// @ts-ignore - Jest global helper flag for React
global.IS_REACT_ACT_ENVIRONMENT = true;

import '@testing-library/jest-native/extend-expect';

// Keep minimal mocks: reanimated (many RN projects need this)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default = Reanimated;
  return Reanimated;
});

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Provide a default mock for expo-constants so modules that import it don't load ESM internals
// `expo-constants` is mapped to __mocks__/expo-constants.js via moduleNameMapper.

jest.useFakeTimers();

// Mock expo-checkbox to avoid Platform.select usage in test env
jest.mock('expo-checkbox', () => {
  const React = require('react');
  return ({ value, onValueChange }: any) => React.createElement('input', { type: 'checkbox', checked: value, onChange: (e: any) => onValueChange && onValueChange(e.target.checked) });
});
