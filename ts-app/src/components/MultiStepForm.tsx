"use client";

// ============================================================
// [F1-F6] Multi-Step Form (Wizard) with React Hook Form & Zod
// Demonstrates: useForm, Zod schema with .regex() and .refine(),
// Controller for custom inputs, Next/Back navigation,
// reCAPTCHA placeholder, and Shadcn Form integration.
// ============================================================

import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import type { FormStep } from "@/lib/types";

// ============================================================
// [F5] Zod Schema with .regex() and .refine()
// ============================================================

const formSchema = z
  .object({
    // Step 1: Personal Info
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)/,
        // [F5] .regex() — requires uppercase letter + digit
        "Password must contain at least one uppercase letter and one digit"
      ),

    // Step 2: Contact Details
    phone: z
      .string()
      .regex(
        /^\+?[0-9\s\-()]{7,15}$/,
        // [F5] .regex() — validates phone format
        "Please enter a valid phone number (7–15 digits)"
      ),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),

    // Step 3: Review
    agreedToTerms: z.boolean(),
    captchaVerified: z.boolean(),
  })
  // [F5] .refine() — custom validation: terms must be accepted
  .refine((data) => data.agreedToTerms === true, {
    message: "You must agree to the terms and conditions",
    path: ["agreedToTerms"],
  })
  // [F5] .refine() — custom validation: captcha must be verified
  .refine((data) => data.captchaVerified === true, {
    message: "Please complete the reCAPTCHA verification",
    path: ["captchaVerified"],
  });

type FormValues = z.infer<typeof formSchema>;

// Fields per step for validation
const STEP_FIELDS: Record<FormStep, (keyof FormValues)[]> = {
  personal: ["firstName", "lastName", "email", "password"],
  contact: ["phone", "address", "city"],
  review: ["agreedToTerms", "captchaVerified"],
};

const STEPS: FormStep[] = ["personal", "contact", "review"];

// ============================================================
// [F4] Custom Controlled Input — Phone Input with formatting
// ============================================================

function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-format: strip non-digits, then re-add dashes
    const raw = e.target.value.replace(/[^\d+\-() ]/g, "");
    onChange(raw);
  };

  return (
    <Input
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="+1 (555) 123-4567"
      // [T2] focus: and hover: pseudo-classes
      className="border-soft-cyan focus:border-ocean-blue focus:ring-ocean-blue/30
                 hover:border-ocean-blue/50 transition-colors"
    />
  );
}

// ============================================================
// MultiStepForm Component
// ============================================================

