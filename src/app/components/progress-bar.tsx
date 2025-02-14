"use client";
import { useProgress } from "@/hooks/use-progress";
import React, { createContext } from "react";

export const ProgressBarContext = createContext({
  state: "initial",
  value: 0,
  start: () => {},
  done: () => {},
  reset: () => {}
});

const ProgressBar = ({ children }) => {
  const progress = useProgress();

  return (
    <ProgressBarContext.Provider value={progress}>
      {progress.state !== "initial" && (
      <div
        className="fixed top-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-blue-300 duration-300 transition-all ease-in-out"
        style={{ width: `${progress.value}%` }}
      />
      )}
      {children}
    </ProgressBarContext.Provider>
  );
};
export default ProgressBar;