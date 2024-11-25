import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";
import { OAuthProvider } from "node-appwrite";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;
  setHydrated(): void;
  verifySession(): Promise<void>;
  login(email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
  oauthLogin(provider: string): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,
      
      setHydrated() {
        set({ hydrated: true });
      },
      
      async verifySession() {
        try {
          const sessions = await account.listSessions();
          if (sessions.total > 0) {
            const session = await account.getSession("current");
            const user = await account.get<UserPrefs>();
            set({ session, user });
          }
        } catch (error) {
          set({ session: null, user: null, jwt: null });
        }
      },
      
      async login(email: string, password: string) {
        try {
          const sessions = await account.listSessions();
          if (sessions.total > 0) {
            await account.deleteSessions();
          }
<<<<<<< HEAD

=======
          
>>>>>>> 89f110a1ae805ed4dd2a50d63374bfee95c55590
          const session = await account.createEmailPasswordSession(email, password);
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);
<<<<<<< HEAD

          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }

=======
          
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }
          
>>>>>>> 89f110a1ae805ed4dd2a50d63374bfee95c55590
          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      
      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.error("Account creation error:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      
      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      
      async oauthLogin(provider: OAuthProvider) {
        try {
          await account.createOAuth2Session(
            provider,
<<<<<<< HEAD
            `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/login`,
=======
            `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/login`, 
>>>>>>> 89f110a1ae805ed4dd2a50d63374bfee95c55590
            `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/login`
          );
          await this.verifySession();
        } catch (error) {
          console.error("OAuth login failed:", error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);