export function MultiStepForm() {
  // [TS4] Typed useState hooks
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const currentStep: FormStep = STEPS[currentStepIndex];

  // [F1] useForm with Zod resolver — [S1] Shadcn Form integration
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      city: "",
      agreedToTerms: false,
      captchaVerified: false,
    },
    mode: "onTouched",
  });

  // [F3] Next button handler — validates current step fields first
  const handleNext = useCallback(async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }, [currentStep, form]);

  // [F3] Back button handler
  const handleBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Form submission
  const onSubmit = (data: FormValues) => {
    setSubmittedData(data);
    setShowSuccessDialog(true);
  };

  return (
    <>
      {/* [S1] Shadcn Form wrapper for React Hook Form integration */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold
                    transition-colors duration-200
                    ${
                      index <= currentStepIndex
                        ? "bg-ocean-blue text-white"
                        : "bg-soft-cyan text-dark-blue/50"
                    }`}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors duration-200 ${
                      index < currentStepIndex ? "bg-ocean-blue" : "bg-soft-cyan"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ---- Step 1: Personal Info ---- */}
          {currentStep === "personal" && (
            <div className="space-y-4 animate-fade-slide-in">
              <h3 className="text-lg font-semibold text-dark-blue">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* [S1] FormField integrated with Shadcn */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dark-blue font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John"
                          className="border-soft-cyan focus:border-ocean-blue hover:border-ocean-blue/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dark-blue font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Doe"
                          className="border-soft-cyan focus:border-ocean-blue hover:border-ocean-blue/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-blue font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        className="border-soft-cyan focus:border-ocean-blue hover:border-ocean-blue/50 transition-colors"
                      />
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
                    <FormLabel className="text-dark-blue font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Min 8 chars, 1 uppercase, 1 digit"
                        className="border-soft-cyan focus:border-ocean-blue hover:border-ocean-blue/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* ---- Step 2: Contact Details ---- */}
          {currentStep === "contact" && (
            <div className="space-y-4 animate-fade-slide-in">
              <h3 className="text-lg font-semibold text-dark-blue">
                Contact Details
              </h3>

              {/* [F4] Custom controlled input via Controller */}
              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-dark-blue font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <PhoneInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-blue font-medium">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 Main Street"
                        className="border-soft-cyan focus:border-ocean-blue hover:border-ocean-blue/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-blue font-medium">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="New York"
                        className="border-soft-cyan focus:border-ocean-blue hover:border-ocean-blue/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* ---- Step 3: Review & Submit ---- */}
          {currentStep === "review" && (
            <div className="space-y-4 animate-fade-slide-in">
              <h3 className="text-lg font-semibold text-dark-blue">
                Review & Submit
              </h3>

              {/* Summary of entered data */}
              <div className="rounded-lg border border-soft-cyan bg-pale-blue/50 p-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium text-dark-blue">Name:</span>{" "}
                  {form.getValues("firstName")} {form.getValues("lastName")}
                </p>
                <p>
                  <span className="font-medium text-dark-blue">Email:</span>{" "}
                  {form.getValues("email")}
                </p>
                <p>
                  <span className="font-medium text-dark-blue">Phone:</span>{" "}
                  {form.getValues("phone")}
                </p>
                <p>
                  <span className="font-medium text-dark-blue">Address:</span>{" "}
                  {form.getValues("address")}, {form.getValues("city")}
                </p>
              </div>

              {/* Terms checkbox */}
              <FormField
                control={form.control}
                name="agreedToTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 border-ocean-blue data-[state=checked]:bg-ocean-blue"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-dark-blue font-medium cursor-pointer">
                        I agree to the Terms and Conditions
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* [F6] reCAPTCHA Placeholder */}
              <FormField
                control={form.control}
                name="captchaVerified"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 rounded-lg border border-soft-cyan bg-white p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-ocean-blue data-[state=checked]:bg-ocean-blue"
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-dark-blue font-medium cursor-pointer">
                          I&apos;m not a robot
                        </FormLabel>
                        <p className="text-xs text-dark-blue/50 mt-0.5">
                          reCAPTCHA placeholder — integrate Google reCAPTCHA here
                        </p>
                      </div>
                      {/* Placeholder reCAPTCHA logo */}
                      <div className="ml-auto flex flex-col items-center text-dark-blue/30">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        <span className="text-[10px]">reCAPTCHA</span>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* ---- Navigation Buttons ---- */}
          {/* [T2] hover:, focus:, active: pseudo-classes */}
          <div className="flex justify-between pt-4 border-t border-soft-cyan">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="border-ocean-blue text-ocean-blue
                         hover:bg-ocean-blue hover:text-white
                         focus:ring-2 focus:ring-ocean-blue/30
                         active:bg-ocean-blue/80
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors cursor-pointer"
            >
              ← Back
            </Button>

            {currentStepIndex < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-ocean-blue text-white
                           hover:bg-dark-blue
                           focus:ring-2 focus:ring-ocean-blue/30
                           active:bg-dark-blue/90
                           transition-colors cursor-pointer"
              >
                Next →
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-ocean-blue text-white
                           hover:bg-dark-blue
                           focus:ring-2 focus:ring-ocean-blue/30
                           active:bg-dark-blue/90
                           transition-colors cursor-pointer"
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* [S2] Shadcn Dialog — Success message after submission */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-white border-soft-cyan">
          <DialogHeader>
            <DialogTitle className="text-dark-blue text-xl">
              🎉 Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-dark-blue/70">
              Thank you{submittedData ? `, ${submittedData.firstName}` : ""}!
              Your registration has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-pale-blue/50 border border-soft-cyan p-4 text-sm space-y-1 text-dark-blue">
            <p><span className="font-medium">Email:</span> {submittedData?.email}</p>
            <p><span className="font-medium">Phone:</span> {submittedData?.phone}</p>
            <p><span className="font-medium">City:</span> {submittedData?.city}</p>
          </div>
          <DialogClose asChild>
            <Button className="w-full bg-ocean-blue text-white hover:bg-dark-blue transition-colors cursor-pointer">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
