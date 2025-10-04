module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@expo|expo-router|expo-checkbox)/)'
  ],
  moduleNameMapper: {
    '^@/assets/(.*)\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^react-native/Libraries/BatchedBridge/NativeModules$': '<rootDir>/__mocks__/react-native-Libraries-BatchedBridge-NativeModules.js',
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
    '^expo/virtual/env$': '<rootDir>/__mocks__/expo-virtual-env.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
