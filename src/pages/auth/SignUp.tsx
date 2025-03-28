// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import {
//   ArrowRight,
//   ChevronDown,
//   BarChart2,
//   Users,
//   Rocket,
//   Copy,
//   Share2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { CardSpotlight } from "@/components/ui/card-spotlight";
// import { TypeWriter } from "@/components/ui/type-writer";
// import { motion } from "framer-motion";
// import { Transform } from "@/components/dashboard/components/signup/Transform";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [role, setRole] = useState("User"); // Default Role
//   const isDevelopment = window.location.hostname === "localhost";
//   const isMainDomain =
//     window.location.hostname === "alignify.net" ||
//     window.location.hostname === "www.alignify.net";
//   const isBetaDomain = window.location.hostname === "beta.alignify.net";
//   const signinUrl = isMainDomain
//     ? "https://alignify.net/auth/signin"
//     : "/auth/signin";

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const fadeUpVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   };

//   useEffect(() => {
//     // Check if there's already a session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         setSessionStartTime(new Date());
//         updateUserSession(
//           session.user.id,
//           session.access_token,
//           session.expires_at
//         );
//         navigate("/dashboard");
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log("Auth state change in SignUp:", event, session);

//       if (event === "SIGNED_IN" && session) {
//         setLoading(true);
//         setSessionStartTime(new Date());
//         try {
//           const { data: existingUser, error: checkError } = await supabase
//             .from("users")
//             .select("*")
//             .eq("id", session.user.id)
//             .maybeSingle();

//           if (checkError) {
//             console.error("Error checking user:", checkError);
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           // Only insert if user doesn't exist
//           if (!existingUser) {
//             const { error: insertError } = await supabase.from("users").insert([
//               {
//                 id: session.user.id,
//                 email: session.user.email,
//                 session_start: new Date().toISOString(),
//                 session_token: session.access_token,
//                 session_expiry: new Date(
//                   session.expires_at * 1000
//                 ).toISOString(),
//                 auth_provider: session.user.app_metadata.provider,
//                 last_login_at: new Date().toISOString(),
//                 is_active: true,
//                 // role: role,
//               },
//             ]);

//             if (insertError) {
//               console.error("Error creating user:", insertError);
//               toast.error("Error during sign up");
//               setError("Error during sign up");
//               setLoading(false);
//               return;
//             }
//           } else {
//             // Update existing user's session details
//             await updateUserSession(
//               session.user.id,
//               session.access_token,
//               session.expires_at
//             );
//           }

//           toast.success("Sign-up successful!");
//           navigate("/dashboard");
//         } catch (error) {
//           console.error("Error in auth state change:", error);
//           toast.error("An error occurred during sign up");
//           setError("An error occurred during sign up");
//         } finally {
//           setLoading(false); // Stop loading regardless of success or failure
//         }
//       } else if (event === "SIGNED_OUT") {
//         const sessionEndTime = new Date();
//         const sessionLength = sessionEndTime - sessionStartTime;

//         // Update session_end and session_duration for the user
//         await supabase
//           .from("users")
//           .update({
//             session_end: sessionEndTime.toISOString(),
//             session_duration: `${sessionLength} milliseconds`,
//           })
//           .eq("id", session.user.id);

//         navigate("/auth/signin");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate, sessionStartTime]);

//   const updateUserSession = async (userId, accessToken, expiresAt) => {
//     await supabase
//       .from("users")
//       .update({
//         session_start: new Date().toISOString(),
//         session_token: accessToken,
//         session_expiry: new Date(expiresAt * 1000).toISOString(),
//         last_login_at: new Date().toISOString(),
//         is_active: true,
//       })
//       .eq("id", userId);
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       {/* Navigation */}

//     <Transform/>
//       {/* Auth Form */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//         id="signup-form"
//         className="max-w-md mx-auto px-6 py-24"
//       >
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             {/* <div>
//               <label
//                 htmlFor="role"
//                 className="block text-sm font-medium text-gray-300 mb-1.5"
//               >
//                 Role
//               </label>
//               <select
//                 id="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 required
//               >
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//                 <option value="other">Other</option>
//               </select>
//             </div> */}
//             <Auth
//               supabaseClient={supabase}
//               appearance={{
//                 theme: ThemeSupa,
//                 variables: {
//                   default: {
//                     colors: {
//                       brand: "rgb(168 85 247)",
//                       brandAccent: "rgb(147 51 234)",
//                       inputBackground: "rgb(17 24 39)",
//                       inputText: "white",
//                       inputPlaceholder: "rgb(156 163 175)",
//                     },
//                   },
//                 },
//                 className: {
//                   container: "auth-container",
//                   button:
//                     "auth-button bg-purple-500 hover:bg-purple-600 text-white",
//                   label: "auth-label text-gray-300",
//                   input: "auth-input bg-gray-900 text-white border-gray-700",
//                 },
//               }}
//               // Added by prashant
//               providers={["google"]}
//               // providers={[]}
//               redirectTo={`https://gvovhdgpgfxlmzckxtvd.supabase.co/auth/callback`}
//               view="sign_up"
//               theme="dark"
//             />
//             {/* Added by Prashant */}
//             {loading && (
//               <div className="text-center text-gray-400">
//                 Signing up... Please wait.
//               </div>
//             )}
//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Transform } from "@/components/dashboard/components/signup/Transform";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Determine the environment (local or production)
//   const isDevelopment = window.location.hostname === "localhost";
//   const redirectUrl = isDevelopment
//     ? "http://localhost:8080/auth/callback"
//     : "https://gvovhdgpgfxlmzckxtvd.supabase.co/auth/callback";

