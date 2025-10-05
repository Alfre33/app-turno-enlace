const React = require('react');

function Host(name) {
  return ({ children, ...props }) => React.createElement('div', { 'data-host': name, ...props }, children);
}

const Text = Host('Text');
const View = Host('View');
const Pressable = Host('Pressable');
const ScrollView = Host('ScrollView');
const RefreshControl = Host('RefreshControl');
const KeyboardAvoidingView = Host('KeyboardAvoidingView');

class TextInput extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return React.createElement('input', { ...props, 'data-host': 'TextInput' }, children);
  }
}

const ActivityIndicator = ({ size, color }) => React.createElement('span', { 'data-host': 'ActivityIndicator', 'data-size': size, 'data-color': color });

const Image = ({ source, ...props }) => React.createElement('img', { src: source?.uri || source, ...props, 'data-host': 'Image' });

const Platform = { OS: 'android' };

const StyleSheet = {
  create: (o) => o,
  hairlineWidth: 1,
};

module.exports = {
  Text,
  View,
  Pressable,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
};
