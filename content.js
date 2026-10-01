// Edit this file to change what the site says.
// Rule of thumb: every claim here should be backed by the CV. Add numbers only when they are real.
window.CONTENT = {
  name: "Sri Balaji",
  role: "Senior Cloud & Platform Engineer · Kubernetes · DevSecOps",
  tagline: "I design and run the platforms regulated banks build on: secure-by-default Kubernetes, delivery pipelines that satisfy auditors, and the guardrails that let many product teams ship safely. I lead modernisation programmes and advise banks on their cloud strategy.",
  location: "Almere, Netherlands",
  timeZone: "Europe/Amsterdam",
  // Job-search details (availability, permit transfer, the 90-day plan) show only to visitors who arrive
  // through a personal ?ref= link. Everyone else, including colleagues and search engines, sees `status`.
  availability: "Open to senior, staff & principal platform roles · Netherlands",
  status: "Platform engineering for regulated banking · Almere, NL",
  email: "sribalaji2614@gmail.com",
  photo: "photo.jpg",
  cv: null, // e.g. "SriBalaji-CV.pdf": set a file name to show Download CV buttons

  // Visitor analytics (cookieless, via GoatCounter). Put your GoatCounter code here, e.g. "sribalaji"
  // for https://sribalaji.goatcounter.com. null = no analytics at all.
  goatcounter: "sribalaji",
  links: [
    { label: "LinkedIn", url: "https://linkedin.com/in/sribalaji2604" },
    { label: "GitHub", url: "https://github.com/Sri2614" },
  ],

  // Shown as a Kubernetes-style manifest in the hero.
  manifest: [
    "apiVersion: people/v1",
    "kind: Engineer",
    "metadata:",
    "  name: sri-balaji",
    "  location: almere-nl",
    "spec:",
    "  experience: 7y+",
    "  domain: regulated-banking",
    "  scope: [platform-strategy, modernisation, advisory]",
    "  platforms: [aks, eks, openshift]",
    "  delivery: [terraform, gitops, argocd]",
    "  security: [policy-as-code, entra-id, rbac]",
  ],
  manifestOpen: [
    "status:",
    "  openToWork: true",
    "  workPermit: nl-hsm  # transferable",
  ],

  stats: [
    { value: "7+", label: "years building cloud platforms" },
    { value: "7", label: "professional certifications" },
    { value: "AKS + EKS", label: "Kubernetes platforms I run in production" },
  ],

  // About. **double asterisks** mark phrases highlighted in the lede.
  about: {
    lede: "I’m a senior cloud and platform engineer with over seven years in cloud, currently at **Backbase**, where digital banking runs under strict regulation. My work sits where engineering meets risk: I lead **application modernisation programmes** for banks across multiple markets, own the **delivery platform** product teams release through, and advise enterprise clients on their **AWS and Azure strategy**.",
    notes: [
      { k: "How I think", text: "I think in systems, not tickets. A good platform is fast for developers and boring for auditors: Kubernetes on AKS and EKS, every environment defined in Terraform and Git, and security enforced as pipeline gates rather than a scramble before release." },
      { k: "Growing engineers", text: "I invest in making other engineers better: I run workshops for engineering chapters on Kubernetes security, identity with Entra ID and ArgoCD, and DevSecOps, and I support client teams with training as they adopt the platform." },
    ],
  },
  facts: [
    { k: "Based in", v: "Almere, Netherlands", icon: "pin", clock: true },
    { k: "Work authorisation", v: "Dutch highly skilled migrant permit", icon: "shield", badge: "Transferable to a recognised sponsor" },
    { k: "Languages", icon: "chat", langs: [
      { name: "English", level: "Professional" },
      { name: "Dutch", level: "A2 · actively learning", cefr: 2 },
      { name: "Tamil", level: "Native" },
    ] },
    { k: "Education", v: "B.Tech, Information Technology", sub: "Jeppiaar Engineering College", icon: "cap" },
  ],

  // How I work: principles, each tied to something I actually do (see the CV).
  principles: [
    { title: "Security is a pipeline stage, not an audit.", desc: "SAST, DAST and IaC scanning run as policy-as-code gates, so compliance is continuous instead of a scramble before release." },
    { title: "Platforms are products.", desc: "Product teams are my customers: they get self-service delivery through GitOps and Helm, not a ticket queue to an infrastructure team." },
    { title: "Everything as code.", desc: "Environments, policies and access live in Terraform and Git, so every change is reviewable, repeatable and auditable." },
    { title: "Alert on what users feel.", desc: "SLO-based dashboards and alerting keep on-call attention on what actually affects customers, which shortens time to resolution." },
  ],

  // Anonymised on purpose: no client names, no internal numbers.
  // To add real, shareable impact later, fill `metrics` like: ["~N services migrated", "lead time: days → hours"].
  caseStudies: [
    {
      title: "Modernising legacy banking services onto Kubernetes",
      context: "Application modernisation · Multiple markets",
      myRole: "Programme lead",
      challenge: "Legacy services for banking clients across several markets were hard to scale, release and observe.",
      approach: "Led the move to cloud-native microservices on AKS and EKS with Spring Boot, Docker and Helm; added event-driven processing on Azure Functions, Service Bus and Event Grid; ran observability end to end with SLO-based dashboards.",
      result: "Self-service delivery for product teams and shorter time to resolution on production incidents.",
      metrics: [],
      stack: ["AKS", "EKS", "Helm", "Azure Monitor"],
    },
    {
      title: "GitOps delivery with least-privilege access",
      context: "Platform engineering · Multi-team Kubernetes",
      myRole: "CI/CD platform owner",
      challenge: "Several product teams shipping to shared clusters needed faster, safer releases and tight control over who could deploy what.",
      approach: "Own the Azure DevOps platform: multi-stage pipelines with SAST and DAST gates and GitOps release through ArgoCD. Integrated Entra ID with AKS and ArgoCD, and hardened workloads with pod security standards, network policies and RBAC.",
      result: "Shorter release cycles and role-based, least-privilege access across the whole delivery chain.",
      metrics: [],
      stack: ["AKS", "ArgoCD", "Azure DevOps", "Entra ID"],
    },
    {
      title: "Continuous compliance for a regulated banking platform",
      context: "Digital banking · Regulated fintech",
      myRole: "Architect",
      challenge: "Banking clients have to pass strict security audits. Checks that only run after release slow delivery down and leave gaps between audits.",
      approach: "Designed secure AWS landing zones with WAF, Security Hub, GuardDuty, Inspector and Macie, and automated AWS Config and Control Tower for continuous compliance checks.",
      result: "Compliance evidenced continuously against banking audit requirements, instead of at release time.",
      metrics: [],
      stack: ["AWS Control Tower", "Security Hub", "AWS Config", "GuardDuty"],
    },
    {
      title: "A secure-by-default Terraform module library",
      context: "Cloud consultancy · Enterprise AWS migrations",
      myRole: "Author",
      challenge: "Delivery teams provisioning AWS for enterprise clients rebuilt the same infrastructure again and again, with inconsistent security controls.",
      approach: "Built reusable Terraform modules for EKS, RDS and Lambda with security controls baked in, backed by IAM, Secrets Manager and KMS policies and GitLab CI pipelines with security scanning.",
      result: "Adopted across delivery teams, so every new environment started secure by default.",
      metrics: [],
      stack: ["Terraform", "AWS", "KMS", "GitLab CI"],
    },
  ],

  // A starting plan, not a template: the specifics come from the team. Each point reflects how I already work (see the CV).
  first90: {
    title: "My first 90 days on your platform team.",
    intro: "How I would start. The specifics come from your teams, not from a template.",
    phases: [
      { when: "Days 1–30", title: "Listen and map", points: [
        "Meet product teams, security and operations to learn where delivery hurts today.",
        "Map how a change really reaches production, including the manual steps and the waiting.",
        "Read the incident history, audit findings and on-call load before proposing anything.",
      ] },
      { when: "Days 31–60", title: "Earn trust with quick wins", points: [
        "Remove one or two frictions teams feel every day, like a slow pipeline stage or a manual access request.",
        "Move a first piece of the path to code and GitOps, so it becomes reviewable and repeatable.",
        "Agree SLOs and alerting for one critical service with the team that owns it.",
      ] },
      { when: "Days 61–90", title: "Set direction", points: [
        "Propose a platform roadmap tied to what teams and auditors need, with the trade-offs made explicit.",
        "Add security checks to the path where they are missing, as gates rather than reviews.",
        "Start knowledge sharing through workshops and docs, so the platform never depends on one person.",
      ] },
    ],
  },

  workshops: [
    { type: "Workshop", icon: "terminal", title: "Integrating Azure AD with ArgoCD ApplicationSets on AWS EKS",
      where: "Amsterdam System Engineering Chapter",
      desc: "Hands-on session on identity and permission management, and on secure, automated CI/CD delivery.",
      tags: ["ArgoCD", "Azure AD", "AWS EKS"] },
    { type: "Talk", icon: "mic", title: "Microsoft Azure fundamentals for front-end engineers",
      where: "Front End Chapter",
      desc: "Cloud computing models, App Services, Functions and Storage, and how front-end applications integrate with them.",
      tags: ["Azure", "App Services", "Functions"] },
    { type: "Workshop series", icon: "layers", title: "Container security, Kubernetes security & DevSecOps",
      where: "Internal engineering teams",
      desc: "Internal workshops on securing containers and clusters, and on building security into the delivery pipeline.",
      tags: ["Containers", "Kubernetes", "DevSecOps"] },
  ],

  // LinkedIn recommendations, with each person's permission. The block stays hidden while empty.
  // { quote: "...", name: "Jane de Vries", role: "Engineering Manager, Company" }
  testimonials: [],

  // Every line maps to a bullet on the CV. `themes` groups a role's work by area of responsibility.
  experience: [
    {
      role: "Senior Systems Engineer, Cloud/DevOps, Security & Consulting",
      company: "Backbase",
      period: "Oct 2022 – Present",
      meta: "Amsterdam · Digital banking platform (regulated fintech)",
      summary: "Senior engineer across platform, security and client advisory for a regulated digital-banking platform, working with banks across multiple markets.",
      stack: ["AKS", "EKS", "ArgoCD", "Azure DevOps", "Terraform", "Entra ID"],
      themes: [
        { title: "Strategy & advisory", points: [
          "Lead application modernisation programmes for banks across multiple markets, taking legacy services to cloud-native microservices on AKS and EKS with Spring Boot, Docker and Helm.",
          "Advise enterprise banking clients on AWS and Azure adoption and their cloud strategy.",
          "Prove out where the platform goes next: built proofs of concept integrating ArgoCD GitOps with Azure AD and ApplicationSets, demonstrating stronger security and simpler access management inside CI/CD.",
        ] },
        { title: "Platform & delivery", points: [
          "Own the delivery platform in Azure DevOps: multi-stage pipelines with SAST and DAST gates and GitOps releases to AKS through ArgoCD, shortening release cycles.",
          "Provision every environment as code through Terraform and ARM templates, with secrets managed in Azure Key Vault.",
          "Build event-driven services on Azure Functions, Service Bus and Event Grid for asynchronous and background workloads.",
        ] },
        { title: "Security & compliance", points: [
          "Design secure AWS landing zones with WAF, Security Hub, GuardDuty, Inspector and Macie, automating AWS Config and Control Tower for continuous compliance against banking audit requirements.",
          "Integrate Entra ID with AKS and ArgoCD to enforce least-privilege, role-based access across the delivery chain.",
          "Harden Kubernetes workloads with pod security standards, network policies and RBAC.",
        ] },
        { title: "Reliability & client delivery", points: [
          "Run observability end to end with Azure Monitor, Log Analytics and Application Insights, using SLO-based dashboards and custom alerting to shorten time to resolution.",
          "Deliver Backbase’s retail banking product on clients’ own infrastructure, customising and integrating it with their existing systems, with ongoing support and training for adoption.",
        ] },
      ],
    },
    {
      role: "Senior Cloud Engineer",
      company: "SecureKloud Technologies",
      period: "Feb 2021 – Sep 2022",
      meta: "India · Cloud consultancy",
      summary: "Designed and delivered AWS migrations and secure-by-default foundations for enterprise clients.",
      stack: ["AWS", "Terraform", "GitLab CI", "KMS"],
      points: [
        "Assessed enterprise workloads and designed best-fit AWS migration architectures, then delivered the migrations.",
        "Built a reusable Terraform module library for EKS, RDS and Lambda with security controls baked in, adopted across delivery teams.",
        "Implemented AWS WAF, GuardDuty and Security Hub, and designed IAM, Secrets Manager and KMS policies for authentication and encryption at rest and in transit.",
        "Built GitLab CI/CD pipelines with integrated security scanning, enforcing compliance before release.",
        "Configured CloudWatch and AWS Config for proactive monitoring and security auditing.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Revature",
      period: "Apr 2019 – Feb 2021",
      meta: "India",
      summary: "Where it started: cloud-native applications, AWS security and my first Kubernetes clusters.",
      stack: ["Java", "Spring Boot", "AWS", "Kops", "Docker"],
      points: [
        "Developed cloud-native applications for clients using Java, Spring Boot and AWS services.",
        "Managed secure AWS deployments, including IAM policies, VPC security groups and CloudTrail logging.",
        "Secured Kubernetes clusters using Kops and eksctl, integrating Helm for streamlined deployments.",
        "Wrote Terraform templates and applied Docker security practices for secure image builds and vulnerability scanning.",
      ],
    },
  ],

  // Skills as a bento grid. `roles` = where each capability was used, per the CV;
  // "since" is derived from the earliest of those roles, never typed in by hand.
  roles: [
    { key: "bb", name: "Backbase", year: 2022 },
    { key: "sk", name: "SecureKloud", year: 2021 },
    { key: "rv", name: "Revature", year: 2019 },
  ],
  capabilities: [
    { id: "k8s", name: "Kubernetes platforms", tools: "AKS · EKS · OpenShift · Helm · Docker", roles: ["bb", "sk", "rv"],
      evidence: "Run AKS and EKS platforms for banking product teams; hardened clusters with pod security, network policies and RBAC.",
      highlight: "From securing clusters with Kops to running AKS and EKS for banks." },
    { id: "iac", name: "Infrastructure as Code", tools: "Terraform · ARM templates · CloudFormation · Pulumi", roles: ["bb", "sk", "rv"],
      evidence: "Every environment defined as code; built a secure-by-default Terraform module library." },
    { id: "gitops", name: "GitOps & CI/CD", tools: "Azure DevOps · ArgoCD · GitLab CI · GitHub Actions", roles: ["bb", "sk"],
      evidence: "Own the Azure DevOps platform with security gates and GitOps releases through ArgoCD." },
    { id: "sec", name: "Cloud security & compliance", tools: "Entra ID · RBAC · SAST/DAST · policy-as-code · WAF · GuardDuty · Security Hub · KMS · Vault", roles: ["bb", "sk", "rv"],
      evidence: "Security as pipeline gates; AWS landing zones with continuous compliance for banking audits." },
    { id: "obs", name: "Observability", tools: "Azure Monitor · App Insights · Prometheus · Grafana · CloudWatch", roles: ["bb", "sk"],
      evidence: "SLO-based dashboards and alerting that shorten time to resolution." },
    { id: "cloud", name: "Cloud architecture", tools: "Azure · AWS · landing zones · hybrid / on-prem", roles: ["bb", "sk"],
      evidence: "AWS migration architectures, landing zones, and banking deployments on clients’ own infrastructure." },
    { id: "apps", name: "Application platforms", tools: "Spring Boot · Azure Functions · Service Bus · Event Grid · Lambda", roles: ["bb", "sk", "rv"],
      evidence: "Cloud-native Java services and event-driven processing." },
  ],

  // Exam-based certifications from the CV, grouped so the strongest lead. `year` only where the CV states one.
  certifications: [
    { group: "Cloud & platform", items: [
      { issuer: "AWS", name: "Solutions Architect – Associate", short: "Solutions Architect", tier: "Associate" },
      { issuer: "AWS", name: "Developer – Associate", short: "Developer", tier: "Associate" },
      { issuer: "HashiCorp", name: "Terraform Associate", short: "Terraform", tier: "Associate" },
      { issuer: "CNCF", name: "Kubernetes and Cloud Native Associate (KCNA)", short: "Kubernetes & Cloud Native", tier: "KCNA" },
    ] },
    { group: "Foundations", items: [
      { issuer: "Microsoft", name: "Azure Fundamentals", short: "Azure", tier: "Fundamentals" },
      { issuer: "Microsoft", name: "Azure Data Fundamentals", short: "Azure Data", tier: "Fundamentals" },
      { issuer: "Oracle", name: "Oracle Cloud Infrastructure Foundations Associate", short: "OCI Foundations", tier: "2020", year: 2020 },
    ] },
  ],

  // Course completions from the CV: listed as learning, not as certifications.
  learning: [
    { issuer: "Anthropic", name: "Claude Code in Action", year: 2026 },
    { issuer: "Anthropic", name: "Claude Code 101", year: 2026 },
    { issuer: "LinkedIn Learning", name: "AI Evaluations for Product Leaders and AI PMs", year: 2026 },
    { issuer: "LinkedIn Learning", name: "Prompt Engineering: How to Talk to the AIs", year: 2026 },
  ],
};
