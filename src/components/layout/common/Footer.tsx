"use client";

import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Sparkles, 
  Heart, 
  Shield, 
  Globe,
  LayoutDashboard,
  CheckSquare,
  Users,
  FileText,
  Info
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // TODO: Connect to your newsletter API endpoint
    setTimeout(() => {
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
      setIsSubscribing(false);
    }, 500);
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        

        {/* Why Lumina Section */}
        <div className="border-t my-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-indigo-500" />
              <span className="text-xs text-muted-foreground">Project Management</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckSquare className="h-5 w-5 text-indigo-500" />
              <span className="text-xs text-muted-foreground">Task Tracking</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              <span className="text-xs text-muted-foreground">Team Collaboration</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span className="text-xs text-muted-foreground">Secure & Reliable</span>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t my-8 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-3">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Stay Updated with Lumina</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter and get the latest updates, features, and tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>Made with care</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}