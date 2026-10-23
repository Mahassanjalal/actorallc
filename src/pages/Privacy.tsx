import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { LegalLayout } from "@/components/layout/LegalLayout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "information", title: "Information we collect" },
  { id: "use", title: "How we use information" },
  { id: "providers", title: "Service providers" },
  { id: "cookies", title: "Cookies and local storage" },
  { id: "retention", title: "Retention" },
  { id: "security", title: "Security" },
  { id: "rights", title: "Your choices" },
  { id: "children", title: "Children" },
  { id: "international", title: "International visitors" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
];

export function Privacy() {
  return (
    <LegalLayout
      title={
        <>
          Privacy <span className="serif-accent">policy</span>.
        </>
      }
      intro="How Actora LLC handles information submitted through this website. Plain language, no dark patterns."
      updated={site.legal.privacyUpdated}
      sections={sections}
    >
      <h2 id="overview">1. Overview</h2>
      <p>
        This policy explains how {site.legalName} (“Actora”, “we”, “us”)
        handles personal information collected through this website. It covers
        this site, the inquiry forms and the contract workflow linked from it. It
        does not cover information handled under a signed client agreement, which
        is governed by that agreement.
      </p>
      <p>
        We are based in {site.austin.locality}, {site.austin.regionName},{" "}
        {site.austin.country}. Questions about this policy can be sent to{" "}
        <a href={`mailto:${site.email.privacy}`}>{site.email.privacy}</a>.
      </p>

      <h2 id="information">2. Information we collect</h2>
      <p>
        <strong>Information you submit.</strong> When you use the contact or
        project inquiry form, we collect the details you provide: name, business
        email, company, optional phone number, project type, budget range,
        timeline, project description and your privacy consent.
      </p>
      <p>
        <strong>Technical information.</strong> Our static hosting provider
        processes standard request data such as IP address, browser type and
        timestamps for security and availability. Our server endpoint may process
        the truncated IP address and request metadata needed to rate-limit abusive
        submissions.
      </p>
      <p>
        <strong>Contract information.</strong> Contract documents and signatures
        are handled by our e-signature provider, not through this website’s forms.
        See{" "}
        <Link to="/contracts">Contracts</Link>.
      </p>
      <p>
        We do not intentionally collect sensitive personal data through this
        website, and we ask that you do not submit it.
      </p>

      <h2 id="use">3. How we use information</h2>
      <ul>
        <li>To respond to your inquiry and evaluate whether we are a fit.</li>
        <li>To prepare proposals, agreements and project work.</li>
        <li>To protect the site and our systems from abuse and spam.</li>
        <li>To meet legal, tax and record-keeping obligations.</li>
      </ul>
      <p>
        We do not sell personal information. We do not use inquiry details for
        advertising, and this site does not run advertising or behavioural
        tracking scripts.
      </p>

      <h2 id="providers">4. Service providers</h2>
      <p>
        We use a small number of processors to operate the site. They receive only
        what is necessary to perform their function:
      </p>
      <ul>
        <li>
          <strong>GitHub Pages (GitHub, Inc.)</strong> — static website hosting
          and delivery.
        </li>
        <li>
          <strong>{site.integrations.emailProvider}</strong> — transactional email
          delivery for inquiry notifications and optional confirmations.
        </li>
        <li>
          <strong>{site.integrations.signatureProvider}</strong> — contract
          delivery, signing and storage of executed documents.
        </li>
        <li>
          <strong>Cloud infrastructure provider</strong> — runs the small
          serverless endpoint that validates forms, applies rate limits and sends
          notifications.
        </li>
      </ul>
      <p>
        Each provider processes data under its own terms and privacy policy. We
        encourage you to review them where relevant.
      </p>

      <h2 id="cookies">5. Cookies and local storage</h2>
      <p>
        This website does not set advertising or analytics cookies. The preview
        notice can be dismissed for the current page session; the dismissal is
        held in memory and no preference is stored on your device. No identifier
        is sent to us.
      </p>
      <p>
        If analytics are added in future, this policy will be updated before the
        change takes effect, and a consent mechanism will be used where required.
      </p>

      <h2 id="retention">6. Retention</h2>
      <p>
        Inquiry details are retained for up to {site.legal.retentionMonths} months
        from the last meaningful contact, unless a client or legal obligation
        requires longer retention. Spam and abusive submissions are deleted or
        blocked. Contract records are retained by the e-signature provider for the
        period required by our agreement and applicable law.
      </p>

      <h2 id="security">7. Security</h2>
      <p>
        The site is served over HTTPS. Form submissions are validated on the
        server, rate limited, and handled with provider credentials stored only in
        server-side secrets. Contract status changes require webhook signatures
        verified by our server.
      </p>
      <p>
        No system is perfectly secure. If you believe you have found a
        vulnerability, please contact{" "}
        <a href={`mailto:${site.email.privacy}`}>{site.email.privacy}</a> before
        disclosing it publicly.
      </p>

      <h2 id="rights">8. Your choices</h2>
      <p>
        You can ask to access, correct or delete the personal information you
        submitted. Email{" "}
        <a href={`mailto:${site.email.privacy}`}>{site.email.privacy}</a> and we
        will respond within a reasonable period. Depending on where you live, you
        may have additional rights under applicable privacy law; we will tell you
        if an exception applies.
      </p>
      <p>
        You can withdraw consent for future contact at any time. This does not
        affect processing already carried out.
      </p>

      <h2 id="children">9. Children</h2>
      <p>
        This website is intended for businesses and is not directed to children
        under 16. We do not knowingly collect personal information from children.
      </p>

      <h2 id="international">10. International visitors</h2>
      <p>
        Actora is based in the United States. If you contact us from elsewhere,
        your information will be processed in the United States and in the
        locations used by our service providers.
      </p>

      <h2 id="changes">11. Changes</h2>
      <p>
        We may update this policy as the site or our providers change. The “last
        updated” date at the top of this page reflects the current version.
      </p>

      <h2 id="contact">12. Contact</h2>
      <p>
        {site.legalName}
        <br />
        {site.austin.locality}, {site.austin.regionName}, {site.austin.country}
        <br />
        <a href={`mailto:${site.email.privacy}`}>{site.email.privacy}</a>
      </p>
    </LegalLayout>
  );
}
