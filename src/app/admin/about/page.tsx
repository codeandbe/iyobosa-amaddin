"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/content-states";
import { revalidatePortfolioPages } from "@/app/revalidate-actions";
import { BRAND } from "@/lib/fallbacks";

export default function AdminAboutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [headline, setHeadline] = useState<string>(`About ${BRAND.name}`);
  const [title, setTitle] = useState<string>(BRAND.title);
  const [bio, setBio] = useState<string>(BRAND.bio);
  const [highlightsText, setHighlightsText] = useState<string>(BRAND.positioning.join('\n'));
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Fetch the active about record for editing (same logic as public fetch)
      const { data, error } = await supabase
        .from("about_me_sections")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) setError(error.message);
      else if (data) {
        setHeadline(data.headline ?? `About ${BRAND.name}`);
        setTitle(data.title ?? BRAND.title);
        setBio(data.bio ?? BRAND.bio);
        const highlights = Array.isArray(data.highlights) ? data.highlights : BRAND.positioning;
        setHighlightsText(highlights.join('\n'));
        setProfileImageUrl(data.profile_image_url ?? "");
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

    const highlights = highlightsText.split('\n').map((h) => h.trim()).filter(Boolean);
    const payload = {
      headline, title, bio,
      highlights,
      profile_image_url: profileImageUrl || null,
      published,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("about_me_sections")
      .select("id")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { error: saveError } = existing?.id
      ? await supabase.from("about_me_sections").update(payload).eq("id", existing.id)
      : await supabase.from("about_me_sections").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      toast({ title: "Error", description: saveError.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "About section updated on the public site." });
      await revalidatePortfolioPages();
    }
  };

  if (loading) return <LoadingState message="Loading about section..." />;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Button type="button" variant="outline" onClick={() => router.push('/admin')}>← Dashboard</Button>
        <div>
          <h2 className="text-2xl font-bold font-headline">Edit About Me</h2>
          <p className="text-muted-foreground mt-1">Bio, positioning, and profile image</p>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="title">Professional Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={6} />
      </div>
      <div>
        <Label htmlFor="highlights">Positioning Highlights (one per line)</Label>
        <Textarea id="highlights" value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} rows={6} />
        <div className="mt-2 flex flex-wrap gap-1">
          {highlightsText.split('\n').filter(Boolean).slice(0, 6).map((h) => (
            <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Profile Image</Label>
        {profileImageUrl && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
            <img src={profileImageUrl} alt="Profile preview" className="w-full h-full object-cover" />
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const filePath = `about/profile-${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from("portfolio-assets")
              .upload(filePath, file, { upsert: false });
            if (uploadError) {
              toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
              return;
            }
            const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
            setProfileImageUrl(data.publicUrl);
            toast({ title: "Image uploaded", description: "Click Save to publish the new profile image." });
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch id="published" checked={published} onCheckedChange={setPublished} />
        <Label htmlFor="published">Published</Label>
      </div>
      <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save About"}</Button>
    </form>
  );
}
