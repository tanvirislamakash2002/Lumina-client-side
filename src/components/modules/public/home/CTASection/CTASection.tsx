"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Sparkles, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-800 dark:via-indigo-700 dark:to-purple-800" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-float">
        <Sparkles className="h-6 w-6 text-white/30" />
      </div>
      <div className="absolute bottom-10 right-10 animate-float-delayed">
        <Rocket className="h-8 w-8 text-white/20" />
      </div>
      <div className="absolute top-1/3 right-20 animate-pulse">
        <div className="w-2 h-2 bg-white/40 rounded-full" />
      </div>
      <div className="absolute bottom-1/3 left-20 animate-pulse-delayed">
        <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Limited Time Offer</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ready to Streamline Your Workflow?
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          Join thousands of teams already using Lumina to manage projects, track tasks, and collaborate effectively.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Link href="/register">
              <Rocket className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
            <Link href="/login">
              View Demo
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-indigo-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Free forever plan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 pt-6 border-t border-white/20 inline-block">
          <p className="text-sm text-indigo-100">
            Trusted by <span className="font-semibold text-white">500+</span> teams worldwide
          </p>
        </div>
      </div>

      {/* Animation Styles (add to your global CSS or use tailwind config) */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        @keyframes pulse-delayed {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-pulse-delayed {
          animation: pulse-delayed 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}