"use client";

import StreamPanel from "@/components/StreamPanel";
import React, { createRef, useEffect } from "react";

export default function Home() {
  return (
    <main className={`flex flex-col min-h-screen items-center justify-center`}>
      <StreamPanel />
    </main>
  );
}
