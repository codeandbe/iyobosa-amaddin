"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleContact } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from '@/components/ui/section-header';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useRef } from "react";
import { Send, CheckCircle, AlertCircle, CircleDashed, Mail, Github, Linkedin, MapPin } from "lucide-react";
import Link from "next/link";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950">
            {pending ? (
                <>
                    <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                </>
            ) : (
                <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                </>
            )}
        </Button>
    );
}

const ContactSection = () => {
    const initialState = { message: "", error: "", fieldErrors: {} };
    const [state, formAction] = useFormState(handleContact, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message && !state.error) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <section id="contact" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto relative">
                <SectionHeader 
                  badge="Get In Touch"
                  headline="Have a Project in Mind or Just Want to Say Hi?"
                  description="I'd love to hear from you. Fill out the form below or reach out through social media."
                />

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Contact Info */}
                    <div className="space-y-8">
                        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">Let's Connect</CardTitle>
                                <CardDescription className="text-slate-400">
                                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                                        <Mail className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-300">Email</p>
                                        <p className="text-sm text-slate-400">amaddinmajid24@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                                        <MapPin className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-300">Location</p>
                                        <p className="text-sm text-slate-400">Available for remote work worldwide</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">Social Links</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="lg" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                                            <Github className="mr-2 h-5 w-5" />
                                            GitHub
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="mr-2 h-5 w-5" />
                                            LinkedIn
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Contact Form */}
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
                        <form ref={formRef} action={formAction}>
                            <CardHeader>
                                <CardTitle>Send a Message</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Fill out the form below and I'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Input 
                                          id="name" 
                                          name="name" 
                                          placeholder="Your Name" 
                                          required 
                                          className="bg-slate-800/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                        />
                                        {state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name.join(', ')}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Input 
                                          id="email" 
                                          name="email" 
                                          type="email" 
                                          placeholder="Your Email" 
                                          required 
                                          className="bg-slate-800/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                        />
                                        {state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email.join(', ')}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Textarea 
                                      id="message" 
                                      name="message" 
                                      placeholder="Your Message" 
                                      required 
                                      className="min-h-[120px] bg-slate-800/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    />
                                    {state.fieldErrors?.message && <p className="text-sm text-destructive">{state.fieldErrors.message.join(', ')}</p>}
                                </div>
                                <SubmitButton />
                            </CardContent>
                        </form>
                    </Card>
                </div>

                {state.message && (
                    <Alert className="mt-8 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
                        <CheckCircle className="h-4 w-4 text-cyan-400" />
                        <AlertTitle className="text-cyan-400">Success!</AlertTitle>
                        <AlertDescription className="text-slate-300">{state.message}</AlertDescription>
                    </Alert>
                )}
                {state.error && (
                    <Alert variant="destructive" className="mt-8 bg-slate-900/50 backdrop-blur-xl border-red-500/30">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </section>
    );
}

export default ContactSection;
