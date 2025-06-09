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
  title: "Sign Up - Aura Health AI",
  description:
    "Create your Aura Health AI account to start your personalized health and fitness journey.",
  robots: {
    index: false, // Do not index signup page
    follow: true,
  },
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center mb-8 text-primary">
        <Leaf size={48} className="mr-3" />
        <h1 className="text-4xl font-headline font-bold">Aura Health AI</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Create Account
          </CardTitle>
          <CardDescription>
            Start your personalized health journey today.
          </CardDescription>
          <p className="text-sm text-muted-foreground pt-2">
            Please save your credentials securely, as a password reset feature
            is not yet available.
          </p>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