//   useEffect(() => {
//     // Check if there's already a session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         setSessionStartTime(new Date());
//         updateUserSession(
//           session.user.id,
//           session.access_token,
//           session.expires_at,
//           session.user.app_metadata.provider
//         );
//         navigate("/dashboard");
//       }
//     });

//     // Listen for auth state changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log("Auth state change in SignUp:", event, session);

//       if (event === "SIGNED_IN" && session) {
//         setLoading(true);
//         setSessionStartTime(new Date());
//         try {
//           // Check if the user already exists by email
//           const { data: existingUser, error: checkError } = await supabase
//             .from("users")
//             .select("*")
//             .eq("email", session.user.email)
//             .maybeSingle();

//           if (checkError) {
//             console.error("Error checking user:", checkError);
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           // If the user already exists, show an error and prevent login
//           if (existingUser) {
//             toast.error("User already exists. Please log in instead.");
//             setError("User already exists. Please log in instead.");
//             setLoading(false);

//             // Sign out the user to prevent them from logging in
//             await supabase.auth.signOut();
//             return;
//           }

//           // Insert new user if they don't exist
//           const userData = {
//             id: session.user.id,
//             email: session.user.email,
//             session_start: new Date().toISOString(),
//             session_token: session.access_token,
//             session_expiry: new Date(session.expires_at * 1000).toISOString(),
//             auth_provider: session.user.app_metadata.provider,
//             last_login_at: new Date().toISOString(),
//             is_active: true,
//           };

//           // Add Google ID if the user signed up with Google
//           if (session.user.app_metadata.provider === "google") {
//             userData.google_id = session.user.user_metadata.sub;
//           }

//           const { error: insertError } = await supabase
//             .from("users")
//             .insert([userData]);

//           if (insertError) {
//             console.error("Error creating user:", insertError);
//             console.error("Full error object:", JSON.stringify(insertError, null, 2));
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           toast.success("Sign-up successful!");
//           navigate("/dashboard");
//         } catch (error) {
//           console.error("Error in auth state change:", error);
//           toast.error("An error occurred during sign up");
//           setError("An error occurred during sign up");
//         } finally {
//           setLoading(false); // Stop loading regardless of success or failure
//         }
//       } else if (event === "SIGNED_OUT") {
//         const sessionEndTime = new Date();
//         const sessionLength = sessionEndTime - sessionStartTime;

//         // Update session_end and session_duration for the user
//         if (session?.user?.id) {
//           await supabase
//             .from("users")
//             .update({
//               session_end: sessionEndTime.toISOString(),
//               session_duration: `${sessionLength} milliseconds`,
//             })
//             .eq("id", session.user.id);
//         }

//         navigate("/auth/signin");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate, sessionStartTime]);

//   // Function to update user session details
//   const updateUserSession = async (userId, accessToken, expiresAt, provider) => {
//     const updateData = {
//       session_start: new Date().toISOString(),
//       session_token: accessToken,
//       session_expiry: new Date(expiresAt * 1000).toISOString(),
//       last_login_at: new Date().toISOString(),
//       is_active: true,
//     };

//     // Add Google ID if the user signed up with Google
//     if (provider === "google") {
//       const { data: user } = await supabase
//         .from("users")
//         .select("google_id")
//         .eq("id", userId)
//         .single();

//       if (!user.google_id) {
//         updateData.google_id = user.user_metadata.sub;
//       }
//     }

