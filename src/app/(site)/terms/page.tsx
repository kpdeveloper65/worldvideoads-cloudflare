import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using TivoAds and its services.',
};

export default function TermsPage() {
  return (
    <div id="page-terms" className="page-view" style={{ minHeight: '100vh', background: '#080e1a' }}>

      {/* Sticky breadcrumb bar */}
      <div className="sticky top-16 z-30 border-b border-white/5 bg-dark-950/90" style={{ backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <Link href="/" className="hover:text-brand-400 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </Link>
            <span>›</span>
            <span className="text-white/60 font-medium">Terms of Service</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-white/35 text-sm mb-10">Last updated: March 1, 2026</p>

        <div className="space-y-10 text-white/60 leading-relaxed">

          <div className="card p-5 border-brand-500/10 bg-brand-500/5">
            <p className="text-sm text-white/80">
              We use cookies to offer an improved online experience and offer you content and services to match your interests. By using TivoAds you are giving your consent to our cookie policy. Your use of the TivoAds Service implies your acceptance of these Terms of Use. We ask that you read them carefully.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Description of the TivoAds Service</h2>
            <p className="mb-3">
              <strong>1.1.</strong> TivoAds is an original, free video hosting website that enables users to access, view, upload, store and share videos. The TivoAds Service is made up of the TivoAds website, the TivoAds video player that is embeddable onto any website, the TivoAds apps and web-apps as accessible via any current or future device capable of distributing the TivoAds website and/or the video player, and more generally any TivoAds products, content, channels, software, data feeds, services and functionality (&ldquo;TivoAds Service&rdquo;).
            </p>
            <p className="mb-3">
              <strong>1.2.</strong> By accessing and/or using the TivoAds Service, without being logged into a TivoAds Account, You will be a <strong>&ldquo;Visitor.&rdquo;</strong> As a Visitor, You will only have the ability to access, view or share videos available on the TivoAds Service, but will not be able to benefit from all the other features available on the TivoAds Service. A &ldquo;TivoAds Account&rdquo; means the video content storage space on the TivoAds Service which is dedicated to a Viewer or a User TivoAds Service that can be created by signing up for a TivoAds Account via www.tivoads.com.
            </p>
            <p className="mb-3">
              <strong>1.3.</strong> If You want to be able to upload videos and access some other features of the TivoAds Service, You will need to first create a TivoAds Account and have your email address validated. You will then be a <strong>&ldquo;User&rdquo;</strong>, being though agreed that after having created Your TivoAds Account and until You have validated Your email address according to the process defined below, You will be a <strong>&ldquo;Viewer&rdquo;</strong> and will not be able to upload videos or access the other features of the TivoAds Service.
            </p>
            <p className="mb-3">
              <strong>1.4.</strong> Information provided by You to create Your TivoAds Account must be accurate and complete. In order for TivoAds to verify that the email address You provided is valid, You will receive an email from TivoAds asking You to validate Your email address.
            </p>
            <p className="mb-3">
              <strong>1.5.</strong> By creating a TivoAds Account, You agree that You alone will be responsible (to TivoAds and to others) for all activity that occurs under Your TivoAds Account. The user id and password which are necessary to access the TivoAds Account and the features associated with it are Your sole responsibility and it is Your obligation to keep them confidential.
            </p>
            <p className="mb-3">
              <strong>1.6.</strong> As a User, You will also have the ability to access some more additional features from the TivoAds Service, and if and when you have accepted the terms of the TivoAds Partner Program, you will then be a <strong>&ldquo;Partner&rdquo;</strong> and will have the opportunity to monetize Your Content uploaded on Your TivoAds Account.
            </p>
            <p>
              <strong>1.7.</strong> If You are a User, You may notably upload video files (that must be compliant with these Terms) on the TivoAds Service, and have a nickname and an avatar that will be associated with Your TivoAds Account. Any and all elements posted by You on the TivoAds Service are deemed to be <strong>&ldquo;Your Content.&rdquo;</strong> If you are not a Partner, Your Content may be automatically set to &ldquo;private mode&rdquo; so that Your Content will only be available on the TivoAds website to individuals who have the URL link for Your Content, however You or any third party will still have the ability to embed Your Content on any website through TivoAds video player.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Acceptance of These Terms</h2>
            <p className="mb-3">
              <strong>2.1.</strong> Whether You are a Visitor, a Viewer, a User or a Partner, either an individual or a single entity (&quot;You&quot; or &quot;Your&quot; as applicable), You signify Your express and unconditional agreement to: (1) these terms and conditions, (2) all other policies of TivoAds, including but not limited to the TivoAds privacy and cookie policies, as accessible at any time from the homepage of the TivoAds website, and incorporated herein by reference, (all collectively, the &ldquo;Terms&rdquo;). You may not use the TivoAds Service if You do not accept any of the Terms.
            </p>
            <p className="mb-3">
              <strong>2.2.</strong> If you reside in a country of the European Economic Area, these Terms form a legally binding agreement between You and TivoAds SA. If you reside in a country that is not part of the European Economic Area, these Terms form a legally binding agreement between You and TivoAds Inc.
            </p>
            <p className="mb-3">
              <strong>2.3.</strong> TivoAds may, in its sole discretion, modify these Terms from time to time, and You agree to be bound by such modifications. If You do not agree to the modified Terms, Your only recourse is to stop using the TivoAds Service.
            </p>
            <p className="mb-3">
              <strong>2.4.</strong> You shall not use the TivoAds Service if (a) You are not of legal age to form a binding contract with TivoAds, or (b) You are a person who is either barred or otherwise legally prohibited from receiving or using the service.
            </p>
            <p>
              <strong>2.5.</strong> If You are not an individual, You represent to TivoAds that You have all necessary corporate or equivalent authority and power to agree to the Terms on behalf of the corporation, partnership, or association.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Your Intellectual Property Rights</h2>
            <p className="mb-3">
              <strong>3.1.</strong> For the entire period during which Your Content is hosted on the TivoAds Service, You grant to TivoAds, and transferable to its affiliates, the non-exclusive rights to reproduce, represent, stream, replay, exploit, exhibit, show, market, distribute and to technically modify and compress Your Content as is strictly necessary for the purposes of the viewing and/or streaming of Your Content.
            </p>
            <p className="mb-3">
              <strong>3.2.</strong> By making Your Content accessible on the TivoAds Service, You agree to allow any Visitors of the TivoAds Service, to view and to share Your Content through the TivoAds video player on or through any device free-of-charge.
            </p>
            <p>
              <strong>3.3.</strong> Despite this allowance, Your Content shall always remain Your property. Due to the nature of the Internet and digital media, data transmitted cannot be protected against risks of misappropriation and/or piracy, for which TivoAds shall not be liable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Our Intellectual Property Rights</h2>
            <p className="mb-3">
              <strong>4.1.</strong> We grant You a personal, non-exclusive, non-transferable and revocable right to access and use the TivoAds Service, which right is conditioned on Your compliance with the Terms.
            </p>
            <p className="mb-3">
              <strong>4.2.</strong> The content (other than Your Content and other users&apos; content) included on or accessible through the TivoAds Service is the exclusive property of TivoAds and its licensors, and is protected by copyrights, trademarks, trade secrets, or other proprietary rights.
            </p>
            <p>
              <strong>4.3.</strong> TivoAds Content may not be downloaded, copied, reproduced, distributed, transmitted, broadcast, displayed, sold, licensed, or otherwise exploited for any other purpose whatsoever without the prior written consent of TivoAds or its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Our Liability as Host</h2>
            <div className="space-y-3">
              <p>
                <strong>5.1.</strong> In its capacity as a web hosting service provider, TivoAds is under no legal obligation to monitor content uploaded on the TivoAds Service, but shall forthwith remove or disable access to any infringing content once having been properly notified of its existence.
              </p>
              <p>
                <strong>5.2.</strong> You agree that Your use of the TivoAds Service shall be at your sole risk and liability. You are solely responsible for Your Content and the protection of your computer hardware against any virus or interruption.
              </p>
              <div className="card p-4 border-amber-500/15 bg-amber-500/5">
                <p className="text-xs text-white/70">
                  <strong>5.3 &amp; 5.4 DISCLAIMER:</strong> THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY. THE DM PARTIES DISCLAIM ALL WARRANTIES OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW.
                </p>
              </div>
              <p>
                <strong>5.6.</strong> TivoAds shall not be liable for any indirect or consequential losses which may be incurred by You, including loss of profit, loss of goodwill, loss of opportunity, or loss of data suffered.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Content and Usage Restrictions</h2>
            <p className="mb-3">You represent and warrant as an essential condition that Your Content and use of the services:</p>
            <ul className="space-y-2 card p-4 bg-dark-900">
              <li className="flex items-start gap-2 text-sm"><span className="text-red-400 font-bold">✕</span><span>Contains no child pornography, dangerous or illegal acts, or sexually explicit content.</span></li>
              <li className="flex items-start gap-2 text-sm"><span className="text-red-400 font-bold">✕</span><span>Does not infringe the intellectual property rights of any third party.</span></li>
              <li className="flex items-start gap-2 text-sm"><span className="text-red-400 font-bold">✕</span><span>Does not falsely increase the number of views, impressions, or clicks automatically or manually.</span></li>
              <li className="flex items-start gap-2 text-sm"><span className="text-red-400 font-bold">✕</span><span>Does not alter, circumvent, or modify any part of the embeddable video player technology.</span></li>
              <li className="flex items-start gap-2 text-sm"><span className="text-red-400 font-bold">✕</span><span>Is not used for unauthorized commercial sales, sponsorships, or promotions without written authorization.</span></li>
            </ul>
            <p className="text-sm mt-3">
              Failure to comply may result in removal of content, account deactivation, or blocks on video players without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Reporting Prohibited Content</h2>
            <p className="mb-3">
              <strong>7.1.</strong> TivoAds has established an easily accessible means of allowing anyone to notify it of the availability of infringing content or illegal content and/or activity on the TivoAds Service. Detailed processes can be reviewed via our platform configuration tools.
            </p>
            <p>
              <strong>7.2.</strong> If You notice infringing or illegal content and/or activity on the TivoAds Service, You can report it to us at any time by contacting us via the form available from the homepage of the TivoAds website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Data and Privacy Links</h2>
            <p className="mb-2">
              The records of TivoAds stored on our systems in accordance with standard safety practices shall be considered proof of communications, forms sent, and user logs.
            </p>
            <p>
              TivoAds may contain links to third-party websites operated by other entities (&quot;Linked Sites&quot;). If You decide to visit any Linked Site, You do so at Your own risk. Please read our operational policies for comprehensive data details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Governing Law &amp; Jurisdiction</h2>
            <p className="mb-3">
              If you reside in a country of the <strong>European Economic Area</strong>, you agree that any dispute arising out of or relating to these Terms shall be interpreted in accordance with the laws of France, and decided exclusively by a court of competent jurisdiction located in Paris.
            </p>
            <p>
              If you reside in a country <strong>outside of the European Economic Area</strong>, you agree that any dispute shall be interpreted in accordance with New York laws, and decided exclusively by a court of competent jurisdiction located in New York County, New York.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Legal Contact</h2>
            <div className="card p-6">
              <p className="mb-2">For operational support or legal inquiries regarding these Terms of Use, please reach out to our team at:</p>
              <p className="text-white/80"><strong>TivoAds Support Team</strong></p>
              <p>Email: <a href="mailto:support@tivoads.com" className="text-brand-400 hover:text-brand-300">support@tivoads.com</a></p>
            </div>
          </section>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="btn-outline text-sm py-2 px-5">← Back to Home</Link>
          <Link href="/privacy" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">View Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}