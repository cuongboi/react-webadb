"use client";

import React, { useEffect, createRef, useState } from "react";
import ControlBar from "@/components/ControlBar";
import PeerConnection from "@/utils/PeerConnection";
import mouseControl from "@/utils/AdbMouseControl";
import keyboardControl from "@/utils/AdbKeyboardControl";
import AdbControl from "@/utils/AdbControl";
import PeerControl from "@/utils/PeerControl";

const StreamPanel = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const id = params.id;
  const [hasStream, setHasStream] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [control, setControl] = useState<AdbControl>();
  const getVideo = (): HTMLVideoElement =>
    document.getElementById("remote-video") as HTMLVideoElement;

  useEffect(() => {
    (async () => {
      const video = getVideo();
      const peerConnection = await PeerConnection.init();
      const peerControl = new PeerControl(peerConnection);
      setControl(peerControl.control());

      peerConnection.onStream((stream) => {
        setHasStream(true);
        video.srcObject = stream;
      });

      peerConnection.onData((data) => {
        if (data.type === "metadata") {
          video.width = data.data?.width!;
          video.height = data.data?.height!
          mouseControl(video, data.data, peerControl.control());
          keyboardControl(peerControl.control());
        }
      });

      await peerConnection.connect(id);
      peerConnection.call(id);
    })();
  }, []);

  return (
    <main
      className={`flex flex-col h-screen items-center justify-center p-0 lg:p-10`}
    >
      <div
        className={`h-full w-fit ${
          hasStream ? "w-auto" : "aspect-[9/16]"
        } text-gray-900 flex flex-col items-center relative z-10 rounded-xl ${
          hasStream
            ? ""
            : "rounded-l-xl border border-gray-20 dark:border-gray-500"
        }`}
      >
        <video
          id="remote-video"
          className="h-[calc(100% - 2.5rem)] w-fit rounded-xl overflow-hidden"
        />
        {hasStream && (
          <>
            <ControlBar control={control} show={hasStream} />
            {!isPlay && (
              <div className="w-full h-full flex flex-col gap-5 justify-center items-center absolute top-0 left-0">
                <button
                  id="play-button"
                  className="p-2 flex text-white justify-center items-center focus:outline-none"
                  onClick={() => {
                    getVideo().play();
                    setIsPlay(true);
                  }}
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="play-circle"
                    width="2em"
                    height="2em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm160.3 445.4L432.2 725.8a31.9 31.9 0 01-51.2-25.8V334.1a31.9 31.9 0 0151.2-25.8l240.1 216.4a31.9 31.9 0 010 51.7z"></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default StreamPanel;
