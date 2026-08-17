import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how TivoAds collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div id="page-privacy" className="page-view" style={{ minHeight: '100vh', background: '#080e1a' }}>
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
            <span className="text-white/60 font-medium">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/35 text-sm mb-10">Last updated: March 1, 2025</p>

        <div className="space-y-10 text-white/60 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Welcome to TivoAds</h2>
            <p>We understand that privacy online is important to users of our Site, especially when conducting business. Welcome to TivoAds (the Site). This statement governs our privacy policies with respect to those users of the Site (&quot;Visitors&quot;) who visit without transacting business and Visitors who register to transact business on the Site and make use of the various services offered by TivoAds (collectively, &quot;Services&quot;) (&quot;Authorized Customers&quot;).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Personally Identifiable Information</h2>
            <p>Personally Identifiable Information refers to any information that identifies or can be used to identify, contact, or locate the person to whom such information pertains, including, but not limited to, name, address, phone number, fax number, email address, financial profiles, social security number, and credit card information. Personally Identifiable Information does not include information that is collected anonymously (that is, without identification of the individual user) or demographic information not connected to an identified individual.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Information We Collect</h2>
            <p className="mb-3">We may collect information about you in the following ways:</p>
            <div className="space-y-3">
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white mb-1">What Personally Identifiable Information is collected?</h3>
                <p className="text-sm text-white/50">We may collect basic user profile information from all of our Visitors. We collect the following additional information from our Authorized Customers: the names, addresses, phone numbers and email addresses of Authorized Customers, the nature and size of the business, and the nature and size of the advertising inventory that the Authorized Customer intends to purchase or sell.</p>
              </div>
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white mb-1">What organizations are collecting the information?</h3>
                <p className="text-sm text-white/50">In addition to our direct collection of information, our third-party service vendors (such as credit card companies, clearinghouses, and banks) who may provide such services as credit, insurance, and escrow services may collect this information from our Visitors and Authorized Customers. We do not control how these third parties use such information, but we do ask them to disclose how they use personal information provided to them from Visitors and Authorized Customers. Some of these third parties may be intermediaries that act solely as links in the distribution chain and do not store, retain, or use the information given to them.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. How the Site uses Personally Identifiable Information</h2>
            <p className="mb-3">We use Personally Identifiable Information to customize the Site to make appropriate service offerings and to fulfill buying and selling requests on the Site. We may email Visitors and Authorized Customers about research or purchase and selling opportunities on the Site or information related to the subject matter of the Site. We may also use Personally Identifiable Information to contact Visitors and Authorized Customers in response to specific inquiries or to provide requested information.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Sharing and Distribution of Information</h2>
            <p className="mb-3">Personally Identifiable Information about Authorized Customers may be shared with other Authorized Customers who wish to evaluate potential transactions with other Authorized Customers. We may share aggregated information about our Visitors, including the demographics of our Visitors and Authorized Customers, with our affiliated agencies and third party vendors. We also offer the opportunity to &apos;opt-out&apos; of receiving information or being contacted by us or by any agency acting on our behalf.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Storage and Data Retention</h2>
            <p>Personally Identifiable Information collected by TivoAds is securely stored and is not accessible to third parties or employees of TivoAds except for use as indicated above. Visitors and Authorized Customers may opt-out of receiving unsolicited information from or being contacted by us and/or our vendors and affiliated agencies by responding to emails as instructed, or by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Cookies &amp; Tracking Technologies</h2>
            <p className="mb-3">Cookies are used for a variety of reasons. We use Cookies to obtain information about the preferences of our Visitors and the services they select. We also use Cookies for security purposes to protect our Authorized Customers. For example, if an Authorized Customer is logged on and the site is unused for more than 10 minutes, we will automatically log the Authorized Customer off.</p>
            <p>TivoAds uses login information, including, but not limited to, IP addresses, ISPs, and browser types, to analyze trends, administer the Site, track a user&apos;s movement and use, and gather broad demographic information.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Partnerships and Disclosures</h2>
            <p className="mb-3">TivoAds has entered into and will continue to enter into partnerships and other affiliations with a number of vendors. Such vendors may have access to certain Personally Identifiable Information on a need-to-know basis for evaluating Authorized Customers for service eligibility. Our privacy policy does not cover their collection or use of this information.</p>
            <p><strong>Disclosure of Personally Identifiable Information to comply with the law:</strong> We will disclose Personally Identifiable Information in order to comply with a court order or subpoena or a request from a law enforcement agency to release information. We will also disclose Personally Identifiable Information when reasonably necessary to protect the safety of our Visitors and Authorized Customers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Data Security</h2>
            <p>All of our employees are familiar with our security policy and practices. The Personally Identifiable Information of our Visitors and Authorized Customers is only accessible to a limited number of qualified employees who are given a password in order to gain access to the information. We audit our security systems and processes on a regular basis. Sensitive information, such as credit card numbers or social security numbers, is protected by encryption protocols, in place to protect information sent over the Internet.</p>
            <p className="mt-3">While we take commercially reasonable measures to maintain a secure site, electronic communications and databases are subject to errors, tampering, and break-ins, and we cannot guarantee or warrant that such events will not take place and we will not be liable to Visitors or Authorized Customers for any such occurrences.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Your Rights: Correction and Deactivation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="card p-4">
                <p className="text-sm font-medium text-white mb-1">Inaccuracies &amp; Correction</p>
                <p className="text-xs text-white/40">Visitors and Authorized Customers may contact us to update Personally Identifiable Information about them or to correct any inaccuracies by emailing us at <span className="text-brand-400">support@tivoads.com</span>.</p>
              </div>
              <div className="card p-4">
                <p className="text-sm font-medium text-white mb-1">Deletion &amp; Deactivation</p>
                <p className="text-xs text-white/40">We provide a mechanism to delete/deactivate Personally Identifiable Information from the database. However, because of backups, it may be impossible to delete an entry without retaining some residual information. Deactivated items will be functionally deleted and will not be transferred or used moving forward.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Policy Changes</h2>
            <p>We will let our Visitors and Authorized Customers know about changes to our privacy policy by posting such changes on the Site. However, if we are changing our privacy policy in a manner that might cause disclosure of Personally Identifiable Information that a Visitor or Authorized Customer has previously requested not be disclosed, we will contact such Visitor or Authorized Customer to allow them to prevent such disclosure.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Links</h2>
            <div className="card p-6">
              <p className="mb-2">TivoAds contains links to other websites. Please note that when you click on one of these links, you are moving to another website. We encourage you to read the privacy statements of these linked sites as their privacy policies may differ from ours.</p>
              <p className="mt-4 text-sm text-white/40">For privacy operations or support issues, please contact the team directly at <a href="mailto:support@tivoads.com" className="text-brand-400 hover:text-brand-300">support@tivoads.com</a>.</p>
            </div>
          </section>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="btn-outline text-sm py-2 px-5">← Back to Home</Link>
          <Link href="/terms" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">View Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
}