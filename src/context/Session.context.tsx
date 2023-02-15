// TODO: Refactor to use MOBX or REDUX for bigger application usage.
// TODO: Refactor to use Session Cookie from backend to secure the token from MITM Attack

// #region IMPORTS
import { LoginResponse } from "@/domains/Types.domains";
import React, { createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
// #endregion IMPORTS

const SessionContext = createContext<{
  session: LoginResponse | undefined;
  setSession: React.Dispatch<React.SetStateAction<LoginResponse>>;
}>({ session: undefined, setSession: () => undefined });

export default function SessionProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useLocalStorage<LoginResponse | undefined>(
    "_session",
    undefined
  );

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession: setSession as React.Dispatch<
          React.SetStateAction<LoginResponse>
        >,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
