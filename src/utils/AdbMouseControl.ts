import AdbControl from "./AdbControl";

interface Coordinates {
  x: number;
  y: number;
}

interface Metadata {
  width?: number;
  height?: number;
}

const calculateCoordinates = (
  e: MouseEvent,
  rect: DOMRect,
  rate: number
): Coordinates => {
  return {
    x: (e.pageX - rect.left) / rate,
    y: (e.pageY - rect.top) / rate,
  };
};

const getRate = (metadata: Metadata, targetElement: HTMLElement): number => {
  const rect = targetElement.getBoundingClientRect();

  return Math.min(rect.width / metadata.width!, rect.height / metadata.height!);
};

const isSwipeGesture = (
  start: Coordinates,
  end: Coordinates,
  threshold: number
): boolean => {
  return (
    Math.abs(end.x - start.x) > threshold ||
    Math.abs(end.y - start.y) > threshold
  );
};

const mouseControl = <T extends HTMLElement>(
  targetElement: T,
  metadata: Metadata,
  control: AdbControl
): void => {
  let startCoordinates: Coordinates | null = null;

  targetElement.addEventListener("mousedown", handleStart);

  function handleStart(e: MouseEvent): void {
    const rate = getRate(metadata, targetElement);

    startCoordinates = calculateCoordinates(
      e,
      targetElement.getBoundingClientRect(),
      rate
    );

    targetElement.addEventListener("mouseup", handleEnd);
  }

  function handleEnd(e: MouseEvent): void {
    const rate = getRate(metadata, targetElement);

    const endCoordinates = calculateCoordinates(
      e,
      targetElement.getBoundingClientRect(),
      rate
    );

    if (startCoordinates && endCoordinates) {
      const isSwipe = isSwipeGesture(startCoordinates, endCoordinates, 100);

      if (isSwipe) {
        control.inputSwipe(
          startCoordinates.x,
          startCoordinates.y,
          endCoordinates.x,
          endCoordinates.y,
          1000
        );
      } else {
        control.inputTap(endCoordinates.x, endCoordinates.y);
      }
    }

    startCoordinates = null;
    targetElement.removeEventListener("mouseup", handleEnd);
  }
};

export default mouseControl;
