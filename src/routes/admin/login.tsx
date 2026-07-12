import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, LockKeyhole, ShieldCheck } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1fr_440px]">
        <section className="hidden border-r border-slate-200 bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>

          <div className="my-auto max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Protected CMS workspace
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight">Edit ADF content from the live site.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Sign in once, open any public page, hover editable content, and save updates directly into the CMS backend.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/5 p-4">
                <Eye className="h-5 w-5 text-slate-300" />
                <div className="mt-3 text-sm font-semibold">Live editing</div>
                <div className="mt-1 text-xs leading-5 text-slate-400">No separate content table required.</div>
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 p-4">
                <LockKeyhole className="h-5 w-5 text-slate-300" />
                <div className="mt-3 text-sm font-semibold">Admin only</div>
                <div className="mt-1 text-xs leading-5 text-slate-400">Editing controls appear only after login.</div>
              </div>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <ArrowLeft className="h-4 w-4" />
                Website
              </Link>
              <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white">ADF</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-slate-950 text-white">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">Admin sign in</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Use your CMS credentials to manage website content.</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@adf.local" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
