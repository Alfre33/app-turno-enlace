const React = require('react');
module.exports = {
  SafeAreaView: ({ children, ...props }) => React.createElement('div', { 'data-host': 'SafeAreaView', ...props }, children),
  SafeAreaProvider: ({ children }) => React.createElement('div', null, children),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
};
