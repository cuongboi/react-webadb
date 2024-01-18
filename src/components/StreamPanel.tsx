import React, { useEffect } from "react";
import ControlBar from "./ControlBar";
import { useDevices } from "@/contexts/DevicesContext";

const StreamPanel: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { device, loadDevice, isLoading } = useDevices();
  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current && device) {
      device.pushStream(ref.current);
    }
  }, [ref.current, device]);

  return (
    <div
      ref={ref}
      className={`h-full aspect-[9/16] text-gray-900 [&>canvas]:w-full [&>canvas]:rounded-r-xl [&>canvas]:overflow-hidden relative z-10 rounded-r-xl ${
        device ? "" : "rounded-l-xl border border-gray-20 dark:border-gray-500"
      } ${className ?? ""}`}
    >
      {!device || isLoading ? (
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
          <h2 className="text-xl dark:text-white">No Devices</h2>
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
        </div>
      ) : (
        <ControlBar device={device} loadDevice={loadDevice} />
      )}
    </div>
  );
};

export default StreamPanel;
