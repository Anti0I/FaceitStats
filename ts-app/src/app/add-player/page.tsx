"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROLES, REGIONS } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ReCAPTCHA from "react-google-recaptcha";
import { Loader2, CheckCircle, AlertCircle, UserPlus } from "lucide-react";

const addPlayerSchema = z.object({
  nickname: z
    .string()
    .min(2, "Nickname must be at least 2 characters")
    .max(15, "Nickname must be at most 15 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, underscores, and dashes"),
  region: z.enum(["EU", "NA", "SA", "ASIA", "OCE"]),
  level: z.number().min(1).max(10),
  elo: z.number().min(0).max(5000),
  kd: z.number().min(0).max(5),
  hsPercentage: z.number().min(0).max(100),
  winrate: z.number().min(0).max(100),
  preferredRole: z.enum(["IGL", "Entry", "Support", "AWP", "Lurker"]),
  aggressiveness: z.number().min(0).max(100),
  experience: z.string().min(1),
}).superRefine((data, ctx) => {
  if (data.level === 10 && data.elo < 2000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ELO must be at least 2000 for Level 10",
      path: ["elo"],
    });
  }
});

type AddPlayerValues = z.infer<typeof addPlayerSchema>;

export default function AddPlayerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<AddPlayerValues>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: {
      nickname: "",
      region: "EU",
      level: 5,
      elo: 0,
      kd: 1.0,
      hsPercentage: 40,
      winrate: 50,
      preferredRole: "Entry",
      aggressiveness: 50,
      experience: "Online",
    },
    mode: "onChange",
  });

  const watchedLevel = form.watch("level");
  const isLevel10 = watchedLevel === 10;

  const onSubmit = async (data: AddPlayerValues): Promise<void> => {
    if (!captchaToken) {
      setResult({ type: "error", message: "Please complete the CAPTCHA." });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setResult({ type: "error", message: responseData.error || "Failed to add player." });
      } else {
        setResult({ type: "success", message: `Player "${responseData.nickname}" added successfully!` });
        form.reset();
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (error) {
      setResult({ type: "error", message: "A network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <UserPlus className="h-8 w-8 text-primary" />
          Add New Player
        </h1>
        <p className="text-muted-foreground">
          Add a CS2 player to the database. They will be available in the Team Builder.
        </p>
      </div>

      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Player Details</CardTitle>
          <CardDescription>Fill out all the fields below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nickname */}
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="s1mple" {...field} />
                    </FormControl>
                    <FormDescription>Faceit or Steam nickname. Must be unique.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region + Level */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faceit Level (1-10)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stats: KD, HS%, Winrate + conditional ELO */}
              <div className="grid grid-cols-2 gap-4">
                {isLevel10 && (
                  <FormField
                    control={form.control}
                    name="elo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ELO <span className="text-xs text-muted-foreground">(min 2000)</span></FormLabel>
                        <FormControl>
                          <Input type="number" min={2000} max={5000} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="kd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>K/D Ratio</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hsPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headshot %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="winrate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winrate %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Role + Experience */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="LAN">LAN</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                          <SelectItem value="Veteran">Veteran</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Aggressiveness Slider */}
              <FormField
                control={form.control}
                name="aggressiveness"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between mb-2">
                      <FormLabel>Aggressiveness</FormLabel>
                      <span className="text-sm text-muted-foreground">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>0 = Passive/Support, 100 = Ultra Aggressive</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Captcha */}
              <div className="flex justify-center pt-2">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={(val) => setCaptchaToken(val)}
                  theme="dark"
                />
              </div>

              {/* Result Message */}
              {result && (
                <div
                  className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                    result.type === "success"
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {result.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {result.message}
                </div>
              )}

              {/* Submit */}
              <Button className="w-full" type="submit" disabled={isSubmitting || !captchaToken}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Player to Database
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
