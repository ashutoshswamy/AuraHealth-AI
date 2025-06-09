"use client";

import { useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";

const formSchemaBase = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const signupSchema = formSchemaBase
  .extend({
    name: z.string().min(1, { message: "Name is required." }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Password confirmation must be at least 6 characters.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // path to show error under confirmPassword field
  });

const loginSchema = formSchemaBase;

interface AuthFormProps {
  mode: "login" | "signup";
}

type SignupFormData = z.infer<typeof signupSchema>;
type LoginFormData = z.infer<typeof loginSchema>;
type FormData = SignupFormData | LoginFormData;

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentSchema = mode === "signup" ? signupSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(currentSchema),
    defaultValues:
      mode === "signup"
        ? { name: "", email: "", password: "", confirmPassword: "" }
        : { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    startTransition(async () => {
      if (mode === "signup") {
        const signupInputData = formData as SignupFormData;
        const { data: authResponse, error: signUpError } =
          await supabase.auth.signUp({
            email: signupInputData.email,
            password: signupInputData.password,
            options: {
              emailRedirectTo: `${
                typeof window !== "undefined" ? window.location.origin : ""
              }/auth/callback`,
              data: {
                full_name: signupInputData.name,
              },
            },
          });

        if (signUpError) {
          toast({
            title: "Signup Error",
            description: signUpError.message,
            variant: "destructive",
          });
        } else if (authResponse.user) {
          const user = authResponse.user;
          // Check if the user's email is already confirmed AND they have existing identities.
          // This indicates they are an existing, fully registered user trying to sign up again.
          if (
            user.email_confirmed_at &&
            user.identities &&
            user.identities.length > 0
          ) {
            toast({
              title: "Account Exists",
              description:
                "An account with this email already exists. Please log in.",
              variant: "default",
            }); // Changed to default for better visibility
            router.push(
              `/login?email=${encodeURIComponent(signupInputData.email)}`
            );
          } else {
            // This covers:
            // 1. A brand new user (email_confirmed_at is null, identities might be empty or undefined).
            // 2. An existing user who started signup but never confirmed their email (email_confirmed_at is null, identities might exist).
            // In these scenarios, Supabase will have sent/resent a confirmation email.
            toast({
              title: "Signup Almost Complete!",
              description: "Please check your email to verify your account.",
            });
            router.push(
              "/login?message=Check email to continue sign in process"
            );
          }
        } else if (authResponse.session) {
          // This case occurs if email confirmation is DISABLED in Supabase project settings.
          // The user is signed up and logged in immediately.
          toast({
            title: "Signup Successful!",
            description: "Welcome! You are now logged in.",
          });
          router.push("/generate-plan");
          router.refresh();
        } else {
          // Fallback for an unexpected response from Supabase (e.g., no user, no session, no error)
          toast({
            title: "Signup Error",
            description: "An unexpected issue occurred. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const loginInputData = formData as LoginFormData;
        const { error } = await supabase.auth.signInWithPassword({
          email: loginInputData.email,
          password: loginInputData.password,
        });
        if (error) {
          toast({
            title: "Login Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Login Successful", description: "Welcome back!" });
          router.push("/generate-plan");
          router.refresh();
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">
              {(errors.name as any).message}
            </p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">
            {(errors.email as any).message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">
            {(errors.password as any).message}
          </p>
        )}
      </div>
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="••••••••"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {(errors.confirmPassword as any).message}
            </p>
          )}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "login" ? "Log In" : "Sign Up"}
      </Button>
    </form>
  );
}
