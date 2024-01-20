"use client";

import React, { useEffect, useState } from "react";
import ControlBar from "./ControlBar";
import { useDevices } from "@/contexts/DevicesContext";
import PeerConnection from "@/utils/PeerConnection";
import QRCode from "react-qr-code";

const StreamPanel: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { device, loadDevice, isLoading } = useDevices();
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [playUrl, setPlayUrl] = useState<string>("");
  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const init = async () => {
      if (ref.current && device) {
        setPlayUrl(new URL(device.serial, window.location.href).toString());
        const peerConnection = await PeerConnection.init(device.serial);
        const stream = await device.getMediaStream();
        peerConnection.onData(async (data) => {
          if (data.type === "control") {
            try {
              // @ts-ignore
              await device.control?.[data.data.prop](...data.data.args);
            } catch (e) {
              console.log(e);
            }
          }
        });
        peerConnection.peer?.on("call", async (call) => {
          call.answer(stream);
          await peerConnection.sendWithRetry({
            type: "metadata",
            data: device.metadata,
          });
        });
      }
    };

    init();
  }, [ref.current, device]);

  return (
    <div
      ref={ref}
      className={`h-full text-gray-900 [&>canvas]:h-full [&>canvas]:rounded-r-xl [&>canvas]:overflow-hidden relative z-10 rounded-r-xl ${
        device
          ? "w-fit"
          : "rounded-l-xl border border-gray-20 dark:border-gray-500 aspect-[9/16]"
      }
      ${isLoading && !device ? "border-none w-0" : ""}
      ${className ?? ""}`}
    >
      {!isPlay ? (
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
          {device ? (
            <div className="flex flex-col items-center gap-5">
              <button
                className="p-5 h-12 flex justify-center items-center bg-gray-200 rounded-lg focus:outline-none"
                onClick={() => {
                  device.pushStream(ref.current!);
                  setIsPlay(true);
                }}
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="play-circle"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 768a320 320 0 110-640 320 320 0 010 640zm0-448a32 32 0 00-32 32v192a32 32 0 0064 0V416a32 32 0 00-32-32z"></path>
                </svg>
              </button>

              <p className="text-white">
                <a href={playUrl} target="_blank" rel="noreferrer">
                  {playUrl}
                </a>
              </p>
              <p>
                <QRCode value={playUrl} size={128} />
              </p>
            </div>
          ) : (
            <button
              className="p-5 h-12 flex justify-center items-center bg-gray-200 rounded-lg focus:outline-none"
              onClick={() => loadDevice()}
            >
              {isLoading ? (
                "Connecting ..."
              ) : (
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="mobile"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64zm-8 824H288V134h448v752zM472 784a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                </svg>
              )}
            </button>
          )}
        </div>
      ) : (
        <ControlBar control={device?.control} loadDevice={loadDevice} />
      )}
    </div>
  );
};

export default StreamPanel;
