import { Text, View } from "react-native";
import { useTimer } from "../state/TimerState";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useClipPlayer } from "../components/ClipPlayer";
import { useRouter } from "expo-router";
import { BorderlessButton } from "react-native-gesture-handler";
import { SymbolView } from "expo-symbols";
import TailwindConfig from "../constants/TailwindConfig";

export default function Timer() {
  const [timer] = useTimer();
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const clips = {
    AADT_Dm_Synth_Bells: useClipPlayer({ source: "AADT_Dm_Synth_Bells" }),
    VIB_G_EGuitar_006$k$wav: useClipPlayer({
      source: "VIB_G_EGuitar_006$k$wav",
    }),
    PIC_Cm_Piano_Linger: useClipPlayer({ source: "PIC_Cm_Piano_Linger" }),
    Ding: useClipPlayer({ source: "Ding" }),
  };

  // set up a use interval timer that updates the elapsed time state every 100ms
  useEffect(() => {
    if (isPaused || isCompleted) return;

    // 🥵🥵🥵🥵🥵🥵🥵🥵🥵
    let lastMeasuredTime = Date.now();
    let lastElapsedTime = elapsedTime;
    const interval = setInterval(() => {
      const currentTime = Date.now();

      const nextValue = Math.max(
        lastElapsedTime + (currentTime - lastMeasuredTime),
        timer.duration,
      );
      setElapsedTime(nextValue);
      // Don't love this!
      lastElapsedTime = nextValue;

      // This updates very slowly?
      // setElapsedTime((t) => {
      //   return Math.max(t + currentTime - lastMeasuredTime, timer.duration);
      // });

      lastMeasuredTime = currentTime;
    }, 32);

    return () => clearInterval(interval);
  }, [isPaused, isCompleted]);

  useEffect(() => {
    for (const warning of timer.warnings) {
      // Lazy implementation, need to actually track which warnings fire, but
      // for now I'll just check if the warning is within 100ms (the interval we
      // update at) of the elapsed time
      if (Math.abs(warning.after * 1000 - elapsedTime) < 100) {
        const clip = clips[warning.sound];
        clip.play();
      }
    }

    if (elapsedTime >= timer.duration * 1000) {
      setIsCompleted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedTime, timer.warnings]);

  const percentComplete = `${((elapsedTime / (timer.duration * 1000)) * 100).toFixed(0)}%`;

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text
        className="mb-3 text-lg font-bold"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {(elapsedTime / 1000.0).toFixed(2)} seconds ({percentComplete})
      </Text>
      <View
        className="bg-white border-black border-2 border-solid mr-3 ml-3 rounded-md"
        style={{
          flexDirection: "row",
          alignSelf: "stretch",
          height: 30,
        }}
      >
        <View
          // @ts-ignore
          style={{
            backgroundColor: "black",
            width: percentComplete,
          }}
        />
      </View>
      <View className="mt-10" />
      <View className="flex-row">
        {!isCompleted && (
          <>
            <TogglePlaybackButton
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />
            <View className="mr-2" />
          </>
        )}
        <AbortButton />
      </View>
      <StatusBar style="light" />
    </View>
  );
}

function TogglePlaybackButton({
  isPaused,
  setIsPaused,
}: {
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
}) {
  return (
    <BorderlessButton onPress={() => setIsPaused(!isPaused)}>
      <View className="bg-gray-100 rounded-md pt-2 pb-2 pl-4 pr-4 flex-row justify-center border-solid border-2 border-gray-200 items-center">
        {isPaused ? (
          <SymbolView
            name="play.fill"
            size={30}
            tintColor={TailwindConfig.theme.colors.gray[600]}
          />
        ) : (
          <SymbolView
            name="pause.fill"
            size={30}
            tintColor={TailwindConfig.theme.colors.gray[600]}
          />
        )}
      </View>
    </BorderlessButton>
  );
}

function AbortButton() {
  const router = useRouter();
  return (
    <BorderlessButton onPress={() => router.back()}>
      <View className="bg-gray-100 rounded-md pt-2 pb-2 pl-4 pr-4 flex-row justify-center border-solid border-2 border-gray-200 items-center">
        <SymbolView
          name="xmark"
          size={30}
          tintColor={TailwindConfig.theme.colors.gray[600]}
        />
      </View>
    </BorderlessButton>
  );
}
