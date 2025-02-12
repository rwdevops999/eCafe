"useClient"

import { UserType } from "@/types/ecafe";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextInterface {
    user: UserType|undefined;
    login: (value: UserType) => void,
    logout: () => void,
    isBlocked: () => boolean,
    isLoggedIn: () => boolean,
    hasAccess: () => boolean
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
    const [user, setUser] = useState<UserType|undefined>(undefined);

    const login = (value: UserType): void => {
      setUser(value!)
    }

    const logout = (): void => {
      setUser(undefined);
    }

    const isBlocked = (): boolean => {
      if (user) {
        return user.blocked;
      }

      return false;
    }

    const isLoggedIn = (): boolean => {
      if (user) {
        return true;
      }

      return false;
    }

    const hasAccess = () => false


    return (
      <UserContext.Provider value={{ user, login, logout, isBlocked, isLoggedIn, hasAccess }}>
        {children}
      </UserContext.Provider>
    );
};

export default {
    UserProvider,
    useUser
}
