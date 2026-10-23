import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { applyPageMeta } from "@/lib/head";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { Work } from "@/pages/Work";
import { WorkDetail } from "@/pages/WorkDetail";
import { Insights } from "@/pages/Insights";
import { InsightArticle } from "@/pages/InsightArticle";
import { Contact } from "@/pages/Contact";
import { StartProject } from "@/pages/StartProject";
import { Contracts } from "@/pages/Contracts";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { ThankYou } from "@/pages/ThankYou";
import { NotFound } from "@/pages/NotFound";

export function App() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    applyPageMeta(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
  }, [location.pathname, location.hash]);

  return (
    <Layout>
      <div key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/start-a-project" element={<StartProject />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Layout>
  );
}
