"use client";

import AdbControl from "@/utils/AdbControl";
import { useEffect, useState } from "react";

const ControlBar: React.FC<{
  show?: boolean;
  control?: AdbControl;
  loadDevice?: () => Promise<void>;
}> = ({ show: showInit = true, control, loadDevice }) => {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    setShow(showInit);
  }, [showInit]);

  return (
    <div className="flex items-center justify-center [&>button]:w-10 rounded-xl w-full h-10 bg-white">
      {show && (
        <>
          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_MENU")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="menu"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
            </svg>
          </button>

          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_HOME")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="home"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
            </svg>
          </button>

          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_BACK")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="arrow-left"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
            </svg>
          </button>

          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_VOLUME_UP")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="plus"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
              <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
            </svg>
          </button>

          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_VOLUME_DOWN")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="minus"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
            </svg>
          </button>

          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_POWER")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="poweroff"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M705.6 124.9a8 8 0 00-11.6 7.2v64.2c0 5.5 2.9 10.6 7.5 13.6a352.2 352.2 0 0162.2 49.8c32.7 32.8 58.4 70.9 76.3 113.3a355 355 0 0127.9 138.7c0 48.1-9.4 94.8-27.9 138.7a355.92 355.92 0 01-76.3 113.3 353.06 353.06 0 01-113.2 76.4c-43.8 18.6-90.5 28-138.5 28s-94.7-9.4-138.5-28a353.06 353.06 0 01-113.2-76.4A355.92 355.92 0 01184 650.4a355 355 0 01-27.9-138.7c0-48.1 9.4-94.8 27.9-138.7 17.9-42.4 43.6-80.5 76.3-113.3 19-19 39.8-35.6 62.2-49.8 4.7-2.9 7.5-8.1 7.5-13.6V132c0-6-6.3-9.8-11.6-7.2C178.5 195.2 82 339.3 80 506.3 77.2 745.1 272.5 943.5 511.2 944c239 .5 432.8-193.3 432.8-432.4 0-169.2-97-315.7-238.4-386.7zM480 560h64c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"></path>
            </svg>
          </button>

          <button
            className="p-2 flex justify-center items-center focus:outline-none"
            onClick={() => control?.inputKeyevent("KEYCODE_SYSRQ")}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="camera"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M864 248H728l-32.4-90.8a32.07 32.07 0 00-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 248H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V328c0-44.2-35.8-80-80-80zm8 536c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V328c0-4.4 3.6-8 8-8h186.7l17.1-47.8 22.9-64.2h250.5l22.9 64.2 17.1 47.8H864c4.4 0 8 3.6 8 8v456zM512 384c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160-71.6-160-160-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"></path>
            </svg>
          </button>
          {loadDevice && (
            <button
              className="p-2 w-20 flex justify-center items-center focus:outline-none"
              onClick={() => loadDevice?.()}
            >
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
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ControlBar;
