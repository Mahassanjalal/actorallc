import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { LegalLayout } from "@/components/layout/LegalLayout";

const sections = [
  { id: "acceptance", title: "Acceptance" },
  { id: "about", title: "About this site" },
  { id: "no-offer", title: "No offer or advice" },
  { id: "content", title: "Content and samples" },
  { id: "ip", title: "Intellectual property" },
  { id: "acceptable", title: "Acceptable use" },
  { id: "third-party", title: "Third-party services" },
  { id: "contracts", title: "Contracts and signatures" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "liability", title: "Limitation of liability" },
  { id: "law", title: "Governing law" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
];

export function Terms() {
  return (
    <LegalLayout
      title={
        <>
          Terms of <span className="serif-accent">use</span>.
        </>
      }
      intro="The ground rules for using this website. Client engagements are governed separately by a signed agreement."
      updated={site.legal.termsUpdated}
      sections={sections}
    >
      <h2 id="acceptance">1. Acceptance</h2>
      <p>
        By accessing this website you agree to these terms. If you do not agree,
        please do not use the site. These terms apply to the website only and do
        not replace any signed agreement between you and {site.legalName}.
      </p>

      <h2 id="about">2. About this site</h2>
      <p>
        This website is operated by {site.legalName}, based in{" "}
        {site.austin.locality}, {site.austin.regionName}, {site.austin.country}.
        It provides information about the company, its services and its writing,
        and allows prospective clients to get in touch.
      </p>

      <h2 id="no-offer">3. No offer or professional advice</h2>
      <p>
        Nothing on this website is an offer capable of acceptance, a binding
        quote, or professional advice of any kind, including legal, financial or
        tax advice. Project scope, fees and timing are agreed only in a written
        proposal or signed agreement.
      </p>
      <p>
        Articles on this site describe our own practice and opinions. They may not
        be suitable for your situation.
      </p>

      <h2 id="content">4. Content and samples</h2>
      <p>
        Some content on this site may be sample material used to demonstrate
        layout and functionality, including placeholder case studies and essays.
        Where content is a sample, the interface labels it as such. Sample content
        is not a claim about clients, results or credentials.
      </p>

      <h2 id="ip">5. Intellectual property</h2>
      <p>
        The site’s design, text, artwork, code and other content are owned by{" "}
        {site.legalName} or used with permission, and are protected by applicable
        intellectual property laws. You may view the site and print pages for your
        own reference. You may not reproduce, republish, sell or systematically
        extract the content without prior written permission.
      </p>
      <p>
        Names and marks of third parties remain the property of their respective
        owners.
      </p>

      <h2 id="acceptable">6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>attempt to gain unauthorised access to the site, its server or data;</li>
        <li>submit false, misleading or unlawful information through the forms;</li>
        <li>use the forms to send spam, malware or bulk unsolicited messages;</li>
        <li>interfere with the availability or security of the site; or</li>
        <li>use automated tools to scrape the site in a way that degrades service.</li>
      </ul>

      <h2 id="third-party">7. Third-party services</h2>
      <p>
        The site links to and relies on third-party services, including hosting,
        email delivery and e-signature providers. We do not control those services
        and are not responsible for their content, availability or practices. Your
        use of a third-party service is governed by its own terms.
      </p>

      <h2 id="contracts">8. Contracts and signatures</h2>
      <p>
        Contracts are issued and signed through{" "}
        {site.integrations.signatureProvider}. A status is only shown as signed
        after the provider confirms a completed signature. Using an e-signature
        service is a process, not legal advice, and we recommend you obtain
        independent legal review before signing.
      </p>
      <p>
        Contract documents are private. You must not attempt to access a contract
        that was not issued to you. See{" "}
        <Link to="/contracts">Contracts</Link> for the workflow.
      </p>

      <h2 id="disclaimers">9. Disclaimers</h2>
      <p>
        This website is provided “as is” and “as available”. To the extent
        permitted by law, we disclaim all warranties, express or implied,
        including fitness for a particular purpose and non-infringement. We do not
        warrant that the site will be uninterrupted, error-free or free of harmful
        components.
      </p>

      <h2 id="liability">10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {site.legalName} will not be liable
        for indirect, incidental, special, consequential or punitive damages, or
        for lost profits or data, arising from your use of this website. Where
        liability cannot be excluded, it is limited to the greater of the amount
        you paid to use this website (which is zero) and the minimum permitted by
        law. Nothing in these terms limits liability that cannot lawfully be
        limited.
      </p>

      <h2 id="law">11. Governing law</h2>
      <p>
        These terms are governed by the laws of {site.legal.jurisdiction}, without
        regard to conflict-of-law principles. Any dispute arising from use of this
        website is subject to the exclusive jurisdiction of the state and federal
        courts located in {site.austin.regionName}, unless applicable law requires
        otherwise.
      </p>

      <h2 id="changes">12. Changes</h2>
      <p>
        We may update these terms from time to time. The “last updated” date at
        the top of the page reflects the current version. Continued use of the
        site after a change means you accept the updated terms.
      </p>

      <h2 id="contact">13. Contact</h2>
      <p>
        {site.legalName}
        <br />
        {site.austin.locality}, {site.austin.regionName}, {site.austin.country}
        <br />
        <a href={`mailto:${site.email.general}`}>{site.email.general}</a>
      </p>
    </LegalLayout>
  );
}
