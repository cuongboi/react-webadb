"use client";

import StreamPanel from "@/components/StreamPanel";
import React, { createRef, useEffect } from "react";

export default function Home() {
  return (
    <main
      className={`flex flex-col h-screen items-center justify-center p-5 lg:p-10`}
    >
      <StreamPanel />
    </main>
  );
}
