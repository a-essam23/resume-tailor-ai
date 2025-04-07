import { z } from "zod";

// will be used when prompting to ensure perfect output
export const resumeSchemaString = `resume{basics{first_name:string,last_name:string,label:string,image?:string,email:string,phone?:string,url?:string,summary:string,location{address:string,postalCode:string,city:string,countryCode:string,region:string},profiles?:[{network:string,username:string,url:string}]},work?:[{name:string,description?:string,position:string,location?:string,url?:string,startDate:string,endDate?:string,summary?:string,highlights:[string]}],volunteer?:sameaswork],education:{institution:string,url?:string,area:string,studyType:string,startDate:string,endDate?:string,score?:number,courses:string]}],awards?:[{title:string,date:string,awarder:string,summary:string}],certificates?:[{name:string,date:string,issuer:string,url?:string}],publications?:[{name:string,publisher:string,releaseDate:string,url?:string,summary:string}],skills:[{name:string,level:"Beginner"|"Intermediate"|"Advanced"|"Master",keywords:[string]}],languages:[{language:string,fluency:string}],interests?:[{name:string,keywords:string]],references?:[{name:string,reference:string}],projects?:[{name:string,startDate:string,endDate?:string,description:string,highlights:[string],url?:string,keywords?:[string],type?:string,roles?:[string]}]}`;

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const UrlSchema = z.string().url();
const PhoneSchema = z
  .string()
  .regex(
    /(?:(?:\+|00)\d{1,3})?[\s\-]?(?:\(?\d{1,4}\)?[\s\-]?)?(?:\d[\d\-\s]{5,}\d)/g
  );

const LocationSchema = z.object({
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  countryCode: z.string().length(2),
  region: z.string(),
});

const ProfileSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: UrlSchema,
});

const BasicsSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  label: z.string(),
  image: z.string().optional(),
  email: z.string().email(),
  phone: PhoneSchema.optional(),
  url: UrlSchema.optional(),
  summary: z.string(),
  location: LocationSchema,
  profiles: z.array(ProfileSchema).optional(),
});

const WorkExperienceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  position: z.string(),
  location: z.string().optional(),
  url: UrlSchema.optional(),
  startDate: DateSchema,
  endDate: DateSchema.optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()),
});

const EducationSchema = z.object({
  institution: z.string(),
  url: UrlSchema.optional(),
  area: z.string(),
  studyType: z.string(),
  startDate: DateSchema,
  endDate: DateSchema.optional(),
  score: z.number().min(0).max(4).optional(),
  courses: z.array(z.string()),
});

const AwardSchema = z.object({
  title: z.string(),
  date: DateSchema,
  awarder: z.string(),
  summary: z.string(),
});

const CertificateSchema = z.object({
  name: z.string(),
  date: DateSchema,
  issuer: z.string(),
  url: UrlSchema.optional(),
});

const PublicationSchema = z.object({
  name: z.string(),
  publisher: z.string(),
  releaseDate: DateSchema,
  url: UrlSchema.optional(),
  summary: z.string(),
});

const SkillSchema = z.object({
  name: z.string(),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Master"]),
  keywords: z.array(z.string()),
});

const LanguageSchema = z.object({
  language: z.string(),
  fluency: z.string(),
});

const ProjectSchema = z.object({
  name: z.string(),
  startDate: DateSchema,
  endDate: DateSchema.optional(),
  description: z.string(),
  highlights: z.array(z.string()),
  url: UrlSchema.optional(),
  keywords: z.array(z.string()).optional(),
  type: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

const InterestSchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()),
});

const ReferenceSchema = z.object({
  name: z.string(),
  reference: z.string(),
});

// Main resume schema
export const ResumeSchema = z.object({
  basics: BasicsSchema,
  work: z.array(WorkExperienceSchema).optional(),
  volunteer: z.array(WorkExperienceSchema).optional(),
  education: z.array(EducationSchema),
  awards: z.array(AwardSchema).optional(),
  certificates: z.array(CertificateSchema).optional(),
  publications: z.array(PublicationSchema).optional(),
  skills: z.array(SkillSchema),
  languages: z.array(LanguageSchema),
  interests: z.array(InterestSchema).optional(),
  references: z.array(ReferenceSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
});

export type IResume = z.infer<typeof ResumeSchema>;
