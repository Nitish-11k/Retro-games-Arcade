import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://retroarcade.in';
  const staticRoutes = ['/', '/games/pixel-box', '/games/pix-man', '/games/flappy-bird', '/games/pixel-slither', '/games/pixel-paddle', '/games/void-vanguard', '/games/pixel-runner'];

  const now = new Date();

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}


