import Link from 'next/link';
import Image from 'next/image';
import { Video, Twitter, Youtube, Linkedin, Instagram, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  explore: [
    { href: '/ads', label: 'Browse All Ads' },
    { href: '/trending', label: 'Trending Ads' },
    { href: '/countries', label: 'Countries' },
    { href: '/search', label: 'Search Ads' },
  ],
  countries: [
    { href: '/countries/united-states', label: 'United States' },
    { href: '/countries/united-kingdom', label: 'United Kingdom' },
    { href: '/countries/france', label: 'France' },
    { href: '/countries/canada', label: 'Canada' },
    { href: '/countries', label: 'View All →' },
  ],
  account: [
    { href: '/login', label: 'Sign In' },
    { href: '/register', label: 'Create Account' },
    { href: '/account/favorites', label: 'Saved Ads' },
    // { href: '/account/collections', label: 'Collections' },
    { href: '/submit', label: 'Submit an Ad' },
  ],
  company: [
    { href: '/about', label: 'About World Video Ads' },
    // { href: '/blog', label: 'Blog & Insights' },
    // { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/tivoads', label: 'Twitter', icon: Twitter },
  { href: 'https://youtube.com/tivoads', label: 'YouTube', icon: Youtube },
  { href: 'https://linkedin.com/company/tivoads', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://instagram.com/tivoads', label: 'Instagram', icon: Instagram },
  { href: 'mailto:hello@tivoads.com', label: 'Email', icon: Mail },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1">
            
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0 mb-3"
              aria-label="TivoAds Home"
            >
              <Image
                src="/images/logo.png"
                alt="TivoAds Logo"
                width={123}
                height={32}
                className="object-contain"
                priority
              />
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              A collection of past, present and trending video commercials from around the world.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.explore.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Countries</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.countries.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.account.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Stay updated on ad trends</h3>
              <p className="text-sm text-muted-foreground">Get weekly insights on the best new ads and campaigns.</p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-base flex-1 sm:w-64 h-10"
              />
              <button type="submit" className="btn btn-primary btn-md whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} World Video Ads. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/*<Link href="/sitemap" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>*/}
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
