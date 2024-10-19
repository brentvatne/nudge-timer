import {
  useAudioPlayer,
  AudioSource,
  setIsAudioActiveAsync,
  useAudioPlayerStatus,
} from "expo-audio";
import { useEffect, useState } from "react";

import Clips from "../constants/generated/Clips";

type ClipPlayerProps = {
  source: AudioSource | number | keyof typeof Clips;
  debug?: boolean;
};

setIsAudioActiveAsync(true);

export function useClipPlayer({ source }: ClipPlayerProps) {
  let audioSource = source;
  if (typeof source === "string" && Clips.hasOwnProperty(source)) {
    audioSource = Clips[source];
  }

  const player = useAudioPlayer(audioSource, 500);
  const status = useAudioPlayerStatus(player);

  function play() {
    player.seekTo(0);
    player.play();
  }

  function pause() {
    player.pause();
  }

  return { play, pause, _debug: { status, player } };
}

export function useAutoplay(status, player) {
  const [hasAutoplayed, setHasAutoplayed] = useState(status.isLoaded);

  useEffect(() => {
    if (status.playbackState === "readyToPlay" && !hasAutoplayed) {
      player.play();
      setHasAutoplayed(true);
    }
  }, [status.playbackState, player, hasAutoplayed]);
}
