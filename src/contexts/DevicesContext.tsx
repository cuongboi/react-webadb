"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  AdbDaemonWebUsbDeviceManager,
  AdbDaemonWebUsbDevice,
} from "@yume-chan/adb-daemon-webusb";
import AdbDevice from "@/utils/AdbDevice";

interface DevicesContextProps {
  device: AdbDevice | undefined;
  loadDevice: () => Promise<void>;
  isLoading: boolean;
}

const DevicesContext = createContext<DevicesContextProps | undefined>(
  undefined
);

export const DevicesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [device, setDevice] = useState<AdbDevice | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const Manager: AdbDaemonWebUsbDeviceManager | undefined =
    AdbDaemonWebUsbDeviceManager.BROWSER;

  const loadDevice = async () => {
    setIsLoading(true);
    Manager?.requestDevice()
      .then(async (device) => {
        if (device instanceof AdbDaemonWebUsbDevice) {
          const adbDevice = await AdbDevice.init(device);
          setDevice(adbDevice);
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  const value: DevicesContextProps = { device, loadDevice, isLoading };

  return (
    <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
  );
};

export const useDevices = (): DevicesContextProps => {
  const context = useContext(DevicesContext);

  if (!context) {
    throw new Error("useDevices must be used within a DevicesProvider");
  }

  return context;
};
