import { supabase } from "./supabaseClient";

export const signUp = async ({ email, password, username, phone }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, phone },
    },
  });

  return { data, error };
};

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};
