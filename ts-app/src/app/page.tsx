"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Crosshair, Users, BarChart3, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm">
                Next-Gen CS2 Analytics
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground"
              variants={itemVariants}
            >
              Master Your <span className="text-primary">Performance</span>
            </motion.h1>
            <motion.p
              className="max-w-[700px] text-muted-foreground md:text-xl"
              variants={itemVariants}
            >
              Advanced stats tracking, team synergy analysis, and role optimizations for Faceit & CS2. 
              Build the perfect roster and climb the ELO ladder.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center pt-4" variants={itemVariants}>
              <Button asChild size="lg" className="font-bold text-lg h-12 px-8">
                <Link href="/dashboard">
                  Check Your Profile <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-bold text-lg h-12 px-8 border-primary/20 bg-background/50 hover:bg-primary/10 hover:border-primary/50">
                <Link href="/team-builder">
                  Build Team
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:py-24">
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
            <FeatureCard 
                icon={BarChart3}
                title="Deep Statistical Analysis"
                description="Go beyond KD. Analyze HS%, entry success rates, and clutch potential with our advanced metrics engine."
            />
            <FeatureCard 
                icon={Users}
                title="Team Synergy Builder"
                description="Construct the perfect 5-stack. Our algorithms analyze role compatibility and playstyle cohesion."
            />
            <FeatureCard 
                icon={TrendingUp}
                title="ELO Progression"
                description="Visualize your climb with dynamic charts and predict future performance based on current form."
            />
             <FeatureCard 
                icon={Crosshair}
                title="Role Efficiency"
                description="Find out if you're really an Entry Fragger or better suited as a Lurker. Data-driven role assignment."
            />
            <FeatureCard 
                icon={Shield}
                title="Match History Simulations"
                description="Review past matches and simulate outcomes against different opponent archetypes."
            />
             <FeatureCard 
                icon={BarChart3}
                title="Global Rankings"
                description="Compare your stats against the best players in your region and see where you stand."
            />
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-2 hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col space-y-2 p-4 relative z-10">
                <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}
