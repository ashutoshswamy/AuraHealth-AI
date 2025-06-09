import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer - Aura Health AI",
  description:
    "Important information regarding your use of the Aura Health AI application and its AI-generated health and fitness advice.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 flex flex-col items-center">
      <Link href="/" className="flex items-center mb-10 text-primary">
        <Leaf size={36} className="mr-3" />
        <h1 className="text-4xl font-headline font-bold">Aura Health AI</h1>
      </Link>
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center border-b pb-4">
          <CardTitle className="text-3xl font-headline">Disclaimer</CardTitle>
          <CardDescription className="mt-1">
            Important Information Regarding Your Use of Aura Health AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6 text-base text-foreground/80 leading-relaxed">
          <p>
            The Aura Health AI application ("App") provides personalized diet
            and workout plans, progress tracking, and AI-driven analysis for
            informational and educational purposes only. The content generated
            by the App, including but not limited to meal suggestions, exercise
            routines, and health advice, is not intended to be a substitute for
            professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            <strong>
              Always seek the advice of your physician or other qualified health
              provider
            </strong>{" "}
            with any questions you may have regarding a medical condition,
            dietary restrictions, or fitness objectives. Never disregard
            professional medical advice or delay in seeking it because of
            something you have read, seen, or received from the Aura Health AI
            App.
          </p>
          <p>
            The AI-generated plans are based on the information you provide
            (such as age, height, weight, activity level, preferences, and
            goals) and general principles of health and fitness. However,
            individual needs and responses can vary significantly. Aura Health
            AI does not guarantee any specific health outcomes, weight loss,
            muscle gain, or fitness improvements. Your results will depend on
            various factors, including your adherence to the plan, individual
            metabolism, and overall lifestyle.
          </p>
          <p>
            Reliance on any information provided by Aura Health AI is solely at
            your own risk. The creators, developers, and operators of Aura
            Health AI are not responsible or liable for any advice, course of
            treatment, diagnosis, or any other information, services, or
            products that you obtain through this App. We are not liable for any
            injuries or health problems that may result from using the plans or
            information provided.
          </p>
          <p>
            Before starting any new diet or exercise program, or making any
            changes to your existing regimen, it is crucial to consult with a
            qualified healthcare professional. This is especially important if
            you have any pre-existing health conditions, are pregnant, or have
            other health concerns.
          </p>
          <p>
            By using Aura Health AI, you acknowledge that you understand and
            agree to this disclaimer.
          </p>
        </CardContent>
      </Card>
      <div className="mt-10 text-center">
        <Link href="/" className="text-primary hover:underline font-medium">
          &larr; Return to Aura Health AI Home
        </Link>
      </div>
    </div>
  );
}
