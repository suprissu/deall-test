// TODO: Refactor to use MOBX or REDUX for bigger application usage.
// TODO: Refactor to use Session Cookie from backend to secure the token from MITM Attack

// #region IMPORTS
import { LoginResponse } from "@/domains/Types.domains";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// #endregion IMPORTS

const SessionContext = createContext<{
  session: LoginResponse | undefined;
  setSession: (data: LoginResponse | undefined) => void;
}>({ session: undefined, setSession: () => undefined });

export default function SessionProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<LoginResponse | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieSession = getCookie("_session") as string;
    setSession(cookieSession ? JSON.parse(cookieSession ?? "") : undefined);
    setLoading(false);
  }, []);

  const handleSession = useCallback((data: LoginResponse | undefined) => {
    setSession(data);
    if (data) setCookie("_session", data);
    else deleteCookie("_session");
  }, []);

  if (loading) return null;

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession: handleSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
