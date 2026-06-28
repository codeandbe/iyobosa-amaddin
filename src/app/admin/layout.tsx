"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { AdminAuthProvider } from "@/components/admin/admin-auth-provider";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "About Me" },
  { href: "/admin/awards", label: "Awards" },
  { href: "/admin/licences", label: "Licenses" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/social", label: "Social" },
  { href: "/admin/contact", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
        <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="md:hidden px-2 text-slate-300 hover:text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-slate-950 border-slate-800/50 pr-0 w-72">
                  <div className="mb-6">
                    <h2 className="font-headline text-lg font-bold text-cyan-400">CodeAndBe Admin</h2>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm transition-colors",
                          pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
                            ? "bg-cyan-500/10 text-cyan-400 font-medium"
                            : "text-slate-300 hover:text-cyan-400"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <Button variant="outline" className="w-full mt-6 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" onClick={handleLogout}>
                    Logout
                  </Button>
                </SheetContent>
              </Sheet>
              <Link href="/admin" className="font-headline text-lg font-bold text-cyan-400">
                CodeAndBe Admin
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-sm overflow-x-auto">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 whitespace-nowrap">
                View site
              </Link>
              {navLinks.slice(1, 8).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap transition-colors hover:text-cyan-400",
                    pathname.startsWith(link.href) ? "text-cyan-400 font-medium" : "text-slate-300"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-8 max-w-5xl mx-auto">{children}</main>
      </div>
    </AdminAuthProvider>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
