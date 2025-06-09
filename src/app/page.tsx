import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  BotMessageSquare,
  BarChart3,
  Sparkles,
  Zap,
  Target,
  Brain,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Aura Health AI - Personalized AI Diet & Workout Plans",
  description:
    "Transform your health with Aura Health AI. Get personalized diet and workout plans crafted by Gemini AI, track progress, and achieve your fitness goals effectively.",
  openGraph: {
    title: "Aura Health AI - Personalized AI Diet & Workout Plans",
    description:
      "Transform your health with Aura Health AI. Get personalized diet and workout plans crafted by Gemini AI, track progress, and achieve your fitness goals effectively.",
    // url: 'https://yourdomain.com/', // Replace with your actual domain
    // images: [
    //   {
    //     url: 'https://yourdomain.com/og-landing.png', // Specific OG image for landing page
    //     width: 1200,
    //     height: 630,
    //     alt: 'Aura Health AI Landing Page Preview',
    //   },
    // ],
  },
  twitter: {
    title: "Aura Health AI - Personalized AI Diet & Workout Plans",
    description:
      "Transform your health with Aura Health AI. Get personalized diet and workout plans crafted by Gemini AI, track progress, and achieve your fitness goals effectively.",
    // images: ['https://yourdomain.com/twitter-landing.png'], // Specific Twitter image for landing page
  },
};

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline text-primary">
              Aura Health AI
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/view-plan">View Plans</Link>
                </Button>
                <Button asChild>
                  <Link href="/progress">Progress</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          {/* Decorative SVG or image can go here */}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl md:text-6xl text-foreground">
            Unlock Your Peak Health with{" "}
            <span className="text-primary">Aura Health AI</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Personalized diet and workout plans, intelligently crafted by AI to
            fit your unique body, lifestyle, and goals.
          </p>
          <div className="mt-10 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
            <Button
              size="lg"
              asChild
              className="shadow-lg hover:shadow-primary/50 transition-shadow"
            >
              <Link href="/signup">Get Started Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="shadow-lg hover:shadow-accent/50 transition-shadow"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground sm:text-4xl">
              Discover the Aura Difference
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to achieve your health and fitness goals,
              powered by AI.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<BotMessageSquare className="h-10 w-10 text-primary" />}
              title="AI-Powered Personalization"
              description="Receive diet and workout routines generated by advanced Gemini AI, tailored to your age, goals, preferences, and activity level."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Comprehensive Progress Tracking"
              description="Log your weight, body measurements, and workout consistency. Visualize your journey with intuitive charts."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Motivational AI Coach"
              description="Get insightful summaries of your progress and encouraging feedback from your AI coach to stay motivated and on track."
            />
            <FeatureCard
              icon={<Leaf className="h-10 w-10 text-primary" />}
              title="Holistic Approach"
              description="Aura Health AI considers your preferred cuisines, dietary restrictions, and health issues to create a plan that truly works for you."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Dynamic & Adaptive"
              description="Your plans aren't static. As you progress, Aura Health AI can help adjust your strategy to keep you challenged and moving forward."
            />
            <FeatureCard
              icon={<Target className="h-10 w-10 text-primary" />}
              title="Goal-Oriented"
              description="Whether it's weight loss, muscle gain, or improved fitness, set your targets and let our AI guide you there efficiently."
            />
          </div>
        </div>
      </section>

      {/* How It's Better Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground sm:text-4xl">
              The Aura Advantage
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Why choose Aura Health AI over generic fitness apps?
            </p>
          </div>
          <div className="grid md:grid-cols-1 gap-10 items-center">
            <div className="space-y-6">
              <AdvantageItem
                icon={<Brain className="h-8 w-8 text-primary" />}
                title="Truly Custom Plans"
                description="Go beyond generic templates. Our AI delves deep into your profile to create plans that are as unique as you are, adapting to your specific needs and preferences."
              />
              <AdvantageItem
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
                title="Data-Driven & Actionable Insights"
                description="Understand your body better. Track multiple metrics and receive AI-powered analysis that helps you adapt, optimize, and make informed decisions about your health."
              />
              <AdvantageItem
                icon={<Leaf className="h-8 w-8 text-primary" />}
                title="Seamless & Intuitive Experience"
                description="An easy-to-use interface makes logging progress and accessing your personalized plans effortless, keeping you focused on your goals, not on figuring out the app."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline text-foreground sm:text-4xl">
            Ready to Transform Your Health Journey?
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
            Join Aura Health AI today and experience the future of personalized
            fitness.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              asChild
              className="shadow-lg hover:shadow-primary/50 transition-shadow"
            >
              <Link href="/signup">Start your journey now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/40 text-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: App Info */}
            <div className="md:col-span-5 lg:col-span-6 space-y-4">
              <Link href="/" className="flex items-center space-x-2 mb-2">
                <Leaf className="h-7 w-7 text-primary" />
                <span className="text-2xl font-bold font-headline text-primary">
                  Aura Health AI
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Your personal AI-powered guide to achieving your health and
                fitness goals.
              </p>
              <div className="text-sm">
                <Link
                  href="/disclaimer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Disclaimer
                </Link>
              </div>
            </div>

            {/* Spacer for MD, becomes part of right column on larger screens */}
            <div className="md:col-span-1 lg:col-span-1"></div>

            {/* Right Column: Connect & Developed By */}
            <div className="md:col-span-6 lg:col-span-5 space-y-4 flex flex-col items-start md:items-end">
              <h3 className="text-lg font-semibold font-headline text-foreground">
                Connect with Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href="https://x.com/ashutoshswamy_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter / X</span>
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Developed by Ashutosh Swamy.
              </p>
            </div>
          </div>
          <hr className="my-8 border-border/60" />
          <div className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Aura Health AI. All Rights
            Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="items-center">
        <div className="p-3 rounded-full bg-primary/10 mb-4">{icon}</div>
        <CardTitle className="font-headline text-xl text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
}

interface AdvantageItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function AdvantageItem({ icon, title, description }: AdvantageItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-primary/10">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold font-headline text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
