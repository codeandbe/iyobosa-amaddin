'use client';

import * as LucideIcons from 'lucide-react';
import {
  FaXTwitter,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaMedium,
  FaDev,
  FaStackOverflow,
  FaDiscord,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
  FaSlack,
  FaPinterest,
  FaBehance,
  FaDribbble,
  FaFigma,
  FaMicrosoft,
  FaDocker,
  FaAws,
  FaReact,
  FaNodeJs,
  FaPython,
  FaLaravel,
  FaWordpress,
  FaJs,
  FaGoogle,
  FaLinux,
} from 'react-icons/fa6';
import {
  SiNextdotjs,
  SiKubernetes,
  SiVercel,
  SiGooglecloud,
  SiSupabase,
  SiFirebase,
  SiTypescript,
  SiHashnode,
} from 'react-icons/si';
import { Circle, CircleHelp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ICON RESOLUTION LOGIC
 * =====================
 * 
 * The DynamicIcon component resolves icons in three steps:
 * 
 * Step 1: Check custom Brand Icon map (react-icons)
 * - If the icon name exists in the brandIcons map, render that brand icon
 * - This supports modern brand logos like X, Medium, Discord, etc.
 * 
 * Step 2: Check Lucide React icons
 * - If not found in brand map, check if it's a Lucide icon
 * - Lucide icons are the default for generic UI elements
 * 
 * Step 3: Fallback to safe default
 * - If no icon is found, render CircleHelp (or Circle) to prevent crashes
 * 
 * 
 * HOW TO ADD A NEW CUSTOM ICON
 * ============================
 * 
 * 1. Import the icon from react-icons (e.g., from 'react-icons/fa6' or 'react-icons/si')
 * 2. Add it to the brandIcons map with a simple, CMS-friendly name
 * 3. The CMS can now use that name directly (e.g., "Discord", "Supabase")
 * 
 * Example:
 * import { FaNewBrand } from 'react-icons/fa6';
 * 
 * In brandIcons map:
 * 'NewBrand': FaNewBrand,
 * 
 * CMS usage: Just type "NewBrand" in the icon field
 * 
 * 
 * LUCIDE FALLBACK
 * ===============
 * 
 * All Lucide icons are automatically supported via dynamic import.
 * Common Lucide icons include:
 * - GitHub, Linkedin, Mail, Phone, Globe, MapPin
 * - User, Folder, Book, Briefcase, Home, Code
 * - Database, Server, Laptop, Shield, Award
 * 
 * These work without any additional mapping.
 * 
 * 
 * USAGE EXAMPLE
 * =============
 * 
 * <DynamicIcon name="GitHub" className="h-5 w-5" />
 * <DynamicIcon name="X" className="h-6 w-6" />
 * <DynamicIcon name="Discord" className="h-4 w-4" />
 * <DynamicIcon name="Supabase" className="h-8 w-8" />
 * <DynamicIcon name="Next.js" className="h-5 w-5" />
 * <DynamicIcon name="React" className="h-6 w-6" />
 * <DynamicIcon name="Python" className="h-5 w-5" />
 * 
 * The component inherits current text color and supports:
 * - Tailwind className prop
 * - size prop (number in pixels)
 * - hover animations (via className)
 * - active states (via className)
 */

// Custom brand icon mappings using react-icons
// These map simple CMS-friendly names to actual brand icon components
const brandIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  // Social Media Brands
  'X': FaXTwitter,
  'x-twitter': FaXTwitter,
  'TwitterX': FaXTwitter,
  'Twitter': FaTwitter,
  'LinkedIn': FaLinkedin,
  'Instagram': FaInstagram,
  'Facebook': FaFacebook,
  'YouTube': FaYoutube,
  'TikTok': FaTiktok,
  'Medium': FaMedium,
  'Dev.to': FaDev,
  'Dev': FaDev,
  'Stack Overflow': FaStackOverflow,
  'StackOverflow': FaStackOverflow,
  'Discord': FaDiscord,
  'Reddit': FaReddit,
  'Telegram': FaTelegram,
  'WhatsApp': FaWhatsapp,
  'Slack': FaSlack,
  'Pinterest': FaPinterest,
  'Behance': FaBehance,
  'Dribbble': FaDribbble,
  'Hashnode': SiHashnode,
  
  // Design & Development Tools
  'Figma': FaFigma,
  'Vercel': SiVercel,
  'Docker': FaDocker,
  'Kubernetes': SiKubernetes,
  
  // Cloud & Infrastructure
  'AWS': FaAws,
  'Azure': FaMicrosoft,
  'Microsoft Azure': FaMicrosoft,
  'Google Cloud': SiGooglecloud,
  'GoogleCloud': SiGooglecloud,
  'Supabase': SiSupabase,
  'Firebase': SiFirebase,
  
  // Programming Languages & Frameworks
  'React': FaReact,
  'Next.js': SiNextdotjs,
  'Nextjs': SiNextdotjs,
  'Node.js': FaNodeJs,
  'NodeJs': FaNodeJs,
  'Laravel': FaLaravel,
  'WordPress': FaWordpress,
  'Python': FaPython,
  'TypeScript': SiTypescript,
  'JavaScript': FaJs,
  'JS': FaJs,
  'Linux': FaLinux,
  'Google': FaGoogle,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size }: DynamicIconProps) {
  // Normalize the icon name for case-insensitive matching
  const normalizedName = name.trim();
  
  // Step 1: Check custom brand icon map
  const BrandIcon = brandIcons[normalizedName];
  if (BrandIcon) {
    return <BrandIcon className={cn(className)} size={size} />;
  }
  
  // Step 2: Check Lucide icons (dynamic import)
  // Convert kebab-case or space-separated to PascalCase for Lucide
  const lucideName = normalizedName
    .split(/[-_ ]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const LucideIcon = (LucideIcons as any)[lucideName];
  if (LucideIcon) {
    return <LucideIcon className={cn(className)} size={size} />;
  }
  
  // Step 3: Fallback to safe default
  // Use CircleHelp for missing icons to indicate the icon wasn't found
  return <CircleHelp className={cn(className)} size={size} />;
}

export default DynamicIcon;
