"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/button';

type AwardProps = {
  id: string | number;
  title: string;
  issuer?: string;
  description?: string;
  date_awarded?: string;
  certificate_url?: string | null;
  image_url?: string | null;
  image_id?: string | null;
};

export const AwardCard: React.FC<{ award: AwardProps }> = ({ award }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col w-full h-[420px] overflow-hidden">
        <div className="relative h-40 w-full bg-gray-800">
          <OptimizedImage src={award.image_url ?? undefined} imageId={award.image_id ?? undefined} alt={award.title} fill className="object-cover" />
        </div>
        <CardHeader className="px-4 pt-4">
          <h3 className="font-headline text-lg font-bold line-clamp-2">{award.title}</h3>
          {award.issuer && <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{award.issuer}</div>}
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-grow">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{award.description}</p>
        </CardContent>
        <CardFooter className="px-4 pt-0 pb-4 mt-auto">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground">{award.date_awarded ? new Date(award.date_awarded).toLocaleDateString() : ''}</div>
            <Button size="sm" onClick={() => setOpen(true)}>Read More</Button>
          </div>
        </CardFooter>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-2xl w-full bg-slate-900 rounded-lg overflow-hidden">
            <div className="relative h-56 w-full">
              <OptimizedImage src={award.image_url ?? undefined} imageId={award.image_id ?? undefined} alt={award.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-headline text-2xl mb-2">{award.title}</h3>
              {award.issuer && <div className="text-sm text-muted-foreground mb-2">{award.issuer}</div>}
              <div className="text-sm text-muted-foreground whitespace-pre-line">{award.description}</div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AwardCard;
