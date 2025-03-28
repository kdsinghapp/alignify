// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";

// export default function SignIn() {
//   const navigate = useNavigate();
//   const [error, setError] = useState<string | null>(null);
//   const isDevelopment = window.location.hostname === 'localhost';
//   const isMainDomain = window.location.hostname === 'alignify.net' || window.location.hostname === 'www.alignify.net';
//   const isBetaDomain = window.location.hostname === 'beta.alignify.net';

//   const signupUrl = isMainDomain ? 'https://alignify.net/auth/signup' : '/auth/signup';

//   useEffect(() => {
//     // Check if there's already a session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         navigate('/dashboard');
//       }
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log('Auth state change in SignIn:', event, session);

//       if (event === "SIGNED_IN" && session) {
//         try {
//           // Check if user exists in our users table
//           const { data: userData, error: userError } = await supabase
//             .from('users')
//             .select('*')
//             .eq('id', session.user.id)
//             .maybeSingle();

//           if (userError) {
//             console.error('Error fetching user:', userError);
//             setError("Error during sign in");
//             toast.error("Error during sign in");
//             return;
//           }

//           // If user doesn't exist in our table, create them
//           if (!userData) {
//             const { error: insertError } = await supabase
//               .from('users')
//               .insert([{
//                 id: session.user.id,
//                 email: session.user.email
//               }]);

//             if (insertError) {
//               console.error('Error creating user:', insertError);
//               setError("Error during sign in");
//               toast.error("Error during sign in");
//               return;
//             }
//           }

//           toast.success("Sign-in successful!");
//           navigate("/dashboard");
//         } catch (error) {
//           console.error('Error in sign in:', error);
//           setError("An error occurred during sign in");
//           toast.error("An error occurred during sign in");
//         }
//       } else if (event === "SIGNED_OUT") {
//         navigate("/auth/signin");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
//               <p className="text-gray-400 mt-2">Bring your data product ideas to life</p>
//             </div>

//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}

//             <Auth
//               supabaseClient={supabase}
//               appearance={{
//                 theme: ThemeSupa,
//                 variables: {
//                   default: {
//                     colors: {
//                       brand: 'rgb(147 51 234)',
//                       brandAccent: 'rgb(126 34 206)',
//                       inputBackground: 'rgba(255, 255, 255, 0.05)',
//                       inputText: 'white',
//                       inputPlaceholder: 'rgb(156 163 175)',
//                       inputBorder: 'rgba(255, 255, 255, 0.1)',
//                     },
//                   },
//                 },
//                 className: {
//                   container: 'space-y-4',
//                   button: 'w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition-colors',
//                   label: 'block text-sm font-medium text-gray-300 mb-1.5',
//                   input: 'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
//                   divider: 'my-6',
//                   anchor: 'text-sm text-gray-400 hover:text-white transition-colors',
//                 },
//               }}
//               providers={[]}
//               redirectTo={`${window.location.origin}/dashboard`}
//               view="sign_in"
//               theme="dark"
//               showLinks={false}
//             />

//             <div className="text-center text-sm">
//               <span className="text-gray-400">Don't have an account?</span>{" "}
//               <Link to={signupUrl} className="text-purple-400 hover:text-purple-300 font-medium">
//                 Sign up
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const isDevelopment = window.location.hostname === "localhost";
  const isMainDomain =
    window.location.hostname === "alignify.net" ||
    window.location.hostname === "www.alignify.net";
  const isBetaDomain = window.location.hostname === "beta.alignify.net";
  const [loading, setLoading] = useState(false);

  const signupUrl = isMainDomain
    ? "http://localhost:8080/auth/signup"
    : "/auth/signup";

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    console.log("Starting Google Sign-In");

    try {
      // First check if user is already authenticated
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) {
        throw new Error("You're already signed in");
      }

      // Initiate Google OAuth for sign-in
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: isDevelopment
            ? "http://localhost:8080/auth/callback"
            : "https://alignify.net/auth/callback",
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (googleError) {
        throw googleError;
      }

      // Listen for auth state changes to complete sign-in
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          console.log("Google Sign-In completed, verifying user...");

          // Check if user exists in your database
          const { data: existingUser, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userError) {
            throw userError;
          }

          if (!existingUser) {
            // User not found in database - sign them out and show error
            await supabase.auth.signOut();
            throw new Error("User not registered. Please sign up first.");
          }

          // Update user session info
          await supabase
            .from("users")
            .update({
              last_login_at: new Date().toISOString(),
              session_start: new Date().toISOString(),
              session_token: session.access_token,
              session_expiry: new Date(session.expires_at * 1000).toISOString(),
            })
            .eq("id", session.user.id);

          toast.success("Sign-in successful!");
          navigate("/dashboard");
          subscription.unsubscribe();
        }
      });
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await updateSessionStart(session.user.id);
        navigate("/dashboard");
        return;
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change in SignIn:", event, session);

      if (event === "SIGNED_IN" && session) {
        try {
          await updateSessionStart(session.user.id);

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (userError) {
            console.error("Error fetching user:", userError);
            setError("Error during sign in");
            toast.error("Error during sign in");
            return;
          }

          if (!userData) {
            const { error: insertError } = await supabase.from("users").insert([
              {
                id: session.user.id,
                email: session.user.email,
                session_start: new Date().toISOString(),
              },
            ]);

            if (insertError) {
              console.error("Error creating user:", insertError);
              setError("Error during sign in");
              toast.error("Error during sign in");
              return;
            }
          }

          toast.success("Sign-in successful!");
          navigate("/dashboard");
        } catch (error) {
          console.error("Error in sign in:", error);
          setError("An error occurred during sign in");
          toast.error("An error occurred during sign in");
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/auth/signin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const updateSessionStart = async (userId: string) => {
    const { error } = await supabase
      .from("users")
      .update({ session_start: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating session_start:", error);
      toast.error("Failed to update session start time.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-400 mt-2">
                Bring your data product ideas to life
              </p>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center"
              >
                Sign in with Google
              </button>
            </div>

            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "rgb(147 51 234)",
                      brandAccent: "rgb(126 34 206)",
                      inputBackground: "rgba(255, 255, 255, 0.05)",
                      inputText: "white",
                      inputPlaceholder: "rgb(156 163 175)",
                      inputBorder: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                },
                className: {
                  container: "space-y-4",
                  button:
                    "w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition-colors",
                  label: "block text-sm font-medium text-gray-300 mb-1.5",
                  input:
                    "w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                  divider: "my-6",
                  anchor:
                    "text-sm text-gray-400 hover:text-white transition-colors",
                },
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/dashboard`}
              view="sign_in"
              theme="dark"
              showLinks={false}
            />

            <div className="text-center text-sm">
              <span className="text-gray-400">Don't have an account?</span>{" "}
              <Link
                to={signupUrl}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign up
              </Link>
            </div>
            {error && (
              <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
