import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { getSocialLinks } from '@/lib/social';
import { DynamicIcon } from '@/components/ui/dynamic-icon';

const Footer = async () => {
  const socialLinks = await getSocialLinks();

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CodeAndBe · IYOBOSA MAJID AMADDIN. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {socialLinks.slice(0, 6).map((link) => (
            <Link
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label={link.platform}
            >
              <DynamicIcon name={link.icon} className="h-6 w-6" />
              <span className="sr-only">{link.platform}</span>
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
