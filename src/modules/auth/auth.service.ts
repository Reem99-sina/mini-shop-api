import { supabase } from "../../config/supabase";

export class AuthService {
  // Register
  static async register(data: {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
  }) {
    const { name, email, password, role } = data;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData?.user) {
      throw new Error("User not created or email confirmation required");
    }

    // Insert into users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: authData?.user.id,
        name,
        email,
        role: role || "user",
      })
      .select()
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    return userData;
  }
  static async getProfile(userId?: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userId)
      .single();

    if (error) throw error;
    return data;
  }
  // Login
  static async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = authData.user;
    const session = authData.session;

    if (!user || !session) {
      throw new Error("Login failed");
    }
    const profile = await this.getProfile(user.email);

    return {
      user: {
        id: user.id,
        name: profile?.name || user.user_metadata?.name || "",
        email: user.email,
        createdAt: user.created_at,
      },

      token: session.access_token,
      refreshToken: session.refresh_token,

      expiresAt: session.expires_at,
    };
  }

  // Current User
  static async getMe(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Forgot Password
  static async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: "Reset password email sent",
    };
  }
}
