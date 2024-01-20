import StreamPanel from "@/components/StreamPanel";
import React from "react";

export default function Home() {
  return (
    <main
      className={`flex flex-col h-screen items-center justify-center p-0 lg:p-10`}
    >
      <StreamPanel />
    </main>
  );
}
