import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Context {
  session: null | Session;
}

const AuthContext = createContext<Context>({
  session: null,
});

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session: session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useSession = () => useContext(AuthContext);
export default AuthWrapper;
