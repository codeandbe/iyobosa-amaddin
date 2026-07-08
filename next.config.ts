import type {NextConfig} from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function getHostnameFromUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname;
  } catch (e) {
    return null;
  }
}

const supabaseHost = getHostnameFromUrl(supabaseUrl);

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // add supabase host from env when available
      ...(supabaseHost
        ? [
            {
              protocol: 'https',
              hostname: supabaseHost,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
