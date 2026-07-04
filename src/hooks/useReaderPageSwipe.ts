import { useRef } from "react";
import { PanResponder } from "react-native";

const SWIPE_THRESHOLD = 36;

/** Horizontal swipe on the reader area to change pages. */
export function useReaderPageSwipe(goPrev: () => void, goNext: () => void) {
  const goPrevRef = useRef(goPrev);
  const goNextRef = useRef(goNext);
  goPrevRef.current = goPrev;
  goNextRef.current = goNext;

  return useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.15,
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, { dx, vx }) => {
        const passed =
          Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.35;
        if (!passed) return;
        if (dx > 0) goPrevRef.current();
        else goNextRef.current();
      },
    })
  ).current;
}
