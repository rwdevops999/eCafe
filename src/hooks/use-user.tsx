"useClient"

import { UserType } from "@/types/ecafe";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextInterface {
    user: UserType;
    setUser: (value: UserType) => void;
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
    const [user, setUser] = useState<UserType>({
        name: "",
        firstname: "",
        phone: "",
        email: "",
        password: "",
    });
  
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
