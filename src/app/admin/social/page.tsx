"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllSocialLinks, deleteSocialLink, toggleSocialLinkActive } from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSocialPage() {
  const router = useRouter();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const data = await getAllSocialLinks();
      setLinks(data);
    } catch (error) {
      console.error('Error loading social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to load social links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    try {
      await toggleSocialLinkActive(id, !currentlyActive);
      toast({
        title: 'Success',
        description: 'Social link status updated',
      });
      loadLinks();
    } catch (error) {
      console.error('Error toggling social link:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social link status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLink = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to delete the ${platform} social link?`)) return;

    try {
      await deleteSocialLink(id);
      toast({
        title: 'Success',
        description: 'Social link deleted successfully',
      });
      loadLinks();
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete social link',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin')}>
            ← Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Social Media Links</h2>
            <p className="text-muted-foreground mt-1">Manage your social media profiles and links</p>
          </div>
        </div>
        <Link href="/admin/social/new">
          <Button>Add Social Link</Button>
        </Link>
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ExternalLink className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No social links yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your social media profiles to display them on your portfolio.
            </p>
            <Link href="/admin/social/new">
              <Button>Add Your First Social Link</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{link.platform}</CardTitle>
                    <CardDescription>{link.display_name}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={link.active ? "default" : "secondary"}>
                        {link.active ? (
                          <>
                            <Eye className="mr-1 h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-1 h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Order: {link.sort_order}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/social/${link.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(link.id, link.active)}
                    >
                      {link.active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLink(link.id, link.platform)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">URL:</span>
                    <span className="text-muted-foreground ml-2 break-all">{link.url}</span>
                  </div>
                  {link.icon && (
                    <div>
                      <span className="font-medium">Icon:</span>
                      <span className="text-muted-foreground ml-2">{link.icon}</span>
                    </div>
                )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
