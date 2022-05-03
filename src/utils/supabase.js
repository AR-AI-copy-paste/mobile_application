import { createClient } from "@supabase/supabase-js";

//ENV variables import
import { SUPA_URL, SUPA_KEY } from "@env";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { startAsync, makeRedirectUri } from "expo-auth-session";

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPA_URL, SUPA_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});

export const signInWithProvider = async (provider) => {
  const returnUrl = makeRedirectUri({ useProxy: false });
  const authUrl = `${SUPA_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;

  const response = await startAsync({ authUrl, returnUrl });

  if (!response || !response.params?.refresh_token) {
    return;
  }

  await supabase.auth.signIn({
    refreshToken: response.params.refresh_token,
  });
};