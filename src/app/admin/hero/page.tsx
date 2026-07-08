"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/content-states";
import { revalidatePortfolioPages } from "@/app/revalidate-actions";
import { BRAND } from "@/lib/fallbacks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminHeroPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [multipleHeroWarning, setMultipleHeroWarning] = useState(false);

  const [title, setTitle] = useState<string>(BRAND.headline);
  const [subtitle, setSubtitle] = useState<string>(BRAND.title);
  const [tagline, setTagline] = useState<string>(`${BRAND.brand} — ${BRAND.name}`);
  const [description, setDescription] = useState<string>("");
  const [primaryLabel, setPrimaryLabel] = useState<string>("View My Work");
  const [primaryUrl, setPrimaryUrl] = useState<string>("/projects");
  const [secondaryLabel, setSecondaryLabel] = useState<string>("GitHub");
  const [secondaryUrl, setSecondaryUrl] = useState<string>(BRAND.github);
  const [tertiaryLabel, setTertiaryLabel] = useState<string>("Contact Me");
  const [tertiaryUrl, setTertiaryUrl] = useState<string>("/contact");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Check for multiple published hero records
      const { data: allHeroes, error: countError } = await supabase
        .from("hero_sections")
        .select("id, published, sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!countError && allHeroes && allHeroes.length > 1) {
        setMultipleHeroWarning(true);
        console.warn(`Multiple hero records found: ${allHeroes.length} published records`);
      }

      // Fetch the active hero record for editing (same logic as public fetch)
      const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) setError(error.message);
      else if (data) {
        setTitle(data.title ?? BRAND.headline);
        setSubtitle(data.subtitle ?? BRAND.title);
        setTagline(data.tagline ?? `${BRAND.brand} — ${BRAND.name}`);
        setDescription(data.description ?? "");
        setPrimaryLabel(data.cta_primary_label ?? "View My Work");
        setPrimaryUrl(data.cta_primary_url ?? "/projects");
        setSecondaryLabel(data.cta_secondary_label ?? "GitHub");
        setSecondaryUrl(data.cta_secondary_url ?? BRAND.github);
        setTertiaryLabel(data.cta_tertiary_label ?? "Contact Me");
        setTertiaryUrl(data.cta_tertiary_url ?? "/contact");
        setPublished(data.published ?? true);
      }
      setLoading(false);
    };
    init();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title, subtitle, tagline, description,
      cta_primary_label: primaryLabel,
      cta_primary_url: primaryUrl,
      cta_secondary_label: secondaryLabel,
      cta_secondary_url: secondaryUrl,
      cta_tertiary_label: tertiaryLabel,
      cta_tertiary_url: tertiaryUrl,
      published,
      updated_at: new Date().toISOString(),
    };

    console.log("Saving hero section with payload:", payload);

    const { data: existing, error: fetchError } = await supabase
      .from("hero_sections")
      .select("id")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching existing hero:", fetchError);
      setError(fetchError.message);
      toast({ title: "Error", description: fetchError.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    const operation = existing?.id ? "update" : "insert";
    console.log(`Performing ${operation} operation, existing ID:`, existing?.id);

    const { error: saveError } = existing?.id
      ? await supabase.from("hero_sections").update(payload).eq("id", existing.id)
      : await supabase.from("hero_sections").insert(payload);

    setSaving(false);

    if (saveError) {
      console.error("Error saving hero section:", saveError);
      setError(saveError.message);
      toast({ title: "Error", description: saveError.message, variant: "destructive" });
    } else {
      console.log("Hero section saved successfully");
      toast({ title: "Saved", description: "Hero section updated on the public site." });
      await revalidatePortfolioPages();
    }
  };

  if (loading) return <LoadingState message="Loading hero section..." />;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-cyan-400">Hero Section</h2>
          <p className="text-slate-400 mt-2">Landing headline and call-to-action buttons</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      {multipleHeroWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Multiple Hero Records Found</AlertTitle>
          <AlertDescription>
            Multiple hero records exist in the database. The homepage displays the published record with the lowest sort_order.
            Run the SQL migration in <code>supabase-schemas/hero-cleanup-duplicates.sql</code> to unpublish duplicates.
          </AlertDescription>
        </Alert>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label htmlFor="title">Headline</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="subtitle">Identity Line (Name & Roles)</Label>
        <Textarea id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} placeholder="e.g., Iyobosa Majid Amaddin · Full-Stack Developer · AI Systems Builder" />
      </div>
      <div>
        <Label htmlFor="tagline">Tagline Badge</Label>
        <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., CodeAndBe Portfolio" />
      </div>
      <div>
        <Label htmlFor="description">Hero Description (Main Paragraph)</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="The main hero paragraph shown below the identity line" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Primary CTA Label</Label>
          <Input value={primaryLabel} onChange={(e) => setPrimaryLabel(e.target.value)} />
        </div>
        <div>
          <Label>Primary CTA URL</Label>
          <Input value={primaryUrl} onChange={(e) => setPrimaryUrl(e.target.value)} />
        </div>
        <div>
          <Label>Secondary CTA Label</Label>
          <Input value={secondaryLabel} onChange={(e) => setSecondaryLabel(e.target.value)} />
        </div>
        <div>
          <Label>Secondary CTA URL</Label>
          <Input value={secondaryUrl} onChange={(e) => setSecondaryUrl(e.target.value)} />
        </div>
        <div>
          <Label>Tertiary CTA Label</Label>
          <Input value={tertiaryLabel} onChange={(e) => setTertiaryLabel(e.target.value)} />
        </div>
        <div>
          <Label>Tertiary CTA URL</Label>
          <Input value={tertiaryUrl} onChange={(e) => setTertiaryUrl(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="published" checked={published} onCheckedChange={setPublished} />
        <Label htmlFor="published">Published</Label>
      </div>
      <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Hero"}</Button>
    </form>
  );
}
