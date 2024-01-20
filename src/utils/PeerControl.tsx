import AdbControl from "./AdbControl";
import PeerConnection from "./PeerConnection";

class PeerControl {
  constructor(private peerConnection: PeerConnection) {}

  public control() {
    return new Proxy({} as AdbControl, {
      get: (_, prop) => {
        return async (...args: any[]) => {
          await this.peerConnection.sendWithRetry({
            type: "control",
            data: {
              prop,
              args,
            },
          });
        };
      },
    });
  }
}

export default PeerControl;
