// Edit this file to change what the site says.
// Rule of thumb: every claim here should be backed by the CV. Add numbers only when they are real.
window.CONTENT = {
  name: "Sri Balaji",
  role: "Senior Cloud & Platform Engineer · Kubernetes · DevSecOps",
  tagline: "I run the Kubernetes platforms that banking product teams ship on, and build security into delivery instead of bolting it on afterwards. Alongside that, I’ve taught cloud and DevOps to 50,000+ students.",
  location: "Almere, Netherlands",
  timeZone: "Europe/Amsterdam",
  availability: "Open to roles in the Netherlands · on-site or hybrid",
  email: "sribalaji2614@gmail.com",
  photo: "photo.jpg",
  cv: null, // e.g. "SriBalaji-CV.pdf": set a file name to show Download CV buttons
  links: [
    { label: "LinkedIn", url: "https://linkedin.com/in/sribalaji2604" },
    { label: "GitHub", url: "https://github.com/Sri2614" },
    { label: "TheSimplifiedTech", url: "https://thesimplifiedtech.com" },
    // { label: "Udemy", url: "https://www.udemy.com/user/your-username/" },
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
    "  platforms: [aks, eks, openshift]",
    "  delivery: [terraform, gitops, argocd]",
    "  security: [policy-as-code, entra-id, rbac]",
    "status:",
    "  openToWork: true",
    "  workPermit: nl-hsm  # transferable",
  ],

  stats: [
    { value: "7+", label: "years building cloud platforms" },
    { value: "50k+", label: "students taught on Udemy" },
    { value: "AKS + EKS", label: "Kubernetes platforms I run in production" },
  ],

  about: [
    "Senior cloud and platform engineer with over seven years of experience, currently in regulated digital banking at Backbase. I lead application modernisation programmes, own the CI/CD platform product teams release through, and advise enterprise banking clients on their AWS and Azure strategy.",
    "My focus is platforms that are fast for developers and boring for auditors: Kubernetes on AKS and EKS, everything defined in Terraform and Git, and security checks that run as pipeline gates rather than as a pre-release scramble.",
    "Outside client work I teach. I founded TheSimplifiedTech, where cloud and DevOps are learned through hands-on labs rather than lectures, and I run workshops for engineering chapters on Kubernetes security, identity and DevSecOps.",
  ],
  facts: [
    { k: "Based in", v: "Almere, Netherlands" },
    { k: "Work authorisation", v: "Dutch highly skilled migrant permit, transferable to a recognised sponsor" },
    { k: "Languages", v: "English (professional) · Dutch (A2, actively learning) · Tamil (native)" },
    { k: "Education", v: "B.Tech, Information Technology · Jeppiaar Engineering College" },
  ],

  // Short Dutch intro shown in About. Kept simple on purpose (A2 and learning).
  dutch: {
    title: "In het Nederlands",
    text: "Ik ben een senior cloud- en platformengineer met meer dan zeven jaar ervaring. Bij Backbase bouw en beheer ik Kubernetes-platformen voor digitale banken. Ik automatiseer alles met Terraform en GitOps, en bouw beveiliging vanaf het begin in de pipeline in. Ik woon in Almere en leer actief Nederlands.",
  },

  // How I work: principles, each tied to something I actually do (see the CV).
  principles: [
    { title: "Security is a pipeline stage, not an audit.", desc: "SAST, DAST and IaC scanning run as policy-as-code gates, so compliance is continuous instead of a scramble before release." },
    { title: "Platforms are products.", desc: "Product teams get self-service delivery through GitOps and Helm, rather than filing tickets with an infrastructure team." },
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

  // Public work anyone can open: the platform I founded.
  publicWork: [
    { title: "Hands-on labs", desc: "Guided, browser-based terminal labs for Docker, Kubernetes, Helm, Terraform and more.", url: "https://thesimplifiedtech.com/labs" },
    { title: "Capstone projects", desc: "Progressive projects that take one app from beginner to production-grade.", url: "https://thesimplifiedtech.com/capstones" },
    { title: "Career paths", desc: "Structured learning paths for cloud and DevOps roles.", url: "https://thesimplifiedtech.com/career-paths" },
    { title: "Blog", desc: "Articles on cloud and DevOps, written for engineers who are starting out.", url: "https://thesimplifiedtech.com/blog" },
  ],
  workshops: [
    { title: "Azure AD + ArgoCD ApplicationSets on AWS EKS", where: "Amsterdam System Engineering Chapter" },
    { title: "Microsoft Azure fundamentals for front-end engineers", where: "Front End Chapter" },
    { title: "Container security, Kubernetes security & DevSecOps", where: "Internal workshops" },
  ],

  // LinkedIn recommendations, with each person's permission. The block stays hidden while empty.
  // { quote: "...", name: "Jane de Vries", role: "Engineering Manager, Company" }
  testimonials: [],

  experience: [
    {
      role: "Senior Systems Engineer, Cloud/DevOps, Security & Consulting",
      company: "Backbase",
      period: "Oct 2022 – Present",
      meta: "Amsterdam · Digital banking platform (regulated fintech)",
      stack: ["AKS", "EKS", "ArgoCD", "Azure DevOps", "Terraform", "Entra ID"],
      points: [
        "Lead application modernisation programmes for banking clients across multiple markets, moving legacy services onto cloud-native microservices on AKS and EKS.",
        "Own the Azure DevOps CI/CD platform: security-gated pipelines and GitOps releases through ArgoCD, with Entra ID enforcing least-privilege access.",
        "Deploy and customise Backbase’s retail banking product on clients’ on-premises infrastructure, with ongoing support and training for adoption.",
        "Advise enterprise banking clients on AWS and Azure adoption, and run workshops on Kubernetes security and DevSecOps.",
      ],
    },
    {
      role: "Founder & Instructor",
      company: "TheSimplifiedTech",
      url: "https://thesimplifiedtech.com",
      period: "Alongside",
      meta: "Independent · Cloud & DevOps education",
      stack: ["Kubernetes", "Terraform", "CI/CD", "Multi-cloud"],
      points: [
        "Teach cloud and DevOps through hands-on labs rather than lectures: over 50,000 students on Udemy, covering Kubernetes, Terraform, CI/CD and multi-cloud architecture.",
      ],
    },
    {
      role: "Senior Cloud Engineer",
      company: "SecureKloud Technologies",
      period: "Feb 2021 – Sep 2022",
      meta: "India · Cloud consultancy",
      stack: ["AWS", "Terraform", "GitLab CI", "KMS"],
      points: [
        "Designed AWS migration architectures and delivered migrations for enterprise clients.",
        "Built a secure-by-default Terraform module library for EKS, RDS and Lambda, adopted across delivery teams.",
        "Designed IAM, Secrets Manager and KMS policies and brought security scanning into GitLab CI before release.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Revature",
      period: "Apr 2019 – Feb 2021",
      meta: "India",
      stack: ["Java", "Spring Boot", "AWS", "Kops", "Docker"],
      points: [
        "Built cloud-native Java and Spring Boot applications on AWS for clients.",
        "Secured AWS deployments and Kubernetes clusters (Kops, eksctl, Helm), with Terraform and hardened Docker builds.",
      ],
    },
  ],

  // Skills as a bento grid. `roles` = where each capability was used, per the CV;
  // "since" is derived from the earliest of those roles, never typed in by hand.
  roles: [
    { key: "bb", name: "Backbase", year: 2022 },
    { key: "sk", name: "SecureKloud", year: 2021 },
    { key: "rv", name: "Revature", year: 2019 },
    { key: "ts", name: "Teaching", year: null },
  ],
  capabilities: [
    { id: "k8s", name: "Kubernetes platforms", tools: "AKS · EKS · OpenShift · Helm · Docker", roles: ["bb", "sk", "rv", "ts"],
      evidence: "Run AKS and EKS platforms for banking product teams; hardened clusters with pod security, network policies and RBAC.",
      highlight: "From securing clusters with Kops to running AKS and EKS for banks." },
    { id: "iac", name: "Infrastructure as Code", tools: "Terraform · ARM templates · CloudFormation · Pulumi", roles: ["bb", "sk", "rv", "ts"],
      evidence: "Every environment defined as code; built a secure-by-default Terraform module library." },
    { id: "gitops", name: "GitOps & CI/CD", tools: "Azure DevOps · ArgoCD · GitLab CI · GitHub Actions", roles: ["bb", "sk", "ts"],
      evidence: "Own the Azure DevOps platform with security gates and GitOps releases through ArgoCD." },
    { id: "sec", name: "Cloud security & compliance", tools: "Entra ID · RBAC · SAST/DAST · policy-as-code · WAF · GuardDuty · Security Hub · KMS · Vault", roles: ["bb", "sk", "rv"],
      evidence: "Security as pipeline gates; AWS landing zones with continuous compliance for banking audits." },
    { id: "obs", name: "Observability", tools: "Azure Monitor · App Insights · Prometheus · Grafana · CloudWatch", roles: ["bb", "sk"],
      evidence: "SLO-based dashboards and alerting that shorten time to resolution." },
    { id: "cloud", name: "Cloud architecture", tools: "Azure · AWS · landing zones · hybrid / on-prem", roles: ["bb", "sk", "ts"],
      evidence: "AWS migration architectures, landing zones, and banking deployments on clients’ own infrastructure." },
    { id: "apps", name: "Application platforms", tools: "Spring Boot · Azure Functions · Service Bus · Event Grid · Lambda", roles: ["bb", "sk", "rv"],
      evidence: "Cloud-native Java services and event-driven processing." },
  ],

  // Associate-level and above only. Foundational certs stay on the CV.
  certifications: [
    { issuer: "AWS", name: "Solutions Architect – Associate" },
    { issuer: "AWS", name: "Developer – Associate" },
    { issuer: "HashiCorp", name: "Terraform Associate" },
  ],
};
