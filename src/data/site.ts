export type Service = {
  title: string
  text: string
  icon: string
  accent: string
  wash: string
}

export type TimelineEntry = {
  organization: string
  duration: string
  title: string
  bullets: string[]
}

export type Certificate = {
  title: string
  organization: string
  link: string
  status: string
}

export type SocialProfile = {
  network: string
  username: string
  url: string
}

export const site = {
  name: 'Brian Powell',
  label: 'Software Engineer',
  description:
    'Brian Powell is a software engineer in Huntington Beach, California focused on backend systems, cloud enablement, CI/CD, and frontend architecture.',
  email: 'ships-nucleus8o@icloud.com',
  sign: 'Scorpio',
  location: 'Huntington Beach, California',
  website: {
    url: 'https://powell.place',
    pretty: 'powell.place',
  },
  map: {
    lat: 33.660057,
    lng: -117.99897,
    label: 'Huntington Beach, CA',
  },
  bio: {
    p1: 'I am an engineer who enjoys designing and building reliable systems, developer-friendly platforms, and automation that helps teams move faster together.',
    p2: 'I spend a lot of time working across cloud infrastructure, Kubernetes, platform engineering, and software delivery. Lately, I have been exploring practical AI workflows that help engineers work more effectively, improve application resilience, and reduce time-to-market.',
  },
  profiles: [
    {
      network: 'GitHub',
      username: 'BriianPowell',
      url: 'https://github.com/BriianPowell',
    },
    {
      network: 'LinkedIn',
      username: 'briianpowell',
      url: 'https://www.linkedin.com/in/briianpowell/',
    },
  ] satisfies SocialProfile[],
  services: [
    {
      title: 'Application & Platform Engineering',
      text: 'Building end-to-end systems that connect product needs, platform capabilities, and reliable delivery.',
      icon: '/icons/focus-platform.png',
      accent: '#000080',
      wash: 'rgba(0, 0, 128, 0.08)',
    },
    {
      title: 'Kubernetes & Cloud Native',
      text: 'Working with containers, Kubernetes, and cloud infrastructure to run services cleanly and consistently.',
      icon: '/icons/focus-cloud.png',
      accent: '#008080',
      wash: 'rgba(0, 128, 128, 0.1)',
    },
    {
      title: 'Developer Experience',
      text: 'Creating automation, workflows, and internal tooling that make engineering teams more effective.',
      icon: '/icons/focus-devex.png',
      accent: '#806000',
      wash: 'rgba(128, 96, 0, 0.12)',
    },
    {
      title: 'Software Delivery',
      text: 'Improving CI/CD, infrastructure-as-code, and release patterns to reduce friction and technical debt.',
      icon: '/icons/focus-delivery.png',
      accent: '#800080',
      wash: 'rgba(128, 0, 128, 0.08)',
    },
    {
      title: 'Practical AI Workflows',
      text: 'Exploring AI-assisted engineering workflows that improve delivery, operations, and code quality.',
      icon: '/icons/focus-ai.png',
      accent: '#008000',
      wash: 'rgba(0, 128, 0, 0.08)',
    },
    {
      title: 'Resilient Architecture',
      text: 'Designing backend and distributed systems with reliability, security, and operability in mind.',
      icon: '/icons/focus-resilience.png',
      accent: '#800000',
      wash: 'rgba(128, 0, 0, 0.08)',
    },
  ] satisfies Service[],
  experience: [
    {
      organization: 'McKinsey & Company',
      duration: '2024 - Present',
      title: 'Senior Engineer I',
      bullets: [],
    },
    {
      organization: 'McKinsey & Company',
      duration: '2022 - 2024',
      title: 'Engineer II, Cloud',
      bullets: [],
    },
    {
      organization: 'First American Financial Corporation',
      duration: '2019 - 2022',
      title: 'Software Engineer',
      bullets: [
        'Developed and deployed a C# SDK for internal applications to seamlessly integrate with backend APIs hosted on AWS API Gateway',
        'Contributed to several applications (C#, Python, JavaScript) to successfully modernize them from on-premises to serverless AWS',
        'Utilized AWS offerings effectively (API Gateway, S3, CloudFront, DocumentDB, RDS, Lambda, etc.)',
        'Incorporated Terraform/Terragrunt with CI/CD pipelines for fast delivery of updates',
      ],
    },
  ] satisfies TimelineEntry[],
  education: [
    {
      organization: 'California State University, Long Beach',
      duration: '2016 - 2018',
      title: 'Bachelor of Science (BS), Computer Science',
      bullets: [
        'Activities and Societies: Sigma Chi Fraternity',
        "Graduated with a Bachelor's Degree in Computer Science with a 3.0 GPA",
      ],
    },
    {
      organization: 'Santiago Canyon College',
      duration: '2013 - 2016',
      title: 'Associate of Science (AS) for Transfer, Physics, Mathematics',
      bullets: [
        'Activities and Societies: Indoor and outdoor intramural soccer, (Stem)²',
        'Graduated with a 3.1 GPA',
      ],
    },
  ] satisfies TimelineEntry[],
  certificates: [
    {
      title: 'Solutions Architect - Associate',
      organization: 'Amazon Web Services (AWS)',
      link: 'https://www.credly.com/badges/1861a356-44d4-47ea-9276-f41af470d87c',
      status: 'Expired',
    },
  ] satisfies Certificate[],
} as const

export type TabId = 'about' | 'resume' | 'blog' | 'contact'

export const tabs: { id: TabId; label: string; path: string }[] = [
  { id: 'about', label: 'About', path: '/about' },
  { id: 'resume', label: 'Resume', path: '/resume' },
  { id: 'blog', label: 'Blog', path: '/blog' },
  { id: 'contact', label: 'Contact', path: '/contact' },
]
