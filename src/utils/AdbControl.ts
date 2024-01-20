import { Adb } from "@yume-chan/adb";

class AdbControl {
  #adb = {} as Adb;

  get adb(): Adb {
    return this.#adb;
  }

  public static init(adb: Adb): AdbControl {
    const adbControl = new AdbControl();
    adbControl.bind(adb);

    return adbControl;
  }

  public bind(adb: Adb): void {
    this.#adb = adb;
  }

  public async getProp(prop: string): Promise<string> {
    try {
      return await this.adb.getProp(prop);
    } catch (error) {
      console.error(`Error getting property "${prop}":`, error);
      throw error;
    }
  }

  public async inputText(text: string): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(`input text "${text}"`);
    } catch (error) {
      console.error(`Error simulating text input "${text}":`, error);
      throw error;
    }
  }

  public async inputKeyevent(key: string): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(`input keyevent "${key}"`);
    } catch (error) {
      console.error(`Error simulating key event "${key}":`, error);
      throw error;
    }
  }

  public async inputTap(x: number, y: number): Promise<void> {
    try {
      await this.adb.subprocess.spawnAndWait(`input tap ${x} ${y}`);
    } catch (error) {
      console.error(`Error simulating tap at coordinates (${x}, ${y}):`, error);
      throw error;
    }
  }

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
