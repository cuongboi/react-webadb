import {
  Consumable,
  ReadableStream,
  WritableStream,
  DecodeUtf8Stream,
  SplitStringStream,
} from "@yume-chan/stream-extra";
import { AdbDaemonTransport, Adb } from "@yume-chan/adb";
import { BIN, VERSION } from "@yume-chan/fetch-scrcpy-server";
import { AdbScrcpyClient, AdbScrcpyOptions2_1 } from "@yume-chan/adb-scrcpy";
import { ScrcpyOptions2_1, ScrcpyVideoCodecId } from "@yume-chan/scrcpy";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";
import {
  AdbDaemonWebUsbDevice,
  AdbDaemonWebUsbConnection,
} from "@yume-chan/adb-daemon-webusb";
import AdbControl from "./AdbControl";
import mouseControl from "./AdbMouseControl";
import keyboardControl from "./AdbKeyboardControl";
import { WebCodecsDecoder } from "./WebCodecsDecoder";

const scrcpyServerPath = "/data/local/tmp/scrcpy-server.jar";

export interface Metadata {
  width: number;
  height: number;
}

class AdbDevice {
  public adb: Adb | undefined;
  public control: AdbControl | undefined;
  public scrcpy: AdbScrcpyClient | undefined;
  private connection: AdbDaemonWebUsbConnection | undefined;
  private _decoder: WebCodecsDecoder | undefined;

  #name: string = "Unknown";
  get name(): string {
    return this.#name;
  }

  #brand: string = "Unknown";
  get brand(): string {
    return this.#brand;
  }

  get serial(): string {
    return this._device.serial;
  }

  #metadata: Metadata = { width: 0, height: 0 };
  get metadata(): Metadata {
    return this.#metadata;
  }

  constructor(private readonly _device: AdbDaemonWebUsbDevice) {}

  static async init(device: AdbDaemonWebUsbDevice): Promise<AdbDevice> {
    const adbDevice = new AdbDevice(device);
    await adbDevice.connect();
    return adbDevice;
  }

  async connect(): Promise<AdbDevice> {
    this.connection = await this._device.connect();
    this.adb = new Adb(await this._transport());
    this.scrcpy = await this.startScrcpy();
    this.control = AdbControl.init(this.adb);
    this.#name = await this.getProperty("ro.product.model");
    this.#brand = await this.getProperty("ro.product.manufacturer");

    return this;
  }

  async getProperty(property: string): Promise<string> {
    return this.adb?.getProp(property) ?? "Unknown";
  }

  async cmd(command: string): Promise<string[]> {
    if (!this.adb) {
      throw new Error("adb not connected");
    }

    const adb = this.adb;
    const output: string[] = [];

    const abortController = new AbortController();
    const process = await adb.subprocess.spawn(command);

    try {
      await process.stdout
        .pipeThrough(new DecodeUtf8Stream())
        .pipeThrough(new SplitStringStream("\n"))
        .pipeTo(
          new WritableStream({
            write(chunk) {
              output.push(chunk);
            },
          }),
          { signal: abortController.signal, preventCancel: true }
        );
    } catch (e) {
      if (!abortController.signal.aborted) {
        throw e;
      }
    }

    return output;
  }

  async startScrcpy(): Promise<AdbScrcpyClient> {
    if (!this.adb) {
      throw new Error("adb not connected");
    }

    const scrcpyServerBin: ArrayBuffer = await fetch(BIN).then((res) =>
      res.arrayBuffer()
    );

    await AdbScrcpyClient.pushServer(
      this.adb,
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Consumable(new Uint8Array(scrcpyServerBin)));
          controller.close();
        },
      })
    );

    const options = new AdbScrcpyOptions2_1(
      new ScrcpyOptions2_1({
        video: true,
        audioSource: "output",
      })
    );

    return AdbScrcpyClient.start(
      this.adb,
      scrcpyServerPath,
      VERSION.replace("v", ""),
      options
    );
  }

  public async pushStream<T extends HTMLElement>(
    targetElement: T
  ): Promise<void> {
    if (!this.adb) {
      throw new Error("adb not connected");
    }

    this._stream();
    targetElement.appendChild(this._decoder?.renderer!);

    this.scrcpy?.videoStream?.then(({ stream, metadata }) => {
      mouseControl(targetElement, metadata, this.control!);
      keyboardControl(this.control!);
    });
  }

  public getMediaStream(): MediaStream {
    if (!this.adb) {
      throw new Error("adb not connected");
    }

    this._stream();
    return this._decoder?.getMediaStream()!;
  }

  public async close(): Promise<void> {
    this.scrcpy?.close();
  }

  private _stream() {
    if (!this.adb) {
      throw new Error("adb not connected");
    }

    if (!this._decoder) {
      this._decoder = new WebCodecsDecoder(ScrcpyVideoCodecId.H264);

      this.scrcpy?.videoStream?.then(({ stream, metadata }) => {
        this.#metadata = {
          width: metadata.width || 0,
          height: metadata.height || 0,
        };
        stream.pipeTo(this._decoder?.writable!);
      });
    }
  }

  private async _transport() {
    const credentialStore = new AdbWebCredentialStore();

    return AdbDaemonTransport.authenticate({
      serial: this._device.serial,
      connection: this.connection!,
      credentialStore,
    });
  }
}

export default AdbDevice;
