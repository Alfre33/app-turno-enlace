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

const FlatList = ({ data, renderItem, ListEmptyComponent, ListHeaderComponent, keyExtractor, contentContainerStyle }) => {
  const ReactLocal = require('react');
  const ViewLocal = ReactLocal.createElement.bind(null, 'div');
  if (!data || data.length === 0) {
    return ListEmptyComponent ? ListEmptyComponent : ReactLocal.createElement('div', null);
  }
  return ReactLocal.createElement('div', null,
    ListHeaderComponent ? ListHeaderComponent : null,
    ...data.map((item, idx) => {
      const rendered = renderItem({ item, index: idx });
      return ReactLocal.createElement('div', { key: keyExtractor ? keyExtractor(item) : idx }, rendered);
    })
  );
};

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

const Alert = {
  alert: (title, message, buttons) => {
    // no-op default; tests may spyOn this
    if (Array.isArray(buttons) && typeof buttons[0] === 'function') {
      try { buttons[0](); } catch(e) {}
    }
  }
};

module.exports = {
  Text,
  View,
  Pressable,
  ScrollView,
  RefreshControl,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  StyleSheet,
};
