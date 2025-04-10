import { IResume } from "@schemas/resume.schema";

const exampleResume: IResume = {
  basics: {
    first_name: "Jane",
    last_name: "Doe",
    label: "Front-End Developer",
    email: "jane.doe@email.com",
    phone: "+15551234567",
    url: "https://www.janedoe.com",
    summary:
      "Highly motivated and creative Front-End Developer with 3 years of experience in building and maintaining responsive and user-friendly web applications. Proficient in React, JavaScript, HTML, and CSS. Passionate about clean code, user experience, and continuous learning.",
    location: {
      address: "123 Main Street",
      postalCode: "90210",
      city: "Beverly Hills",
      countryCode: "US",
      region: "CA",
    },
    profiles: [
      {
        network: "LinkedIn",
        username: "janedoe",
        url: "https://www.linkedin.com/in/janedoe",
      },
      {
        network: "GitHub",
        username: "janedoe",
        url: "https://github.com/janedoe",
      },
    ],
  },
  work: [
    {
      name: "Acme Corp",
      position: "Front-End Developer",
      location: "Los Angeles, CA",
      url: "https://www.acmecorp.com",
      startDate: "2021-06-01",
      endDate: "2023-12-20",
      summary:
        "Developed and maintained front-end components for various web applications, ensuring high performance and responsiveness.",
      highlights: [
        "Developed and maintained a React-based e-commerce platform, resulting in a 20% increase in conversion rates.",
        "Implemented responsive design principles, improving user experience across all devices.",
        "Collaborated with back-end developers to integrate APIs and ensure seamless data flow.",
        "Contributed to the development of a company-wide design system, promoting consistency and efficiency.",
      ],
    },
    {
      name: "Beta Industries",
      position: "Junior Front-End Developer",
      location: "Santa Monica, CA",
      url: "https://www.betaindustries.com",
      startDate: "2020-06-01",
      endDate: "2021-06-01",
      summary:
        "Assisted senior developers in building and maintaining web applications.",
      highlights: [
        "Assisted in the development of a new website using HTML, CSS, and JavaScript.",
        "Implemented UI/UX improvements based on user feedback.",
        "Debugged and resolved front-end issues.",
        "Participated in code reviews and team meetings.",
      ],
    },
  ],
  education: [
    {
      institution: "University of California, Los Angeles",
      url: "https://www.ucla.edu",
      area: "Computer Science",
      studyType: "Bachelor of Science",
      startDate: "2016-09-01",
      endDate: "2020-06-01",
      score: 3.8,
      courses: [
        "Data Structures and Algorithms",
        "Web Development",
        "Database Systems",
        "Software Engineering",
      ],
    },
  ],
  skills: [
    {
      name: "JavaScript",
      level: "Advanced",
      keywords: ["ES6+", "React", "Redux", "TypeScript", "Node.js"],
    },
    {
      name: "HTML",
      level: "Advanced",
      keywords: ["HTML5", "Semantic HTML"],
    },
    {
      name: "CSS",
      level: "Advanced",
      keywords: [
        "CSS3",
        "Sass",
        "Less",
        "Responsive Design",
        "Flexbox",
        "Grid",
      ],
    },
    {
      name: "UI/UX Design",
      level: "Intermediate",
      keywords: ["Figma", "Adobe XD"],
    },
    {
      name: "Testing",
      level: "Intermediate",
      keywords: ["Jest", "React Testing Library", "Cypress"],
    },
    {
      name: "Version Control",
      level: "Advanced",
      keywords: ["Git", "GitHub", "GitLab"],
    },
  ],
  languages: [
    {
      language: "English",
      fluency: "Native speaker",
    },
    {
      language: "Spanish",
      fluency: "Conversational",
    },
  ],
  projects: [
    {
      name: "Personal Portfolio Website",
      startDate: "2023-01-01",
      endDate: "2023-02-15",
      description:
        "A personal portfolio website to showcase my skills and projects.",
      highlights: [
        "Designed and developed a responsive portfolio website using React.",
        "Implemented a clean and modern design.",
        "Deployed the website on Netlify.",
      ],
      url: "https://www.janedoe.com",
      keywords: ["React", "JavaScript", "HTML", "CSS", "Netlify"],
    },
  ],
};
export default exampleResume;
