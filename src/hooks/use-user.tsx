"useClient"

import { UserType } from "@/types/ecafe";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextInterface {
    user: UserType|undefined;
    setUser: (value: UserType|undefined) => void;
}

const UserContext = createContext<UserContextInterface|undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return context;
  };
  
export const UserProvider = ({children}:{children: ReactNode}) => {
    // const [user, setUser] = useState<UserType|undefined>({
    //     name: "",
    //     firstname: "",
    //     phone: "",
    //     email: "",
    //     password: "",
    //     attemps: 0,
    //     blocked: false
    // });
    const [user, setUser] = useState<UserType|undefined>(undefined);

    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
};

export default {
    UserProvider,
    useUser
}
