import { useAudioPlayer, AudioSource, setIsAudioActiveAsync, useAudioPlayerStatus } from 'expo-audio';
import { SymbolView } from 'expo-symbols'
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

import * as Clips from '../constants/generated/Clips';

type AudioPlayerProps = {
  source: AudioSource | string | number;
};

setIsAudioActiveAsync(true);

function AudioPlayer({ source }: AudioPlayerProps) {
  const player = useAudioPlayer(source, 500);
  const status = useAudioPlayerStatus(player);
  const [hasAutoplayed, setHasAutoplayed] = useState(status.isLoaded);

  useEffect(() => {
    if (status.playbackState == 'readyToPlay' && !hasAutoplayed) {
      // player.loop = true;
      player.play();
      setHasAutoplayed(true);
    }
  }, [status.playbackState, player]);

  const setVolume = (volume: number) => {
    player.volume = volume;
  };

  const setPlaying = (playing: boolean) => {
    player.playing = playing;
  };

  return (
    <BorderlessButton onPress={() => setPlaying(status.playing)}>
      <SymbolView name={status.playing ? 'pause' : 'play'} size={24} tintColor="black" />
      <Text>
        {objectToString(status)}
      </Text>
    </BorderlessButton>
  );
}


export default function ClipPlayer() {
  return (
    <AudioPlayer source={Clips.AADT_Dm_Synth_Bells} />
  );
}

// So the order doesn't change randomly when the object is re-rendered
function objectToString(obj: any) {
  const keys = Object.keys(obj).sort();
  const values = keys.map((key) => obj[key]);
  return keys.map((key, i) => `${key}: ${values[i]}`).join('\n');
}