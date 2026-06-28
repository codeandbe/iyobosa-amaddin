import { Metadata } from 'next';
import { getSocialLinkById } from '@/lib/social';
import SocialForm from '@/components/admin/social-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Social Link | Admin',
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSocialLinkPage({ params }: PageProps) {
  const { id } = await params;
  const link = await getSocialLinkById(id);

  if (!link) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/social">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Social Links
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Social Link</h1>
          <p className="text-muted-foreground">
            Update the social media profile or link.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SocialForm link={link} />
      </div>
    </div>
  );
}
