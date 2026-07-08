"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getFeaturedProjectsHomeLimit, getBlogPostsHomeLimit, setSiteSetting } from "@/lib/site-settings";
import { LoadingState } from "@/components/ui/content-states";
import { Settings, Save, User, Lock, Layout, Github, Database, Zap, Globe, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [featuredLimit, setFeaturedLimit] = useState<number>(3);
  const [blogLimit, setBlogLimit] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Account section state
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [featured, blog] = await Promise.all([
          getFeaturedProjectsHomeLimit(),
          getBlogPostsHomeLimit(),
        ]);
        setFeaturedLimit(featured);
        setBlogLimit(blog);
        
        // Load user account info
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          setUserId(user.id);
          setCreatedAt(user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown");
        }
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

  const handlePasswordChange = async () => {
    // Validation
    if (newPassword.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to change password. You may need to re-authenticate.",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-cyan-400">Settings</h2>
          <p className="text-slate-400 mt-2">
            Manage your account and site configuration.
          </p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* SECTION A - Account */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" />
            Account Information
          </CardTitle>
          <CardDescription>
            View your account details and authentication information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400 text-sm">Email Address</Label>
              <p className="text-white font-medium mt-1">{userEmail}</p>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Authentication Provider</Label>
              <p className="text-white font-medium mt-1">Supabase Auth</p>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">User ID</Label>
              <p className="text-white font-medium mt-1 text-xs">{userId}</p>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Account Created</Label>
              <p className="text-white font-medium mt-1">{createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION B - Change Password */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-cyan-400" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={changingPassword || !newPassword || !confirmPassword}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium"
          >
            <Lock className="mr-2 h-4 w-4" />
            {changingPassword ? "Changing..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      {/* SECTION C - Homepage Settings */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-cyan-400" />
            Homepage Settings
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

      {/* SECTION D - Future Integrations (Placeholders) */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            Future Integrations
          </CardTitle>
          <CardDescription>
            Coming soon - External service integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/30">
              <Github className="h-6 w-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-white">GitHub Sync</h4>
              <p className="text-sm text-slate-400 mt-1">Sync repositories and activity</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/30">
              <Database className="h-6 w-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-white">Medium Sync</h4>
              <p className="text-sm text-slate-400 mt-1">Import blog posts from Medium</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/30">
              <Zap className="h-6 w-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-white">OpenRouter</h4>
              <p className="text-sm text-slate-400 mt-1">AI model integration</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/30">
              <Globe className="h-6 w-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-white">OpenAI</h4>
              <p className="text-sm text-slate-400 mt-1">GPT integration</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/30">
              <Layout className="h-6 w-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-white">Analytics</h4>
              <p className="text-sm text-slate-400 mt-1">Site analytics dashboard</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
