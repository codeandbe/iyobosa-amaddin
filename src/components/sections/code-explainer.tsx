"use client";

import { useFormStatus } from "react-dom";
import { handleCodeExplanation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Bot, Wand2, CircleDashed, Code2 } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { SectionHeader } from '@/components/ui/section-header';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">
      {pending ? (
        <>
          <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Explain Code
        </>
      )}
    </Button>
  );
}

const CodeExplainerSection = () => {
  const initialState = { explanation: "", error: "", fieldErrors: {} };
  const [state, formAction] = useActionState(handleCodeExplanation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.explanation) {
      formRef.current?.reset();
    }
  }, [state.explanation]);

  return (
    <section id="code-explainer" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-4xl relative">
        <SectionHeader 
          badge="AI Code Explainer"
          headline="Paste Code Snippets for AI-Powered Explanations"
          description="Submit your code snippet below to get a detailed explanation of its functionality and structure."
        />

        <Card className="mt-12 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
          <form ref={formRef} action={formAction}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <Code2 className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <CardTitle>Enter Code</CardTitle>
                  <CardDescription className="text-slate-400">
                    Submit your code snippet below to get a detailed explanation of its functionality and structure.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  name="code"
                  placeholder={`function hello() {\n  console.log("Hello, World!");\n}`}
                  className="min-h-[150px] font-code text-sm bg-slate-800/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  required
                />
                {state.fieldErrors?.code && (
                  <p className="mt-2 text-sm text-destructive">{state.fieldErrors.code.join(', ')}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Bot className="h-4 w-4 text-cyan-400" />
                <span>Powered by local AI helper</span>
              </div>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        {state.explanation && (
          <Alert className="mt-8 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
            <Bot className="h-4 w-4 text-cyan-400" />
            <AlertTitle className="font-headline text-cyan-400">AI Explanation</AlertTitle>
            <AlertDescription className="prose prose-invert prose-sm max-w-none text-foreground">
              <pre className="mt-4 whitespace-pre-wrap rounded-md bg-slate-800/50 p-4 font-body border border-slate-700/50 text-slate-300">
                {state.explanation}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        {state.error && !state.fieldErrors && (
          <Alert variant="destructive" className="mt-8 bg-slate-900/50 backdrop-blur-xl border-red-500/30">
            <Terminal className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
};

export default CodeExplainerSection;
