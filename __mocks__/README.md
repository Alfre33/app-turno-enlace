This folder contains manual Jest mocks used by the test suite. Keep mocks minimal and focused
— prefer mapping via `moduleNameMapper` in `jest.config.js` so mocks are automatically
applied without needing top-level `jest.mock()` inside tests.

Files
- `expo-constants.js`
  - Provides a minimal fake `expoConfig.extra` used by code that reads runtime config (API
    keys, feature flags). Used to avoid loading Expo's ESM virtual modules during tests.

- `expo-virtual-env.js`
  - Minimal mock for `expo/virtual/env`. Some Expo packages re-export virtual ESM modules
    under this path; mocking it prevents Jest from trying to parse ESM files in
    `node_modules/expo/virtual`.

- `react-native.js`
  - A tiny DOM-like replacement for common `react-native` host components used in tests
    (Text, View, TextInput, Image, ActivityIndicator, etc.). Keep this mock small — only
    export what your tests need. If a test requires real native behavior, prefer a focused
    mock in the test itself.

- `react-native-safe-area-context.js`
  - Mock for `SafeAreaView`, `SafeAreaProvider` and `useSafeAreaInsets`.

- `react-native-Libraries-BatchedBridge-NativeModules.js`
  - Minimal substitute for `NativeModules` expected by some RN internals during tests.

- `fileMock.js`
  - Generic stub for static assets (images). Returns a string placeholder.

Guidelines
- Put only the smallest amount of logic in `__mocks__`. For test-specific behavior use
  `jest.doMock()` inside `jest.isolateModules()` within the test.
- When adding a new mock, update `jest.config.js` `moduleNameMapper` if you want it to be
  automatically applied for imports.

If you want, I can further split or shrink any mock files that are larger than necessary.
