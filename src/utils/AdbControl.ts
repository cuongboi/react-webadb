import { Adb } from "@yume-chan/adb";

class AdbControl {
  constructor(private readonly adb: Adb) {}

  /**
   * Get a system property from the device.
   *
   * @param prop - The property name.
   * @returns A Promise that resolves to the property value.
   */
  public async getProp(prop: string): Promise<string> {
    try {
      return await this.adb.getProp(prop);
    } catch (error) {
      console.error(`Error getting property "${prop}":`, error);
      throw error;
    }
  }

  /**
   * Simulate text input on the device.
   *
   * @param text - The text to input.
   * @returns A Promise that resolves when the input is complete.
   */
  public async inputText(text: string): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(`input text "${text}"`);
    } catch (error) {
      console.error(`Error simulating text input "${text}":`, error);
      throw error;
    }
  }

  /**
   * Simulate a key press on the device.
   *
   * @param key - The key code to simulate.
   * @returns A Promise that resolves when the key press is complete.
   */
  public async inputKeyevent(key: string): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(`input keyevent "${key}"`);
    } catch (error) {
      console.error(`Error simulating key event "${key}":`, error);
      throw error;
    }
  }

  /**
   * Simulate a tap on the touchscreen at the specified coordinates.
   *
   * @param x - The x-coordinate.
   * @param y - The y-coordinate.
   * @returns A Promise that resolves when the tap is complete.
   */
  public async inputTap(x: number, y: number): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(`input tap ${x} ${y}`);
    } catch (error) {
      console.error(`Error simulating tap at coordinates (${x}, ${y}):`, error);
      throw error;
    }
  }

  /**
   * Simulate a swipe on the touchscreen between two sets of coordinates.
   *
   * @param x1 - The starting x-coordinate.
   * @param y1 - The starting y-coordinate.
   * @param x2 - The ending x-coordinate.
   * @param y2 - The ending y-coordinate.
   * @param duration - The duration of the swipe in milliseconds.
   * @returns A Promise that resolves when the swipe is complete.
   */
  public async inputSwipe(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    duration: number
  ): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(
        `input touchscreen swipe ${x1} ${y1} ${x2} ${y2} ${duration}`
      );
    } catch (error) {
      console.error(`Error simulating swipe:`, error);
      throw error;
    }
  }
}

export default AdbControl;
