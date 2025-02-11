"useClient"

import { UserType } from "@/types/ecafe";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface DebugContextInterface {
    debug: boolean;
    setDebug: (value: boolean) => void;
}

const DebugContext = createContext<DebugContextInterface|undefined>(undefined);

export const useDebug = () => {
    const context = useContext(DebugContext);
    if (context === undefined) {
      throw new Error("useDebug must be used within a DebugProvider");
    }
    return context;
  };
  
export const DebugProvider = ({children}:{children: ReactNode}) => {
    const [debug, setDebug] = useState<boolean>(false);

    return (
      <DebugContext.Provider value={{ debug, setDebug }}>
        {children}
      </DebugContext.Provider>
    );
};

export default {
    DebugProvider,
    useDebug
}
