import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ClipPlayer from './components/ClipPlayer';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text className="text-2xl color-slate-600">
          Nudge Timer
        </Text>
        <Text className="text-xl color-slate-400">
          A timer that nudges you at different intervals before completion.
        </Text>
        <View className="mb-10" />
        <ClipPlayer />
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
