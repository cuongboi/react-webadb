import AdbControl from "./AdbControl";

const keyboardControl = (control: AdbControl) => {
  const specialKeyMapping: Record<string, string> = {
    Space: "SPACE",
    Backspace: "DEL",
    Enter: "ENTER",
    Delete: "DEL",
    Tab: "TAB",
    Shift: "SHIFT_LEFT",
    Control: "CTRL_LEFT",
    Alt: "ALT_LEFT",
    Meta: "META_LEFT",
    CapsLock: "CAPS_LOCK",
    Escape: "ESC",
    PageUp: "PAGE_UP",
    PageDown: "PAGE_DOWN",
    End: "END",
    Home: "HOME",
    ArrowLeft: "DPAD_LEFT",
    ArrowUp: "DPAD_UP",
    ArrowRight: "DPAD_RIGHT",
    ArrowDown: "DPAD_DOWN",
    Insert: "INSERT",
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    NumLock: "NUM_LOCK",
    ScrollLock: "SCROLL_LOCK",

    // Numpad keys
    Numpad0: "NUMPAD_0",
    Numpad1: "NUMPAD_1",
    Numpad2: "NUMPAD_2",
    Numpad3: "NUMPAD_3",
    Numpad4: "NUMPAD_4",
    Numpad5: "NUMPAD_5",
    Numpad6: "NUMPAD_6",
    Numpad7: "NUMPAD_7",
    Numpad8: "NUMPAD_8",
    Numpad9: "NUMPAD_9",
    NumpadAdd: "NUMPAD_ADD",
    NumpadSubtract: "NUMPAD_SUBTRACT",
    NumpadMultiply: "NUMPAD_MULTIPLY",
    NumpadDivide: "NUMPAD_DIVIDE",
    NumpadDecimal: "NUMPAD_DECIMAL",
    NumpadEnter: "NUMPAD_ENTER",
  };

  window.addEventListener("keydown", (e) => {
    const specialKeyEvent = specialKeyMapping[e.key];

    if (specialKeyEvent) {
      control.inputKeyevent(specialKeyEvent);
    } else {
      control.inputText(e.key);
    }
  });
};

export default keyboardControl;
