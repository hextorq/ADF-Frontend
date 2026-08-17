import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, Mail, ArrowRight, BookOpen, PenTool, Rocket, CheckCircle2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  remember: z.boolean().optional(),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("adf_admin_email");
    if (savedEmail) {
      form.setValue("email", savedEmail);
      form.setValue("remember", true);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    try {
      if (values.remember) {
        localStorage.setItem("adf_admin_email", values.email);
      } else {
        localStorage.removeItem("adf_admin_email");
      }
      await login(values.email, values.password);
      toast.success("Successfully logged in");
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = form.getValues("email");
    if (!email || !email.includes("@")) {
      toast.error("Please enter your email address first to reset your password.");
      return;
    }
    toast.success(`Password reset instructions sent to ${email}`);
  };

  const handleSSO = () => {
    toast.info("Redirecting to SSO provider...");
    // Redirect browser to the backend SSO mock endpoint
    window.location.href = "http://localhost:3001/api/auth/sso";
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-[#0b1121] overflow-hidden text-slate-950">
      {/* LEFT SIDE - Dark */}
      <section className="relative hidden lg:flex flex-col p-12 xl:p-20 text-white overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <Link to="/" className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white mb-16">
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        <div className="relative z-10 max-w-2xl mt-auto mb-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <img src="/logo.png" alt="ADF Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">ADF <span className="text-blue-500">Admin</span></span>
          </div>

          <h1 className="text-5xl lg:text-[4rem] font-serif font-bold tracking-tight leading-[1.1] mb-6">
            Manage. Publish.<br/>
            <span className="text-blue-500">Inspire.</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-md mb-16 leading-relaxed">
            Welcome to the ADF Administration portal. Sign in to edit, publish, and manage content seamlessly across the website.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-900/30 border border-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white mb-1">Live Editing</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed pr-2">Edit any page content in real time.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white mb-1">Secure Access</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed pr-2">Protected workspace for administrators.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 bg-purple-900/30 border border-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white mb-1">Instant Publish</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed pr-2">See your changes live instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE - Light */}
      <main className="relative flex flex-col justify-center bg-[#f8fafc] lg:rounded-l-[2.5rem] lg:shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20">
        <div className="w-full max-w-[460px] mx-auto px-6 py-12">
          
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>
            <span className="text-blue-600 font-bold tracking-tight flex items-center gap-2">
              <img src="/logo.png" alt="ADF Logo" className="h-6 w-auto object-contain mix-blend-multiply" /> ADF Admin
            </span>
          </div>

          <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            
            {/* Floating Shield */}
            <div className="hidden sm:flex absolute -top-5 -right-5 w-14 h-14 bg-white rounded-2xl shadow-[0_8px_20px_rgba(29,78,216,0.15)] items-center justify-center rotate-12">
              <div className="w-8 h-8 bg-[#1d4ed8] rounded-xl flex items-center justify-center -rotate-12">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <div className="w-12 h-12 bg-[#0b1121] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                <LockKeyhole className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Admin Sign in</h2>
              <p className="text-sm text-slate-500 max-w-[240px] mx-auto leading-relaxed">Use your admin credentials to access the dashboard.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input placeholder="admin@adf.local" className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] rounded-xl font-mono tracking-widest text-lg" {...field} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1d4ed8] focus:outline-none transition-colors">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between pt-1">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <input type="checkbox" className="w-4 h-4 rounded text-[#1d4ed8] focus:ring-[#1d4ed8] border-slate-300 cursor-pointer" checked={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-xs font-medium text-slate-600 cursor-pointer">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                  <button type="button" onClick={handleForgotPassword} className="text-xs font-bold text-[#1d4ed8] hover:text-blue-900 transition-colors">Forgot password?</button>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-[#1d4ed8] hover:bg-[#1e3a8a] shadow-md flex items-center justify-between px-6 group transition-all">
                  <span className="font-semibold text-[15px]">{isSubmitting ? "Signing in..." : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400">or</span>
              </div>
            </div>

            <button type="button" onClick={handleSSO} className="mt-8 w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#1d4ed8]" />
              Single Sign-On (SSO)
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
            <LockKeyhole className="w-3 h-3" />
            Secured with industry-standard encryption
          </div>
        </div>
      </main>
    </div>
  );
}
