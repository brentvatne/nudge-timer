import { useState } from "react";
export type Timer = {
  duration: number;
  warnings: TimerWarning[];
};

export type TimerWarning = {
  sound: string;
  after: number;
};

const EMPTY_TIMER = {
  duration: 90,
  warnings: [
    { sound: "VIB_G_EGuitar_006$k$wav", after: 10 },
    { sound: "AADT_Dm_Synth_Bells", after: 30 },
    { sound: "PIC_Cm_Piano_Linger", after: 60 },
    { sound: "Ding", after: 80 },
  ],
};

let _timer = EMPTY_TIMER;

// This isn't reactive to changes if you use it in multiple places,
// just being lazy here
export function useTimer(): [Timer, setTimer: (timer: Timer) => void] {
  const [timer, setTimer] = useState<Timer>(_timer);

  function _setTimer(timer: any) {
    _timer = timer;
    setTimer(timer);
  }

  return [timer, _setTimer];
}
