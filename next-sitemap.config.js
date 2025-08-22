/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://retroarcade.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Don't generate sitemap index
  exclude: ['/404', '/500', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
    ],
    additionalSitemaps: [
      'https://retroarcade.in/sitemap.xml',
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
}
