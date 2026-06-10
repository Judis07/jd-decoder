export interface DecodedResult {
  roleTitle: string;
  seniority: "Junior" | "Mid-Level" | "Senior" | "Lead" | "Staff / Principal";
  seniorityReason: string;
  confidence: number;
  summary: string;
  translatedSummary: string; // The "Behind the Scenes" candid explanation
  mustHaves: string[];
  niceToHaves: string[];
  redFlags: {
    flag: string;
    description: string;
    severity: "low" | "medium" | "high";
  }[];
  studyChecklist: {
    id: string;
    topic: string;
    completed: boolean;
  }[];
}

export const SAMPLE_JDS = {
  frontend: {
    title: "Senior Frontend Engineer (React & TypeScript)",
    text: `About the Role:
We are looking for a rockstar Senior Frontend Engineer to join our fast-paced team. You will be building cutting-edge user experiences using React and TypeScript. We need someone who is a self-starter, can wear many hats, and doesn't mind flexible hours when we push code to production.

Requirements:
- 5+ years of experience with React, HTML5, CSS3, and modern frontend tools.
- Strong proficiency in TypeScript, Redux Toolkit, and custom React Hooks.
- Experience with Next.js or Vite is highly preferred.
- Familiarity with TailwindCSS and responsive designs.
- Excellent communication skills and ability to work in a high-pressure environment.

Benefits:
- Competitive salary with a great stock option plan.
- Free coffee and snacks in our premium downtown office.
- Unlimited vacation policy (take what you need!).`
  },
  backend: {
    title: "Mid-Level Backend Developer (Node.js & Go)",
    text: `Job Description:
We are scaling our microservices and need a Backend Developer to join our engineering crew. You will design, build, and optimize high-throughput APIs. You will work on database schema designs, migrate legacy endpoints, and maintain our Docker containers. We are looking for someone who works well unsupervised and can hit the ground running.

Key Requirements:
- 3+ years of professional backend development.
- Deep hands-on experience with Node.js (Express/NestJS) or Go (Golang).
- Strong relational database knowledge (PostgreSQL preferred) and caching (Redis).
- Experience with Docker, AWS (ECS, S3, RDS), and RESTful API standards.
- CI/CD pipelines understanding.
- Strong team player. We work hard and play hard.`
  },
  fullstack: {
    title: "Staff Full-Stack Engineer (Next.js & Python)",
    text: `Join our early-stage AI startup!
We are hiring a Staff Full-Stack Developer to lead architectural decisions. You will be building our web application using Next.js, React, Tailwind, and our AI middleware powered by Python (FastAPI). As an early hire, you will wear multiple hats, work closely with the founders, and help define our product roadmap.

Requirements:
- 7+ years of software engineering experience.
- Production-grade experience with Next.js App Router and React Server Components.
- Proficiency in Python, FastAPI, and LangChain or LLM integrations.
- PostgreSQL and Prisma ORM experience.
- Cloud architecture knowledge (AWS or Vercel).
- Ability to manage complex architectural tradeoffs and mentor junior devs.`
  }
};

