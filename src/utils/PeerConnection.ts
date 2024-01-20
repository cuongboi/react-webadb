import { DataConnection, Peer, PeerError } from "peerjs";
import EventEmitter from "events";

enum PeerConnectionStatus {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  ERROR = "error",
}

class PeerConnection {
  eventEmitter: EventEmitter;
  #peer: Peer | undefined;
  #connection: DataConnection | undefined;

  get peer(): Peer | undefined {
    return this.#peer;
  }

  get connection(): DataConnection | undefined {
    return this.#connection;
  }

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public static async init(id?: string): Promise<PeerConnection> {
    const peerConnection = new PeerConnection();
    await peerConnection.start(id);
    return peerConnection;
  }

  public async start(id?: string): Promise<PeerConnection> {
    return new Promise((resolve) => {
      this._createPeer(id).then((peer) => {
        this.#peer = peer;

        this.#peer.on("open", () => {
          this._listen();

          window.addEventListener("beforeunload", () => {
            this.connection?.close();
          });

          resolve(this);
        });
      });
    });
  }

  public connect(id: string): Promise<DataConnection> {
    return new Promise((resolve) => {
      console.log("Connecting...");

      const connection = this.peer?.connect(id);
      this._handleConnectionEvents(connection!);

      connection?.on("open", () => {
        resolve(connection);
      });

      connection?.on("close", () => {
        this._handleConnectionClose();
      });

      connection?.on("error", this._emitConnectionError);
    });
  }

  public disconnect(): void {
    this.connection?.close();
  }

  public async send(data: any): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not established");
    }

    this.connection.send(data);
  }

  public async sendWithRetry(data: any): Promise<void> {
    const send = async () => {
      try {
        await this.connection?.send(data);
      } catch (error) {
        console.log("send error", error);
        setTimeout(send, 1000);
      }
    };

    await send();
  }

  public call(id: string): void {
    const call = this.peer?.call(id, this._fakeStream());

    call?.on("error", (error) => {
      console.log("call error", error);
    });

    call?.on("stream", (stream) => {
      console.log("call stream", stream);
      this.eventEmitter.emit("stream", stream);
    });

    call?.on("close", () => {
      console.log("call closed");
    });
  }

  public onData(callback: (data: any) => void): void {
    this.eventEmitter.on("data", callback);
  }

  public onStream(callback: (stream: any) => void): void {
    console.log("on Stream Set");
    this.eventEmitter.on("stream", callback);
  }

  public onConnectionChange<T extends string>(
    callback: (
      connection: DataConnection | null,
      status: PeerConnectionStatus,
      error?: PeerError<T>
    ) => void
  ): void {
    this.eventEmitter.off("changeConnection", () => {});
    this.eventEmitter.on("changeConnection", callback);
  }

  private async _createPeer(id?: string): Promise<Peer> {
    const Peer = (await import("peerjs")).default;
    return id ? new Peer(id) : new Peer();
  }

  private _listen(): void {
    this.eventEmitter.on("changeConnection", (connection, status) => {
      this.#connection = connection;
    });

    this.peer?.on("connection", (connection) => {
      this._handleConnectionEvents(connection);
    });

    this.peer?.on("error", this._emitConnectionError);
  }

  private _handleConnectionEvents(connection: DataConnection): void {
    connection.on("open", () => {
      this.#connection = connection;
      this._emitConnectionStatus(PeerConnectionStatus.CONNECTED);

      connection.on("data", (data) => {
        this.eventEmitter.emit("data", data);
      });
    });

    connection.on("close", () => {
      this._handleConnectionClose();
    });

    connection.on("error", this._emitConnectionError);
  }

  private _handleConnectionClose(): void {
    this.connection?.close();
    this._emitConnectionStatus(PeerConnectionStatus.DISCONNECTED);
  }

  private _emitConnectionStatus(status: PeerConnectionStatus): void {
    if (status === PeerConnectionStatus.CONNECTED) {
      this.eventEmitter.emit("changeConnection", this.connection, status);
    }

    if (status === PeerConnectionStatus.DISCONNECTED) {
      this.eventEmitter.emit("changeConnection", undefined, status);
    }
  }

  private _fakeStream(): MediaStream {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;

    const stream = canvas.captureStream(60);

    let frame = 0;

    const draw = () => {
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "white";
      context.font = "48px serif";
      context.fillText(`Frame: ${frame}`, 10, 50);

      frame += 1;

      requestAnimationFrame(draw);
    };

    draw();

    return stream;
  }

  private _emitConnectionError(error: Error): void {
    this.eventEmitter.emit(
      "changeConnection",
      undefined,
      PeerConnectionStatus.ERROR,
      error
    );
  }
}

export default PeerConnection;
