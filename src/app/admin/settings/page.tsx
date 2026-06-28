"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getFeaturedProjectsHomeLimit, getBlogPostsHomeLimit, setSiteSetting } from "@/lib/site-settings";
import { LoadingState } from "@/components/ui/content-states";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [featuredLimit, setFeaturedLimit] = useState<number>(3);
  const [blogLimit, setBlogLimit] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [featured, blog] = await Promise.all([
          getFeaturedProjectsHomeLimit(),
          getBlogPostsHomeLimit(),
        ]);
        setFeaturedLimit(featured);
        setBlogLimit(blog);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setSiteSetting("featured_projects_home_limit", featuredLimit),
        setSiteSetting("blog_posts_home_limit", blogLimit),
      ]);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline text-cyan-400">Site Settings</h2>
        <p className="text-slate-400 mt-2">
          Configure homepage preview limits and other site-wide settings.
        </p>
      </div>

      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            Homepage Preview Limits
          </CardTitle>
          <CardDescription>
            Control how many items appear on the homepage preview sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="featured-limit">Featured Projects Home Limit</Label>
            <Input
              id="featured-limit"
              type="number"
              min="1"
              max="20"
              value={featuredLimit}
              onChange={(e) => setFeaturedLimit(parseInt(e.target.value) || 3)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
            <p className="text-sm text-slate-400">
              Number of featured projects to show on the homepage preview. Default: 3
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-limit">Blog Posts Home Limit</Label>
            <Input
              id="blog-limit"
              type="number"
              min="1"
              max="20"
              value={blogLimit}
              onChange={(e) => setBlogLimit(parseInt(e.target.value) || 3)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
            <p className="text-sm text-slate-400">
              Number of blog posts to show on the homepage preview. Default: 3
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
