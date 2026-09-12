/**
 * Academic Development Forum (ADF) - Centralized SEO Metadata & Routes Source of Truth
 * Used by sitemap generator, pre-renderer, and SEO validation test suite.
 */

export const SITE_URL = "https://www.adf.ijeae.com";

export const PUBLIC_ROUTES = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "daily",
    title: "ADF - Academic Development Forum | Academic Publishing",
    description: "Academic Development Forum (ADF) supports academic publishing through journals, book chapters, literary publications and academic programmes.",
    keywords: "ADF, Academic Development Forum, academic publishing, peer-reviewed journals, open access, academic research, book chapters, literary publications",
    h1: "ADF - Academic Development Forum",
    crumbs: [],
  },
  {
    path: "/about",
    priority: "0.8",
    changefreq: "monthly",
    title: "About Us | Academic Development Forum",
    description: "Learn about Academic Development Forum (ADF), our global mission, editorial standards, and commitment to open-access scholarly dissemination.",
    keywords: "about ADF, Academic Development Forum, publishing mission, academic forum, scholarly dissemination",
    h1: "About Academic Development Forum",
    crumbs: [{ name: "About Us", path: "/about" }],
  },
  {
    path: "/journals",
    priority: "0.9",
    changefreq: "weekly",
    title: "Academic Journals | IJEAE | Academic Development Forum",
    description: "Discover open-access, peer-reviewed journals published by ADF, including the International Journal of English for Academic Excellence (IJEAE).",
    keywords: "academic journals, peer-reviewed journal, IJEAE, applied linguistics journal, ELT research, open access journal",
    h1: "Academic Journals",
    crumbs: [{ name: "Journals", path: "/journals" }],
  },
  {
    path: "/chapter-publications",
    priority: "0.9",
    changefreq: "weekly",
    title: "Book Chapter Publications | Convergence Series | ADF",
    description: "Submit your research to the ADF Convergence Series. Peer-reviewed edited volumes with ISBN, DOI assignment, and international scholarly indexing.",
    keywords: "book chapter publication, edited volume, call for chapters, ISBN book chapter, convergence series",
    h1: "Book Chapter Publications",
    crumbs: [{ name: "Chapter Publications", path: "/chapter-publications" }],
  },
  {
    path: "/chapter-publications/submit",
    priority: "0.8",
    changefreq: "monthly",
    title: "Submit Book Chapter | ADF Convergence Series",
    description: "Online manuscript submission portal for book chapters under the ADF Convergence Series. Review guidelines and submit your chapter.",
    keywords: "submit book chapter, chapter manuscript submission, call for chapters submission, convergence series submit",
    h1: "Submit Book Chapter Manuscript",
    crumbs: [{ name: "Chapter Publications", path: "/chapter-publications" }, { name: "Submit Chapter", path: "/chapter-publications/submit" }],
  },
  {
    path: "/literary-publications",
    priority: "0.9",
    changefreq: "weekly",
    title: "Literary Publications & Creative Books | ADF",
    description: "Submit and publish literary works, poetry collections, novels, and creative monographs with international distribution through ADF.",
    keywords: "literary publications, poetry publishing, book publishing, creative writing, author publishing",
    h1: "Literary Publications & Creative Books",
    crumbs: [{ name: "Literary Publications", path: "/literary-publications" }],
  },
  {
    path: "/literary-publications/submit",
    priority: "0.8",
    changefreq: "monthly",
    title: "Submit Literary Manuscript | ADF Publishing",
    description: "Submit your poetry collection, novel, or creative manuscript for professional review, editing, ISBN assignment, and global publishing with ADF.",
    keywords: "submit literary manuscript, poetry manuscript submission, publish novel, creative writing submission",
    h1: "Submit Literary Manuscript",
    crumbs: [{ name: "Literary Publications", path: "/literary-publications" }, { name: "Submit Manuscript", path: "/literary-publications/submit" }],
  },
  {
    path: "/academic-programmes",
    priority: "0.9",
    changefreq: "weekly",
    title: "Academic Programmes & FDP | ADF",
    description: "International faculty development programmes, research workshops, capacity building seminars, and academic training by Academic Development Forum.",
    keywords: "academic programmes, faculty development programme, FDP, academic workshops, research seminars",
    h1: "Academic Programmes & Faculty Development",
    crumbs: [{ name: "Academic Programmes", path: "/academic-programmes" }],
    contentHtml: `
          <section>
            <h2>Faculty Development Programmes (FDP) &amp; Academic Training</h2>
            <p>Academic Development Forum (ADF) conducts international Faculty Development Programmes (FDP), advanced research methodology workshops, academic writing masterclasses, and publication ethics seminars for university faculty, researchers, and doctoral candidates.</p>
          </section>

          <section>
            <h2>Core Academic Programme Disciplines</h2>
            <ul>
              <li><strong>Research Methodology &amp; Analytical Frameworks:</strong> Quantitative and qualitative research designs, statistical analysis, survey methodologies, and empirical modeling.</li>
              <li><strong>Scholarly Writing &amp; Indexed Journal Publishing:</strong> Manuscript structure, abstract refinement, peer-review response workflows, and publication standards for Scopus, Web of Science, and UGC-CARE indexed journals.</li>
              <li><strong>Publication Ethics &amp; Integrity:</strong> Guidelines on addressing plagiarism, authorship criteria, conflicts of interest, and adherence to COPE (Committee on Publication Ethics) standards.</li>
              <li><strong>Innovative Academic Pedagogies:</strong> Outcome-based instructional strategies, modern digital curriculum design, and higher education academic leadership.</li>
            </ul>
          </section>

          <section>
            <h2>Programme Highlights &amp; Participant Benefits</h2>
            <ul>
              <li>Live interactive virtual sessions led by renowned international scholars and university professors.</li>
              <li>Structured digital course packs, lecture recordings, research templates, and reference materials provided to all participants.</li>
              <li>Verifiable e-certificates of completion for academic career advancement and institutional API scoring.</li>
              <li>Direct registration via verified Google Forms with clear enrollment details.</li>
            </ul>
          </section>

          <section>
            <h2>Institutional Collaborations &amp; Inquiries</h2>
            <p>Academic institutions and universities seeking customized departmental FDPs or joint training workshops can connect with the ADF Academic Affairs Directorate.</p>
            <p><a href="/contact">Inquire About Institutional Programmes</a> | <a href="/guidelines">Read Publishing Guidelines</a></p>
          </section>
    `,
  },
  {
    path: "/bookstore",
    priority: "0.8",
    changefreq: "weekly",
    title: "Bookstore & Published Volumes | ADF",
    description: "Browse and order peer-reviewed academic books, edited volumes, literary works, and conference proceedings published by Academic Development Forum.",
    keywords: "academic bookstore, published books, academic monographs, buy academic books",
    h1: "Academic Bookstore & Published Volumes",
    crumbs: [{ name: "Bookstore", path: "/bookstore" }],
  },
  {
    path: "/announcements",
    priority: "0.8",
    changefreq: "daily",
    title: "Announcements & CFP | Academic Development Forum",
    description: "Explore academic announcements, calls for papers, book chapter submissions, journal releases, and event updates from Academic Development Forum.",
    keywords: "call for papers, CFP, academic announcements, submission deadlines, journal CFP",
    h1: "Announcements & Call for Papers",
    crumbs: [{ name: "Announcements", path: "/announcements" }],
  },
  {
    path: "/editorial-board",
    priority: "0.8",
    changefreq: "monthly",
    title: "Editorial Board & Reviewers | ADF",
    description: "Distinguished international editorial board members, subject matter experts, and peer reviewers guiding publications at Academic Development Forum.",
    keywords: "editorial board, academic editors, peer review panel, journal editors, international editorial board",
    h1: "Editorial Board & Reviewers",
    crumbs: [{ name: "Editorial Board", path: "/editorial-board" }],
  },
  {
    path: "/guidelines",
    priority: "0.8",
    changefreq: "monthly",
    title: "Publishing Guidelines | Academic Development Forum",
    description: "Official guidelines for authors, editors, and peer reviewers at Academic Development Forum. Access manuscript templates, workflow standards, and ethical criteria.",
    keywords: "publishing guidelines, author guidelines, editor guidelines, reviewer guidelines, manuscript submission",
    h1: "Publishing Guidelines Directory",
    crumbs: [{ name: "Guidelines", path: "/guidelines" }],
  },
  {
    path: "/guidelines/author",
    priority: "0.8",
    changefreq: "monthly",
    title: "Author Submission Guidelines | ADF",
    description: "Complete author guidelines, manuscript preparation instructions, reference formatting, and checklist for submissions to Academic Development Forum.",
    keywords: "author guidelines, manuscript preparation, submission checklist, referencing style, academic publishing guidelines",
    h1: "Author Submission Guidelines",
    crumbs: [{ name: "Guidelines", path: "/guidelines" }, { name: "Author Guidelines", path: "/guidelines/author" }],
  },
  {
    path: "/guidelines/editor",
    priority: "0.7",
    changefreq: "monthly",
    title: "Editor Guidelines & Responsibilities | ADF",
    description: "Editorial roles, responsibilities, and COPE-aligned ethical standards for editors managing peer review and volume curation at Academic Development Forum.",
    keywords: "editor guidelines, editorial responsibilities, peer review ethics, COPE guidelines",
    h1: "Editor Guidelines & Responsibilities",
    crumbs: [{ name: "Guidelines", path: "/guidelines" }, { name: "Editor Guidelines", path: "/guidelines/editor" }],
  },
  {
    path: "/guidelines/reviewer",
    priority: "0.7",
    changefreq: "monthly",
    title: "Reviewer Guidelines & Evaluation Criteria | ADF",
    description: "Evaluation checklist, ethical principles, and double-blind peer review instructions for academic reviewers at Academic Development Forum.",
    keywords: "reviewer guidelines, peer review criteria, manuscript evaluation, referee instructions",
    h1: "Reviewer Guidelines & Evaluation Criteria",
    crumbs: [{ name: "Guidelines", path: "/guidelines" }, { name: "Reviewer Guidelines", path: "/guidelines/reviewer" }],
  },
  {
    path: "/policies",
    priority: "0.7",
    changefreq: "monthly",
    title: "Publication Ethics & Policies | ADF",
    description: "ADF publication ethics, COPE compliance, open-access policy, CC BY 4.0 licensing, retraction guidelines, and plagiarism criteria.",
    keywords: "publication ethics, COPE compliance, open access policy, plagiarism policy, retraction policy",
    h1: "Publication Ethics & Policies",
    crumbs: [{ name: "Policies", path: "/policies" }],
  },
  {
    path: "/contact",
    priority: "0.7",
    changefreq: "monthly",
    title: "Contact Us | Academic Development Forum",
    description: "Get in touch with Academic Development Forum for publication inquiries, journal submissions, editorial board applications, and support.",
    keywords: "contact ADF, academic publishing inquiry, editorial office contact, journal submission help",
    h1: "Contact Academic Development Forum",
    crumbs: [{ name: "Contact Us", path: "/contact" }],
  },
];