export function decodeJobDescription(text: string): DecodedResult {
  const lowerText = text.toLowerCase();
  
  // 1. Determine Seniority
  let seniority: DecodedResult["seniority"] = "Mid-Level";
  let seniorityReason = "The job description requests standard professional experience without high leadership or junior mentoring requirements.";
  let confidence = 75;

  if (lowerText.includes("staff") || lowerText.includes("principal") || lowerText.includes("architect")) {
    seniority = "Staff / Principal";
    seniorityReason = "Mentions high-level architectural oversight, organizational influence, strategy alignment, and steering technical directions.";
    confidence = 90;
  } else if (lowerText.includes("lead") || lowerText.includes("director") || lowerText.includes("manager")) {
    seniority = "Lead";
    seniorityReason = "Indicates team guidance, engineering management, process ownership, or directing architectural design.";
    confidence = 85;
  } else if (lowerText.includes("senior") || lowerText.includes("sr.") || lowerText.includes("5+") || lowerText.includes("6+") || lowerText.includes("7+")) {
    seniority = "Senior";
    seniorityReason = "Requires senior ownership, autonomy in design, solving complex technical challenges, and mentoring colleagues.";
    confidence = 92;
  } else if (lowerText.includes("junior") || lowerText.includes("jr.") || lowerText.includes("entry") || lowerText.includes("associate") || lowerText.includes("intern") || lowerText.includes("0-2") || lowerText.includes("1-2 years")) {
    seniority = "Junior";
    seniorityReason = "Presents lower experience requirements, focused scope of work, structured task execution, and highlights guidance from seniors.";
    confidence = 88;
  }

  // 2. Identify Role & Category
  let category: "frontend" | "backend" | "fullstack" | "general" = "general";
  let isFrontend = false;
  let isBackend = false;

  const feKeywords = ["react", "typescript", "vue", "angular", "css", "html", "tailwind", "frontend", "ui", "ux", "next.js", "nextjs", "vite", "javascript"];
  const beKeywords = ["node", "go", "golang", "python", "django", "fastapi", "java", "spring", "backend", "api", "database", "postgres", "mysql", "mongodb", "aws", "docker", "kubernetes", "redis"];

  let feCount = 0;
  let beCount = 0;

  feKeywords.forEach(kw => {
    if (lowerText.includes(kw)) feCount++;
  });
  beKeywords.forEach(kw => {
    if (lowerText.includes(kw)) beCount++;
  });

  if (feCount > 0) isFrontend = true;
  if (beCount > 0) isBackend = true;

  if (isFrontend && isBackend) {
    category = "fullstack";
  } else if (isFrontend) {
    category = "frontend";
  } else if (isBackend) {
    category = "backend";
  }

  // 3. Extract Role Title
  let roleTitle = "Software Engineer";
  if (category === "frontend") {
    roleTitle = `${seniority === "Mid-Level" ? "" : seniority} Frontend Engineer`.trim();
  } else if (category === "backend") {
    roleTitle = `${seniority === "Mid-Level" ? "" : seniority} Backend Engineer`.trim();
  } else if (category === "fullstack") {
    roleTitle = `${seniority === "Mid-Level" ? "" : seniority} Full-Stack Developer`.trim();
  } else {
    // Try to extract lines
    if (text.length > 5 && text.split("\n")[0].length < 60) {
      roleTitle = text.split("\n")[0].replace(/[^a-zA-Z0-9\s()\-]/g, "").trim();
    } else {
      roleTitle = `${seniority} Software Engineer`;
    }
  }

  // 4. Role Summary and Behind-the-scenes Translation
  let summary = "";
  let translatedSummary = "";

  if (category === "frontend") {
    summary = "This role focuses on building interactive, high-performance web applications using modern client-side architectures. Key responsibilities include UI state management, API data hydration, and crafting responsive user experiences.";
    translatedSummary = "They have an existing codebase (possibly with technical debt) that needs new features fast. They want a React/TypeScript expert who can build slick pages without needing constant hand-holding, and who can debug layout bugs across multiple devices.";
  } else if (category === "backend") {
    summary = "This position emphasizes microservices implementation, database modeling, and designing resilient APIs that scale. You will own server reliability, cache layers, cloud configurations, and data security pipelines.";
    translatedSummary = "Their databases are slowing down, and legacy endpoints are starting to fail. They need someone to refactor SQL tables, implement proper index tuning, and containerize applications to deploy on their cloud stacks without bringing down production.";
  } else if (category === "fullstack") {
    summary = "A highly versatile role bridging frontend interfaces and backend infrastructure. You'll be managing data streams from database schemas, server endpoints, and React hooks to deliver complete end-to-end features.";
    translatedSummary = "They are running lean (low engineering count) and want a single developer to do the job of two. You will be writing React components in the morning, updating DB migrations in the afternoon, and dealing with deploy configurations at night.";
  } else {
    summary = "A general software engineering position centered around core development, codebase maintenance, clean coding principles, and collaborating across product lines to achieve design goals.";
    translatedSummary = "This is a standard engineering hire. Expect a mix of bug fixing, code migrations, and regular standups. Make sure you know your computer science basics and can write clean, readable code.";
  }

  // 5. Must-Haves Extraction
  const mustHaves: string[] = [];
  // Detect actual keywords in the text
  const matchAndAdd = (keyword: string, displayName: string) => {
    if (lowerText.includes(keyword) && !mustHaves.includes(displayName)) {
      mustHaves.push(displayName);
    }
  };

  matchAndAdd("react", "React.js Framework");
  matchAndAdd("typescript", "TypeScript (Type Safety)");
  matchAndAdd("next.js", "Next.js (App Router / SSR)");
  matchAndAdd("nextjs", "Next.js Framework");
  matchAndAdd("tailwind", "Tailwind CSS Layouts");
  matchAndAdd("node", "Node.js Runtime");
  matchAndAdd("go", "Golang (Systems Programming)");
  matchAndAdd("golang", "Go Programming Language");
  matchAndAdd("python", "Python Scripting & APIs");
  matchAndAdd("fastapi", "FastAPI Framework");
  matchAndAdd("django", "Django Web Framework");
  matchAndAdd("postgres", "PostgreSQL (Relational DB)");
  matchAndAdd("mongodb", "MongoDB (NoSQL)");
  matchAndAdd("aws", "AWS Cloud Infrastructure");
  matchAndAdd("docker", "Docker Containerization");
  matchAndAdd("kubernetes", "Kubernetes Orchestration");
  matchAndAdd("graphql", "GraphQL Queries & APIs");
  matchAndAdd("redux", "Redux Toolkit / State Mgmt");
  matchAndAdd("vue", "Vue.js Framework");
  matchAndAdd("angular", "Angular Framework");
  matchAndAdd("rest", "RESTful API Integration");

  // Fallbacks if not enough keywords detected
  if (mustHaves.length < 3) {
    if (category === "frontend") {
      mustHaves.push("Modern Javascript (ES6+)", "HTML5 & CSS3 Semantics", "Responsive Layout Engineering");
    } else if (category === "backend") {
      mustHaves.push("Server-side Logic Design", "Database Schemas & Queries", "API Error Handling & Security");
    } else {
      mustHaves.push("Clean Code & DRY Principles", "Version Control (Git)", "Collaborative Agile Workflow");
    }
  }

  // 6. Nice-to-Haves Extraction
  const niceToHaves: string[] = [];
  const niceCandidates = [
    { kw: "jest", name: "Unit Testing (Jest/Vitest)" },
    { kw: "testing library", name: "React Testing Library" },
    { kw: "prisma", name: "Prisma ORM" },
    { kw: "redis", name: "Redis Caching" },
    { kw: "ci/cd", name: "CI/CD Deployment Pipelines" },
    { kw: "github actions", name: "GitHub Actions Automation" },
    { kw: "storybook", name: "Storybook UI Documentation" },
    { kw: "figma", name: "Figma UI Collaboration" },
    { kw: "graphql", name: "GraphQL & Apollo Client" },
    { kw: "sql", name: "Relational Queries (SQL)" },
    { kw: "nosql", name: "NoSQL DB Operations" },
    { kw: "sass", name: "SASS / CSS Preprocessing" },
    { kw: "playwright", name: "Playwright E2E Testing" },
    { kw: "cypress", name: "Cypress Testing Framework" }
  ];

  niceCandidates.forEach(cand => {
    if (lowerText.includes(cand.kw) && !mustHaves.includes(cand.name)) {
      niceToHaves.push(cand.name);
    }
  });

  // Default Nice-To-Haves if empty
  if (niceToHaves.length < 2) {
    niceToHaves.push("Technical Documentation", "Familiarity with Figma", "Performance Profiling & Auditing");
  }

  // 7. Red Flags Check
  const redFlags: DecodedResult["redFlags"] = [];

  if (lowerText.includes("rockstar") || lowerText.includes("ninja") || lowerText.includes("superhero")) {
    redFlags.push({
      flag: "Rockstar / Ninja Mentality",
      description: "Mentions wanting a 'rockstar' or 'ninja'. This often indicates they expect you to pull off solo heroics, work long hours, and resolve complex issues by yourself.",
      severity: "high"
    });
  }

  if (lowerText.includes("fast-paced") || lowerText.includes("rapidly changing") || lowerText.includes("high-pressure")) {
    redFlags.push({
      flag: "Fast-paced & High-pressure Environment",
      description: "Code for 'we do not plan features, timelines are unrealistic, and you will work under high pressure to meet sudden deadlines.'",
      severity: "medium"
    });
  }

  if (lowerText.includes("wear many hats") || lowerText.includes("wear multiple hats") || lowerText.includes("early stage startup")) {
    redFlags.push({
      flag: "Wearing Many Hats",
      description: "Implies understaffed departments. You will likely do product management, devops, design, and QA testing in addition to coding, with no clear scope boundaries.",
      severity: "medium"
    });
  }

  if (lowerText.includes("unsupervised") || lowerText.includes("self-starter") || lowerText.includes("no hand-holding")) {
    redFlags.push({
      flag: "Self-starter / Unsupervised",
      description: "Often translates to 'we don't have an onboarding process, docs are outdated, and no one has time to guide you. You have to figure it out yourself.'",
      severity: "medium"
    });
  }

  if (lowerText.includes("work hard") && lowerText.includes("play hard")) {
    redFlags.push({
      flag: "Work Hard, Play Hard Culture",
      description: "Usually translates to regular overtime and blurred personal boundaries, compensated by office games or beers instead of bonuses.",
      severity: "high"
    });
  }

  if (lowerText.includes("competitive salary") && !lowerText.includes("$") && !lowerText.includes("€") && !lowerText.includes("£") && !lowerText.includes("salary range") && !lowerText.includes("compensation")) {
    redFlags.push({
      flag: "Salary Transparency Gap",
      description: "Claims 'competitive salary' but lists no range. It suggests they might negotiate down based on your previous salary rather than paying fair market value.",
      severity: "low"
    });
  }

  if (lowerText.includes("unlimited vacation") || lowerText.includes("unlimited pto")) {
    redFlags.push({
      flag: "Unlimited Vacation / PTO",
      description: "Statistically leads to employees taking less time off due to peer pressure and lack of accrued limits. Check if there is a mandatory minimum.",
      severity: "low"
    });
  }

  // Ensure there's at least one flag to show as a demo
  if (redFlags.length === 0) {
    redFlags.push({
      flag: "Generic Jargon Detected",
      description: "The JD uses standard templated phrasing, suggesting the HR department might not have aligned fully with engineering on what the role actually requires.",
      severity: "low"
    });
  }

  // 8. Study Checklist Generator
  const studyChecklist: DecodedResult["studyChecklist"] = [];
  let topicId = 1;

  const addTopic = (topic: string) => {
    studyChecklist.push({
      id: `topic-${topicId++}`,
      topic,
      completed: false
    });
  };

  if (category === "frontend") {
    addTopic("Practice React performance: memoization (useMemo, useCallback) and code splitting.");
    addTopic("Understand Server-Side Rendering (SSR) vs Static Site Generation (SSG) in Next.js.");
    addTopic("Master CSS Layouts: Flexbox, Grid, and responsive strategies (media queries, container queries).");
    addTopic("Review TypeScript advanced concepts: Generics, Mapped Types, and Discriminated Unions.");
    addTopic("Build a small component showcasing custom hook logic and client-side error boundaries.");
    addTopic("Prep web vitals and frontend metrics: LCP, FID, CLS, and bundle optimization.");
  } else if (category === "backend") {
    addTopic("Practice system design: design a rate-limiter, key-value store, or URL shortener.");
    addTopic("Review Relational Database optimization: indexing strategies, query execution plans, and normalization.");
    addTopic("Implement a secure Node/Go API endpoint with JWT authentication and middleware validation.");
    addTopic("Revise caching concepts: Redis cache eviction strategies and database write-through logic.");
    addTopic("Study asynchronous background tasks and message brokers (e.g. RabbitMQ or BullMQ).");
    addTopic("Write basic Dockerfiles and practice local docker-compose microservices setups.");
  } else if (category === "fullstack") {
    addTopic("Review Next.js App Router: React Server Components (RSC) and Server Actions data fetching.");
    addTopic("Practice API schema integration: sync database models (Prisma) with frontend forms.");
    addTopic("Design database schema with proper relational keys and draft matching API routes.");
    addTopic("Master state management synchronizing URL state, local React state, and backend database state.");
    addTopic("Practice authenticating fullstack applications: cookies, sessions, and OAuth flows.");
    addTopic("Deploy a multi-container stack or practice Vercel + serverless backend connections.");
  } else {
    addTopic("Practice fundamental Algorithms & Data Structures: arrays, hash maps, sorting, and binary trees.");
    addTopic("Prepare behavioral stories using the STAR method (Situation, Task, Action, Result).");
    addTopic("Review clean coding standards: DRY, SOLID principles, and meaningful nomenclature.");
    addTopic("Review Git operations: branching strategy, resolving merge conflicts, and interactive rebasing.");
    addTopic("Prepare 3 intelligent questions to ask the interviewer regarding engineering culture & scope.");
  }

  return {
    roleTitle,
    seniority,
    seniorityReason,
    confidence,
    summary,
    translatedSummary,
    mustHaves: mustHaves.slice(0, 5),
    niceToHaves: niceToHaves.slice(0, 5),
    redFlags,
    studyChecklist
  };
}
