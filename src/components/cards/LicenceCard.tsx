"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type LicenceProps = {
  id: string | number;
  title: string;
  issuer?: string;
  description?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string | null;
  image_url?: string | null;
  image_id?: string | null;
};

export const LicenceCard: React.FC<{ licence: LicenceProps }> = ({ licence }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col w-full h-[420px] overflow-hidden">
        <div className="relative h-40 w-full bg-gray-800">
          <OptimizedImage src={licence.image_url ?? undefined} imageId={licence.image_id ? `licences/${licence.image_id}` : undefined} alt={licence.title} fill className="object-cover" />
        </div>
        <CardHeader className="px-4 pt-4">
          <h3 className="font-headline text-lg font-bold line-clamp-2">{licence.title}</h3>
          {licence.issuer && <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{licence.issuer}</div>}
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-grow">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{licence.description}</p>
        </CardContent>
        <CardFooter className="px-4 pt-0 pb-4 mt-auto">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground">{licence.issue_date ? new Date(licence.issue_date).toLocaleDateString() : ''}</div>
            <Button size="sm" onClick={() => setOpen(true)}>Read More</Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden flex flex-col">
          <div className="relative h-48 sm:h-56 w-full shrink-0">
            <OptimizedImage src={licence.image_url ?? undefined} imageId={licence.image_id ? `licences/${licence.image_id}` : undefined} alt={licence.title} fill className="object-cover" />
          </div>
          <div className="overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">{licence.title}</DialogTitle>
              {licence.issuer && <DialogDescription>{licence.issuer}</DialogDescription>}
            </DialogHeader>
            <div className="text-sm text-muted-foreground whitespace-pre-line mt-4">{licence.description}</div>
            {licence.issue_date && (
              <div className="text-xs text-muted-foreground mt-4">
                {new Date(licence.issue_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LicenceCard;
