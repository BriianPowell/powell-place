export type Service = {
  title: string
  text: string
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
  phone: '714.906.9211',
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
    p1: 'I am an Engineer and an unrelenting tinkerer with a passion for solving difficult problems efficiently. My interests tend to lead me towards backend but I have a hard time saying no to a challenge.',
    p2: 'I like to describe myself as a hard working individual who loves to be apart of a team that fosters growth. My strengths come from my experiences, my previous roles, internships, and university, which have given me a strong foundation from which to move forward.',
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
    {
      network: 'Instagram',
      username: 'briianpowell',
      url: 'https://www.instagram.com/briianpowell/',
    },
  ] satisfies SocialProfile[],
  services: [
    {
      title: 'Cloud Enablement',
      text: 'Implementing Terraform, Terragrunt, and AWS CDK to enable high Cloud utilization',
    },
    {
      title: 'CI/CD',
      text: 'Embracing the latest CI/CD patterns and technologies to minimize technological debt',
    },
    {
      title: 'Front End',
      text: 'Designing and deploying SPA frameworks ontop of serverless architectures',
    },
    {
      title: 'Back End',
      text: 'Architecting and constructing highly efficient systems with minimal infrastructural overhead',
    },
  ] satisfies Service[],
  experience: [
    {
      organization: 'Mckinsey & Company',
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
