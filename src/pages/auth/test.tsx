import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"signup" | "verify" | "profile">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [profileData, setProfileData] = useState({
    fullName: "",
    company: "",
    role: ""
  });
  const [authMethod, setAuthMethod] = useState<"email" | "google" | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAuthMethod("email");

    try {
      const { data: existing } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (existing) {
        throw new Error("Email already registered");
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) throw signUpError;

      // Create user record but mark as inactive until verified
      const { error: insertError } = await supabase
        .from("users")
        .insert([{
          id: data.user?.id,
          email,
          auth_provider: "email",
          is_active: false,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      setStep("verify");
      toast.success("Verification code sent to your email");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    setAuthMethod("google");

    try {
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (googleError) throw googleError;

      // No need to set step here - user will be redirected after successful auth
    } catch (error: any) {
      setError(error.message);
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Verify the actual OTP entered by user (not hardcoded)
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email"
      });

      if (verifyError) throw verifyError;

      setStep("profile");
      toast.success("Email verified! Complete your profile");
    } catch (error: any) {
      setError("Invalid or expired code");
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Save profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profileData.fullName,
          company: profileData.company,
          role: profileData.role,
          onboarded: true
        });

      if (profileError) throw profileError;

      // Activate user (only for email/password users)
      if (authMethod === "email") {
        const { error: userError } = await supabase
          .from("users")
          .update({ is_active: true })
          .eq("id", user.id);

        if (userError) throw userError;
      }

      toast.success("Profile setup complete!");
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... [keep the existing render methods for verify and profile steps]

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <div className="max-w-md mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold text-center">SIGN UP</h1>
        <p className="text-center text-gray-400 mt-2">
          Choose your signup method
        </p>

        {/* Social Signup Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5" 
            />
            Continue with Google
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-[#0B0F1A] text-gray-400 text-sm">
              or sign up with email
            </span>
          </div>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              minLength={8}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
          >
            {loading ? "Sending code..." : "Continue with Email"}
          </button>
        </form>

        {/* ... [keep the rest of the footer links] ... */}
      </div>
    </div>
  );
}