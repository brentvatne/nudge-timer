import { Text, View } from "react-native";
import Clips from "../../constants/generated/Clips";
import { useClipPlayer } from "../../components/ClipPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  RectButton,
  BorderlessButton,
} from "react-native-gesture-handler";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import { useTimer, TimerWarning } from "../../state/TimerState";
import TailwindConfig from "../../constants/TailwindConfig";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className={`flex-1`}
        contentContainerClassName={`align-center pl-6 pr-6 ${insets.top > 0 ? "pt-20" : ""}`}
      >
        {/* <ClipPlayer /> */}

        <TimerEditor />

        <View className="mt-6" />
        <StartTimerButton />
      </ScrollView>
    </View>
  );
}

const TimerEditor = () => {
  const [timer, setTimer] = useTimer();

  return (
    <View>
      <Text className="text-xl font-bold mb-2">Timer duration</Text>
      <View className="flex-row mt-2 mb-5">
        <Button
          onPress={() => alert("this does not do anything yet")}
          className="mr-2"
        >
          <Label>{timer.duration} seconds</Label>
        </Button>
        <PlayButton clip={Clips.LM_Longshot_Bells_A_1} />
      </View>

      <Text className="text-xl font-bold mb-2">Warnings</Text>
      {timer.warnings.map((warning, i) => (
        <WarningRow warning={warning} key={i} />
      ))}
      <Button onPress={() => alert("this does not do anything yet")}>
        <View className="flex-row align-center">
          <SymbolView
            name="plus"
            size={18}
            tintColor="black"
            style={{ alignSelf: "center" }}
          />
          <Label className="ml-2">Add warning</Label>
        </View>
      </Button>
    </View>
  );
};

function WarningRow({ warning }: { warning: TimerWarning }) {
  return (
    <View className="flex-row flex-1 mb-2">
      <Button
        onPress={() => alert("this does not do anything yet")}
        className="mr-2"
      >
        <View className="flex-row flex-1 justify-between">
          <Label>After {warning.after} seconds</Label>
        </View>
      </Button>
      <PlayButton clip={warning.sound} />
    </View>
  );
}

function PlayButton({ clip }: { clip: string | number }) {
  const { play } = useClipPlayer({ source: clip });

  return (
    <BorderlessButton
      onPress={() => play()}
      style={{ height: "100%", alignSelf: "center", flexDirection: "row" }}
    >
      <View className="bg-gray-100 rounded-md pt-2 pb-2 pl-4 pr-4 flex-row justify-center border-solid border-2 border-gray-200 items-center">
        <SymbolView
          name="play.fill"
          size={18}
          tintColor={TailwindConfig.theme.colors.gray[600]}
        />
      </View>
    </BorderlessButton>
  );
}

function Label({
  className,
  children,
  style,
}: {
  className?: string;
  children: any;
  style?: any;
}) {
  return (
    <Text
      className={`text-lg font-bold backdrop-brightness-50 color-slate-950 ${className}`}
      style={style}
    >
      {children}
    </Text>
  );
}

function Row({
  children,
  style,
  className,
}: {
  className?: string;
  children: any;
  style?: any;
}) {
  return (
    <View
      style={style}
      className={`rounded-lg p-3 border-solid border-2 border-gray-300 ${className}`}
    >
      {children}
    </View>
  );
}

function Button({
  className,
  children,
  underlayColor,
  activeUnderlayColor,
  onPress,
}: {
  className?: string;
  children: any;
  underlayColor?: string;
  activeUnderlayColor?: string;
  style?: any;
  onPress: () => void;
}) {
  return (
    <RectButton
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: underlayColor ?? "#fff",
        borderRadius: 10,
      }}
      underlayColor={activeUnderlayColor ?? "#eee"}
      activeOpacity={0.8}
    >
      <Row className={className}>{children}</Row>
    </RectButton>
  );
}

function FunkyButton({
  className,
  ...props
}: {
  className?: string;
  children: any;
  style?: any;
  onPress: () => void;
}) {
  return (
    <Button
      {...props}
      className="border-blue-800"
      underlayColor={TailwindConfig.theme.colors.blue[600]}
      activeUnderlayColor={TailwindConfig.theme.colors.blue[800]}
    />
  );
}

// TODO: implement actual UI to edit this
function _TimerDurationPicker() {
  return null;
}

function StartTimerButton() {
  const router = useRouter();
  return (
    <FunkyButton onPress={() => router.navigate("timer")}>
      <Label className="color-white self-center">Start timer</Label>
    </FunkyButton>
  );
}