//     await supabase
//       .from("users")
//       .update(updateData)
//       .eq("id", userId);
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       <Transform />
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <Auth
//               supabaseClient={supabase}
//               appearance={{
//                 theme: ThemeSupa,
//                 variables: {
//                   default: {
//                     colors: {
//                       brand: "rgb(168 85 247)",
//                       brandAccent: "rgb(147 51 234)",
//                       inputBackground: "rgb(17 24 39)",
//                       inputText: "white",
//                       inputPlaceholder: "rgb(156 163 175)",
//                     },
//                   },
//                 },
//                 className: {
//                   container: "auth-container",
//                   button: "auth-button bg-purple-500 hover:bg-purple-600 text-white",
//                   label: "auth-label text-gray-300",
//                   input: "auth-input bg-gray-900 text-white border-gray-700",
//                 },
//               }}
//               providers={["google"]}
//               redirectTo={redirectUrl}
//               view="sign_up"
//               theme="dark"
//             />
//             {loading && (
//               <div className="text-center text-gray-400">
//                 Signing up... Please wait.
//               </div>
//             )}
//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Transform } from "@/components/dashboard/components/signup/Transform";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Determine the environment (local or production)
//   const isDevelopment = window.location.hostname === "localhost";
//   const redirectUrl = "https://gvovhdgpgfxlmzckxtvd.supabase.co/auth/callback";

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         setSessionStartTime(new Date());
//         updateUserSession(
//           session.user.id,
//           session.access_token,
//           session.expires_at,
//           session.user.app_metadata.provider
//         );
//         navigate("/dashboard");
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {

//       if (event === "SIGNED_IN" && session) {
//         console.log("Session data:", session);
//         console.log("User metadata:", session.user.user_metadata);
//         console.log("App metadata:", session.user.app_metadata);

//         setLoading(true);
//         setSessionStartTime(new Date());
//         try {
//           const { data: existingUser, error: checkError } = await supabase
//             .from("users")
//             .select("*")
//             .or(
//               `email.eq.${session.user.email},google_id.eq.${session.user.user_metadata.sub}`
//             )
//             .maybeSingle();

//           console.log("Existing user check:", existingUser);
//           console.log("Check error:", checkError);

//           if (checkError) {
//             console.error("Error checking user:", checkError);
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           if (existingUser) {
//             await updateUserSession(
//               session.user.id,
//               session.access_token,
//               session.expires_at,
//               session.user.app_metadata.provider
//             );
//             toast.success("Sign-in successful!");
//             navigate("/dashboard");
//             return;
//           }

//           const userData = {
//             id: session.user.id,
//             email: session.user.email,
//             session_start: new Date().toISOString(),
//             session_token: session.access_token,
//             session_expiry: new Date(session.expires_at * 1000).toISOString(),
//             auth_provider: session.user.app_metadata.provider,
//             last_login_at: new Date().toISOString(),
//             is_active: true,
//           };

//           // Add Google ID if the user signed up with Google
//           if (session.user.app_metadata.provider === "google") {
//             userData.google_id = session.user.user_metadata.sub;
//           }

//           console.log("User data to insert/update:", userData);

//           const { error: insertError } = await supabase
//             .from("users")
//             .insert([userData]);

//           console.log("Insert error:", insertError);

//           if (insertError) {
//             console.error("Error creating user:", insertError);
//             console.error(
//               "Full error object:",
//               JSON.stringify(insertError, null, 2)
//             );
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           toast.success("Sign-up successful!");
//           navigate("/dashboard");
//         } catch (error) {
//           console.error("Error in auth state change:", error);
//           toast.error("An error occurred during sign up");
//           setError("An error occurred during sign up");
//         } finally {
//           setLoading(false); // Stop loading regardless of success or failure
//         }
//       } else if (event === "SIGNED_OUT") {
//         const sessionEndTime = new Date();
//         const sessionLength = sessionEndTime - sessionStartTime;

//         console.log("Session end time:", sessionEndTime);
//         console.log("Session length:", sessionLength);

//         // Update session_end and session_duration for the user
//         if (session?.user?.id) {
//           const { error: updateError } = await supabase
//             .from("users")
//             .update({
//               session_end: sessionEndTime.toISOString(),
//               session_duration: `${sessionLength} milliseconds`,
//             })
//             .eq("id", session.user.id);

//           console.log("Session update error:", updateError);
//         }

//         navigate("/auth/signin");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate, sessionStartTime]);

//   // Function to update user session details
//   const updateUserSession = async (
//     userId,
//     accessToken,
//     expiresAt,
//     provider
//   ) => {
//     const updateData = {
//       session_start: new Date().toISOString(),
//       session_token: accessToken,
//       session_expiry: new Date(expiresAt * 1000).toISOString(),
//       last_login_at: new Date().toISOString(),
//       is_active: true,
//     };

//     // Add Google ID if the user signed up with Google
//     if (provider === "google") {
//       const { data: user } = await supabase
//         .from("users")
//         .select("google_id")
//         .eq("id", userId)
//         .single();

//       console.log("User data for Google ID:", user);

//       if (!user.google_id) {
//         updateData.google_id = user.user_metadata.sub;
//       }
//     }

//     console.log("Update data:", updateData);

//     const { error: updateError } = await supabase
//       .from("users")
//       .update(updateData)
//       .eq("id", userId);

//     console.log("Update error:", updateError);

//     if (updateError) {
//       console.error("Error updating user session:", updateError);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       {/* <Transform /> */}
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <Auth
//               supabaseClient={supabase}
//               appearance={{
//                 theme: ThemeSupa,
//                 variables: {
//                   default: {
//                     colors: {
//                       brand: "rgb(168 85 247)",
//                       brandAccent: "rgb(147 51 234)",
//                       inputBackground: "rgb(17 24 39)",
//                       inputText: "white",
//                       inputPlaceholder: "rgb(156 163 175)",
//                     },
//                   },
//                 },
//                 className: {
//                   container: "auth-container",
//                   button:
//                     "auth-button bg-purple-500 hover:bg-purple-600 text-white",
//                   label: "auth-label text-gray-300",
//                   input: "auth-input bg-gray-900 text-white border-gray-700",
//                 },
//               }}
//               providers={["google"]}
//               redirectTo={redirectUrl}
//               view="sign_up"
//               theme="dark"
//             />
//             {loading && (
//               <div className="text-center text-gray-400">
//                 Signing up... Please wait.
//               </div>
//             )}
//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Transform } from "@/components/dashboard/components/signup/Transform";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const isDevelopment = window.location.hostname === "localhost";
//   const redirectUrl = isDevelopment
//     ? "http://localhost:8080"
//     : "https://gvovhdgpgfxlmzckxtvd.supabase.co/auth/callback";

//   useEffect(() => {
//     console.log("Data");
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         console.log("Session start time here", new Date());
//         setSessionStartTime(new Date());
//         updateUserSession(
//           session.user.id,
//           session.access_token,
//           session.expires_at,
//           session.user.app_metadata.provider
//         );
//         navigate("/dashboard");
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log("DATA", session);
//       if (event === "SIGNED_IN" && session) {
//         console.log("Session data:", session);
//         console.log("User metadata:", session.user.user_metadata);
//         console.log("App metadata:", session.user.app_metadata);

//         setLoading(true);
//         setSessionStartTime(new Date());

//         try {
//           const { data: existingUser, error: checkError } = await supabase
//             .from("users")
//             .select("*")
//             .or(
//               `email.eq.${session.user.email},google_id.eq.${session.user.user_metadata.sub}`
//             )
//             .maybeSingle();

//           console.log("Existing user check:", existingUser);
//           console.log("Check error:", checkError);

//           if (checkError) {
//             console.error("Error checking user:", checkError);
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           if (existingUser) {
//             await updateUserSession(
//               session.user.id,
//               session.access_token,
//               session.expires_at,
//               session.user.app_metadata.provider
//             );
//             toast.success("Sign-in successful!");
//             navigate("/dashboard");
//             return;
//           }

//           const userData = {
//             id: session.user.id,
//             email: session.user.email,
//             session_start: new Date().toISOString(),
//             session_token: session.access_token,
//             session_expiry: new Date(session.expires_at * 1000).toISOString(),
//             auth_provider: session.user.app_metadata.provider,
//             last_login_at: new Date().toISOString(),
//             is_active: true,
//           };

//           if (session.user.app_metadata.provider === "google") {
//             userData.google_id = session.user.user_metadata.sub;
//           }

//           console.log("User data to insert/update:", userData);

//           const { error: insertError } = await supabase
//             .from("users")
//             .insert([userData]);

//           console.log("Insert error:", insertError);

//           if (insertError) {
//             console.error("Error creating user:", insertError);
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           await updateUserSession(
//             session.user.id,
//             session.access_token,
//             session.expires_at,
//             session.user.app_metadata.provider
//           );

//           toast.success("Sign-up successful!");
//           navigate("/dashboard");
//         } catch (error) {
//           console.error("Error in auth state change:", error);
//           toast.error("An error occurred during sign up");
//           setError("An error occurred during sign up");
//         } finally {
//           setLoading(false);
//         }
//       } else if (event === "SIGNED_OUT") {
//         const sessionEndTime = new Date();
//         const sessionLength = sessionEndTime - sessionStartTime;

//         console.log("Session end time:", sessionEndTime);
//         console.log("Session length:", sessionLength);

//         // Update session_end and session_duration for the user
//         if (session?.user?.id) {
//           const { error: updateError } = await supabase
//             .from("users")
//             .update({
//               session_end: sessionEndTime.toISOString(),
//               session_duration: `${sessionLength} milliseconds`,
//             })
//             .eq("id", session.user.id);

//           console.log("Session update error:", updateError);
//         }

//         navigate("/auth/signin");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate, sessionStartTime]);

//   const updateUserSession = async (
//     userId,
//     accessToken,
//     expiresAt,
//     provider
//   ) => {
//     const updateData = {
//       session_start: new Date().toISOString(),
//       session_token: accessToken,
//       session_expiry: new Date(expiresAt * 1000).toISOString(),
//       last_login_at: new Date().toISOString(),
//       is_active: true,
//     };

//     if (provider === "google") {
//       const { data: user } = await supabase
//         .from("users")
//         .select("google_id")
//         .eq("id", userId)
//         .single();

//       console.log("User data for Google ID:", user);

//       if (!user.google_id) {
//         updateData.google_id = session.user.user_metadata.sub;
//       }
//     }

//     console.log("Update data:", updateData);

//     const { error: updateError } = await supabase
//       .from("users")
//       .update(updateData)
//       .eq("id", userId);

//     console.log("Update error:", updateError);

//     if (updateError) {
//       console.error("Error updating user session:", updateError);
//     }
//   };

//   console.log("Data Working");

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       {/* <Transform /> */}
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <Auth
//               supabaseClient={supabase}
//               appearance={{
//                 theme: ThemeSupa,
//                 variables: {
//                   default: {
//                     colors: {
//                       brand: "rgb(168 85 247)",
//                       brandAccent: "rgb(147 51 234)",
//                       inputBackground: "rgb(17 24 39)",
//                       inputText: "white",
//                       inputPlaceholder: "rgb(156 163 175)",
//                     },
//                   },
//                 },
//                 className: {
//                   container: "auth-container",
//                   button:
//                     "auth-button bg-purple-500 hover:bg-purple-600 text-white",
//                   label: "auth-label text-gray-300",
//                   input: "auth-input bg-gray-900 text-white border-gray-700",
//                 },
//               }}
//               providers={["google"]}
//               redirectTo={redirectUrl}
//               view="sign_up"
//               theme="dark"
//             />
//             {loading && (
//               <div className="text-center text-gray-400">
//                 Signing up... Please wait.
//               </div>
//             )}
//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Transform } from "@/components/dashboard/components/signup/Transform";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Analyst"); // Default role is "Analyst"

//   const isDevelopment = window.location.hostname === "localhost";
//   const redirectUrl = isDevelopment
//     ? "http://localhost:8080"
//     : "https://gvovhdgpgfxlmzckxtvd.supabase.co/auth/callback";

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         setSessionStartTime(new Date());
//         updateUserSession(
//           session.user.id,
//           session.access_token,
//           session.expires_at,
//           session.user.app_metadata.provider
//         );
//         navigate("/dashboard");
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event === "SIGNED_IN" && session) {
//         setLoading(true);
//         setSessionStartTime(new Date());

//         try {
//           const { data: existingUser, error: checkError } = await supabase
//             .from("users")
//             .select("*")
//             .or(
//               `email.eq.${session.user.email},google_id.eq.${session.user.user_metadata.sub}`
//             )
//             .maybeSingle();

//           if (checkError) {
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           if (existingUser) {
//             await updateUserSession(
//               session.user.id,
//               session.access_token,
//               session.expires_at,
//               session.user.app_metadata.provider
//             );
//             toast.success("Sign-in successful!");
//             navigate("/dashboard");
//             return;
//           }

//           const userData = {
//             id: session.user.id,
//             email: session.user.email,
//             session_start: new Date().toISOString(),
//             session_token: session.access_token,
//             session_expiry: new Date(session.expires_at * 1000).toISOString(),
//             auth_provider: session.user.app_metadata.provider,
//             last_login_at: new Date().toISOString(),
//             is_active: true,
//             role: role,
//           };

//           if (session.user.app_metadata.provider === "google") {
//             userData.google_id = session.user.user_metadata.sub;
//           }

//           const { error: insertError } = await supabase
//             .from("users")
//             .insert([userData]);

//           if (insertError) {
//             toast.error("Error during sign up");
//             setError("Error during sign up");
//             setLoading(false);
//             return;
//           }

//           await updateUserSession(
//             session.user.id,
//             session.access_token,
//             session.expires_at,
//             session.user.app_metadata.provider
//           );

//           toast.success("Sign-up successful!");
//           navigate("/dashboard");
//         } catch (error) {
//           toast.error("An error occurred during sign up");
//           setError("An error occurred during sign up");
//         } finally {
//           setLoading(false);
//         }
//       } else if (event === "SIGNED_OUT") {
//         const sessionEndTime = new Date();
//         const sessionLength = sessionEndTime - sessionStartTime;

//         if (session?.user?.id) {
//           const { error: updateError } = await supabase
//             .from("users")
//             .update({
//               session_end: sessionEndTime.toISOString(),
//               session_duration: `${sessionLength} milliseconds`,
//             })
//             .eq("id", session.user.id);

//           console.log("Session update error:", updateError);
//         }

//         navigate("/auth/signin");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate, sessionStartTime, role]); // Add role to dependencies

//   const updateUserSession = async (
//     userId,
//     accessToken,
//     expiresAt,
//     provider
//   ) => {
//     const updateData = {
//       session_start: new Date().toISOString(),
//       session_token: accessToken,
//       session_expiry: new Date(expiresAt * 1000).toISOString(),
//       last_login_at: new Date().toISOString(),
//       is_active: true,
//       role: role, // Include the role field
//     };

//     if (provider === "google") {
//       const { data: user } = await supabase
//         .from("users")
//         .select("google_id")
//         .eq("id", userId)
//         .single();

//       if (!user.google_id) {
//         updateData.google_id = session.user.user_metadata.sub;
//       }
//     }

//     const { error: updateError } = await supabase
//       .from("users")
//       .update(updateData)
//       .eq("id", userId);

//     if (updateError) {
//       console.error("Error updating user session:", updateError);
//     }
//   };

//   const handleManualSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (error) {
//         toast.error(error.message);
//         setError(error.message);
//         setLoading(false);
//         return;
//       }

//       const userData = {
//         id: session.user.id,
//         email: session.user.email,
//         session_start: new Date().toISOString(),
//         session_token: session.access_token,
//         session_expiry: new Date(session.expires_at * 1000).toISOString(),
//         auth_provider: session.user.app_metadata.provider,
//         last_login_at: new Date().toISOString(),
//         is_active: true,
//         role: "Analyst",
//       };

//       if (session.user.app_metadata.provider === "google") {
//         userData.google_id = session.user.user_metadata.sub;
//       }

//       const { error: insertError } = await supabase
//         .from("users")
//         .insert([userData]);

//       if (insertError) {
//         toast.error("Error creating user");
//         setError("Error creating user");
//         setLoading(false);
//         return;
//       }

//       toast.success("Sign-up successful!");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error("An error occurred during sign up");
//       setError("An error occurred during sign up");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <form onSubmit={handleManualSignUp} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Role
//                 </label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 >
//                   <option value="Analyst">Analyst</option>
//                   <option value="Product Manager">Product Manager</option>
//                   <option value="Business">Business</option>
//                   <option value="Finance">Finance</option>
//                   <option value="Marketing">Marketing</option>
//                   <option value="Operations">Operations</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
//               >
//                 {loading ? "Signing up..." : "Sign Up"}
//               </button>
//             </form>

//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Analyst"); // Default role is "Analyst"

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Sign up the user with Supabase Auth
//       const { data, error: signUpError } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (signUpError) {
//         throw signUpError;
//       }

//       // Prepare user data for the `users` table
//       const userData = {
//         id: data.user.id,
//         email: data.user.email,
//         session_start: new Date().toISOString(),
//         session_token: data.session?.access_token || null,
//         session_expiry: data.session
//           ? new Date(data.session.expires_at * 1000).toISOString()
//           : null,
//         auth_provider: "email",
//         last_login_at: new Date().toISOString(),
//         is_active: true,
//         role: role, // Include the selected role
//       };

//       // Insert user data into the `users` table
//       const { error: insertError } = await supabase
//         .from("users")
//         .insert([userData]);

//       if (insertError) {
//         throw insertError;
//       }

//       toast.success(
//         "Sign-up successful!"
//       );
//       navigate("/auth/signin");
//     } catch (error) {
//       toast.error(error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Role
//                 </label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 >
//                   <option value="Analyst">Analyst</option>
//                   <option value="Product Manager">Product Manager</option>
//                   <option value="Business">Business</option>
//                   <option value="Finance">Finance</option>
//                   <option value="Marketing">Marketing</option>
//                   <option value="Operations">Operations</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
//               >
//                 {loading ? "Signing up..." : "Sign Up"}
//               </button>
//             </form>
//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Transform } from "@/components/dashboard/components/signup/Transform";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Analyst");

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Sign up the user with Supabase Auth
//       const { data, error: signUpError } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (signUpError) {
//         throw signUpError;
//       }

//       // Prepare user data for the `users` table
//       const userData = {
//         id: data.user.id,
//         email: data.user.email,
//         session_start: new Date().toISOString(),
//         session_token: data.session?.access_token || null,
//         session_expiry: data.session
//           ? new Date(data.session.expires_at * 1000).toISOString()
//           : null,
//         auth_provider: "email",
//         last_login_at: new Date().toISOString(),
//         is_active: true,
//         role: role, // Include the selected role
//       };

//       // Insert user data into the `users` table
//       const { error: insertError } = await supabase
//         .from("users")
//         .insert([userData]);

//       if (insertError) {
//         throw insertError;
//       }

//       toast.success(
//         "Sign-up successful! Please check your email for confirmation."
//       );
//       navigate("/auth/signin");
//     } catch (error) {
//       toast.error(error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignUp = async () => {
//     setLoading(true);
//     setError(null);

//     console.log("123456789");

//     try {
//       const { data, error: googleError } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//       });
//       console.log("Try Block Here");
//       if (googleError) {
//         throw googleError;
//       }

//       const { data: sessionData, error: sessionError } =
//         await supabase.auth.getSession();

//       if (sessionError) {
//         throw sessionError;
//       }

//       const session = sessionData.session;

//       if (session) {
//         const userData = {
//           id: session.user.id,
//           email: session.user.email,
//           session_start: new Date().toISOString(),
//           session_token: session.access_token,
//           session_expiry: new Date(session.expires_at * 1000).toISOString(),
//           auth_provider: "google",
//           last_login_at: new Date().toISOString(),
//           is_active: true,
//           role: role,
//         };

//         const { error: upsertError } = await supabase
//           .from("users")
//           .upsert([userData], { onConflict: "id" });

//         if (upsertError) {
//           throw upsertError;
//         }

//         toast.success("Google sign-up successful!");
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       <Transform />
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Role
//                 </label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 >
//                   <option value="Analyst">Analyst</option>
//                   <option value="Product Manager">Product Manager</option>
//                   <option value="Business">Business</option>
//                   <option value="Finance">Finance</option>
//                   <option value="Marketing">Marketing</option>
//                   <option value="Operations">Operations</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
//               >
//                 {loading ? "Signing up..." : "Sign Up"}
//               </button>
//             </form>
//             <div className="flex items-center justify-center">
//               <button
//                 onClick={handleGoogleSignUp}
//                 disabled={loading}
//                 className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center"
//               >
//                 {loading ? "Signing up with Google..." : "Sign Up with Google"}
//               </button>
//             </div>
//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Transform } from "@/components/dashboard/components/signup/Transform";
// import { Link } from "react-router-dom";

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Analyst");

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Sign up the user with Supabase Auth
//       const { data, error: signUpError } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (signUpError) {
//         throw signUpError;
//       }

//       const userData = {
//         id: data.user.id,
//         email: data.user.email,
//         session_start: new Date().toISOString(),
//         session_token: data.session?.access_token || null,
//         session_expiry: data.session
//           ? new Date(data.session.expires_at * 1000).toISOString()
//           : null,
//         auth_provider: "email",
//         last_login_at: new Date().toISOString(),
//         is_active: true,
//         role: role,
//       };

//       const { error: insertError } = await supabase
//         .from("users")
//         .insert([userData]);

//       if (insertError) {
//         throw insertError;
//       }

//       toast.success("Sign-up successful!");
//       navigate("/auth/signin");
//     } catch (error) {
//       toast.error(error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignUp = async () => {
//     setLoading(true);
//     setError(null);
//     console.log("Starting Google Sign-Up");

//     try {
//       // First check if user already exists
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) {
//         throw new Error("You're already signed in");
//       }

//       // Initiate Google OAuth for sign-up
//       const { error: googleError } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: "http://localhost:8080/auth/callback",
//           queryParams: {
//             access_type: "offline",
//             prompt: "select_account",
//           },
//         },
//       });

//       if (googleError) {
//         throw googleError;
//       }

//       // Listen for auth state changes to complete sign-up
//       const {
//         data: { subscription },
//       } = supabase.auth.onAuthStateChange(async (event, session) => {
//         if (event === "SIGNED_IN" && session) {
//           console.log("Google Sign-Up completed, creating user record...");

//           const { data: existingUser } = await supabase
//             .from("users")
//             .select("*")
//             .eq("id", session.user.id)
//             .single();

//           if (existingUser) {
//             toast.error("Account already exists. Please sign in instead.");
//             await supabase.auth.signOut();
//             return;
//           }

//           // Create new user record
//           const userData = {
//             id: session.user.id,
//             email: session.user.email,
//             session_start: new Date().toISOString(),
//             session_token: session.access_token,
//             session_expiry: new Date(session.expires_at * 1000).toISOString(),
//             auth_provider: "google",
//             last_login_at: new Date().toISOString(),
//             is_active: true,
//             role: "Analyst",
//             created_at: new Date().toISOString(),
//           };

//           const { error: upsertError } = await supabase
//             .from("users")
//             .insert([userData]);

//           if (upsertError) throw upsertError;

//           toast.success("Account created successfully with Google!");
//           navigate("/dashboard");
//           subscription.unsubscribe();
//         }
//       });
//     } catch (error) {
//       console.error("Error during Google Sign-Up:", error);
//       toast.error(error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F1A] text-white">
//       <Transform />
//       <div className="max-w-md mx-auto px-6 py-24">
//         <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-center">
//                 Create your account
//               </h2>
//               <p className="text-center text-gray-400 mt-2">
//                 Join the Alignify Beta
//               </p>
//             </div>
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Role
//                 </label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
//                   required
//                 >
//                   <option value="Analyst">Analyst</option>
//                   <option value="Product Manager">Product Manager</option>
//                   <option value="Business">Business</option>
//                   <option value="Finance">Finance</option>
//                   <option value="Marketing">Marketing</option>
//                   <option value="Operations">Operations</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
//               >
//                 {loading ? "Signing up..." : "Sign Up"}
//               </button>
//             </form>
//             <div className="flex items-center justify-center">
//               <button
//                 onClick={handleGoogleSignUp}
//                 disabled={loading}
//                 className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center"
//               >
//                 Sign up with Google
//               </button>
//             </div>

//             {error && (
//               <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">
//                 {error}
//               </div>
//             )}
//             <Link to="/auth/signin">
//               <p className="text-center text-gray-400 mt-4">
//                 Already have an account? Sign in
//               </p>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Changed Flow
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // 1. Check if email exists
      const { data: existing } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();
  
      if (existing) throw new Error("Email already registered");
  
      // 2. Validate inputs
      if (!email || !password) {
        throw new Error("Both email and password are required");
      }
  
      // 3. Create auth user (password signup)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
  
      if (signUpError) throw signUpError;
  
      // 4. Skip OTP sending in development
      if (process.env.NODE_ENV === "development") {
        setStep("verify");
        toast.success("Development Mode: Use OTP 123456");
        return;
      }
  
      // 5. Production fallback - send real OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // User already created
        },
      });
  
      if (otpError) throw otpError;
  
      setStep("verify");
      toast.success("OTP sent to your email!");
  
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // 1. OTP Validation
      const FIXED_OTP = "123456";
      const isDevelopment = process.env.NODE_ENV === "development";
  
      if (!isDevelopment) {
        throw new Error("Fixed OTP only works in development mode");
      }
  
      if (otp !== FIXED_OTP) {
        throw new Error("Invalid OTP. Use 123456 for testing");
      }
  
      // 2. Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error(userError?.message || "User not found");
  
      // 3. Prepare user data
      const now = new Date();
      const userData = {
        id: user.id,
        email: user.email,
        password_hash: null,
        account_id: null,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        role: "user",
        other_role_description: null,
        session_token: `sess_${crypto.randomUUID().replace(/-/g, '').substring(0, 24)}`,
        auth_provider: 'email',
        google_id: null,
        last_login_at: now.toISOString(),
        is_active: true,
        session_start: now.toISOString(),
        session_end: null,
        session_duration: null,
        session_expiry: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // 24h expiry
      };
  
      // 4. Create user record
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(userData, { onConflict: 'id' });
  
      if (upsertError) throw upsertError;
  
      // 5. Redirect to dashboard
      toast.success("Account verified and created!");
      navigate("/profile-setup");
  
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Verification failed");
      
      // Handle specific error cases
      if (error.code === '23503') { // Foreign key violation
        toast.error("Account reference error. Please try again.");
      } else if (error.code === '42501') { // Permission denied
        toast.error("Permission denied. Please contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      if (googleError) throw googleError;
    } catch (error: any) {
      setError(error.message);
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8">
          <h1 className="text-3xl font-bold text-center mb-4">Verify Email</h1>
          <p className="text-center text-gray-400 mb-6">
            Enter the 6-digit code sent to {email}
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-center text-2xl tracking-widest"
              maxLength={6}
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={async () => {
                await supabase.auth.signInWithOtp({ email });
                toast.success("New OTP sent!");
              }}
              className="text-purple-400 hover:underline text-sm"
            >
              Resend OTP
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded bg-red-900/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <div className="max-w-md mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold text-center">SIGN UP</h1>
        <p className="text-center text-gray-400 mt-2">
          Sign in with email address
        </p>

        <form onSubmit={handleEmailSignUp} className="space-y-4 mt-6">
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
          >
            {loading ? "Sending code..." : "Continue"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-[#0B0F1A] text-gray-400 text-sm">
              or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
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
            Google
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          By registering, you agree to our{" "}
          <Link to="/terms" className="text-purple-400 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-purple-400 hover:underline">
            Privacy Policy
          </Link>
        </p>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-purple-400 hover:underline">
            Sign in
          </Link>
        </p>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-900/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
