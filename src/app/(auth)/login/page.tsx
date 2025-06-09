import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - Aura Health AI",
  description:
    "Access your Aura Health AI account to view personalized diet and workout plans.",
  robots: {
    index: false, // Do not index login page
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center mb-8 text-primary">
        <Leaf size={48} className="mr-3" />
        <h1 className="text-4xl font-headline font-bold">Aura Health AI</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Sign in to access your personalized health plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
