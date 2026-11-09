import { Ambulance, Building2, HeartHandshake, Home, Microscope, Stethoscope, type LucideIcon } from 'lucide-react'
import { unsplash } from '@/components/SmartImage'

export type CategoryId = 'clinic' | 'hospital' | 'boarding' | 'diagnostics' | 'ambulance' | 'ngo'
export type Species = 'Dogs' | 'Cats' | 'Birds' | 'Rabbits' | 'Exotics' | 'Livestock'

export interface Category {
  id: CategoryId
  label: string
  short: string
  description: string
  icon: LucideIcon
}

export interface Provider {
  id: string
  name: string
  category: CategoryId
  city: string
  area: string
  address: string
  image: string
  rating: number
  reviews: number
  services: string[]
  species: Species[]
  open24x7: boolean
  emergency: boolean
  verified: boolean
  hours: string
  closesAt?: string
  feeFrom?: number
  distanceKm: number
  addedDaysAgo: number
  phone: string
  about: string
}

export const CATEGORIES: Category[] = [
  { id: 'clinic', label: 'Veterinary Clinics', short: 'Find a Vet', description: 'Consultations, vaccinations and routine care', icon: Stethoscope },
  { id: 'hospital', label: 'Animal Hospitals', short: 'Hospitals', description: 'Surgery, ICU and inpatient care', icon: Building2 },
  { id: 'boarding', label: 'Pet Boarding', short: 'Boarding', description: 'Supervised stays, daycare and grooming', icon: Home },
  { id: 'diagnostics', label: 'Diagnostics', short: 'Diagnostics', description: 'Lab tests, X-ray, ultrasound and imaging', icon: Microscope },
  { id: 'ambulance', label: 'Ambulance', short: 'Ambulance', description: 'Emergency pickup and transport', icon: Ambulance },
  { id: 'ngo', label: 'NGOs & Shelters', short: 'NGOs', description: 'Rescue, adoption and community care', icon: HeartHandshake },
]

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!

export const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'] as const

export const SPECIES: Species[] = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Exotics', 'Livestock']

const img = (id: string) => unsplash(id, 800, 600)

/** Sample providers. Every name, address and number is fictional. */
export const PROVIDERS: Provider[] = [
  {
    id: 'greenleaf-vet-indiranagar',
    name: 'Greenleaf Veterinary Clinic',
    category: 'clinic', city: 'Bengaluru', area: 'Indiranagar',
    address: '14, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    image: img('1628009368231-7bb7cfcb0def'),
    rating: 4.8, reviews: 412,
    services: ['Consultation', 'Vaccination', 'Dental care', 'Microchipping'],
    species: ['Dogs', 'Cats', 'Rabbits'],
    open24x7: false, emergency: false, verified: true,
    hours: 'Mon–Sat · 9:00 AM – 9:00 PM', closesAt: '9 PM', feeFrom: 600,
    distanceKm: 1.2, addedDaysAgo: 210, phone: '+91 80 4000 1201',
    about: 'A neighbourhood practice focused on preventive care, with separate waiting areas for dogs and cats and a calm, low-stress exam room.',
  },
  {
    id: 'pawsitive-pet-hospital-hsr',
    name: 'Pawsitive 24×7 Pet Hospital',
    category: 'hospital', city: 'Bengaluru', area: 'HSR Layout',
    address: '221, 27th Main, Sector 1, HSR Layout, Bengaluru 560102',
    image: img('1629909613654-28e377c37b09'),
    rating: 4.7, reviews: 986,
    services: ['Emergency care', 'Surgery', 'ICU', 'X-ray', 'Ultrasound'],
    species: ['Dogs', 'Cats', 'Birds', 'Exotics'],
    open24x7: true, emergency: true, verified: true,
    hours: 'Open 24 hours, all days', feeFrom: 900,
    distanceKm: 3.8, addedDaysAgo: 340, phone: '+91 80 4000 2402',
    about: 'Multi-specialty hospital with round-the-clock emergency vets, in-house imaging and a monitored ICU ward.',
  },
  {
    id: 'whiskers-wagging-boarding-whitefield',
    name: 'Whiskers & Wagging Boarding',
    category: 'boarding', city: 'Bengaluru', area: 'Whitefield',
    address: '8, Siddapura Road, Whitefield, Bengaluru 560066',
    image: img('1581888227599-779811939961'),
    rating: 4.6, reviews: 238,
    services: ['Overnight boarding', 'Daycare', 'Grooming', 'Live camera'],
    species: ['Dogs', 'Cats'],
    open24x7: true, emergency: false, verified: true,
    hours: 'Check-in 8:00 AM – 8:00 PM', feeFrom: 850,
    distanceKm: 9.4, addedDaysAgo: 12, phone: '+91 80 4000 3303',
    about: 'Cage-free boarding with separate cat suites, twice-daily updates and an on-call vet partnership.',
  },
  {
    id: 'clearview-diagnostics-koramangala',
    name: 'ClearView Animal Diagnostics',
    category: 'diagnostics', city: 'Bengaluru', area: 'Koramangala',
    address: '62, 80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    image: img('1516734212186-a967f81ad0d7'),
    rating: 4.5, reviews: 157,
    services: ['Blood tests', 'Digital X-ray', 'Ultrasound', 'Home sample pickup'],
    species: ['Dogs', 'Cats', 'Birds'],
    open24x7: false, emergency: false, verified: true,
    hours: 'All days · 8:00 AM – 8:00 PM', closesAt: '8 PM', feeFrom: 450,
    distanceKm: 2.6, addedDaysAgo: 6, phone: '+91 80 4000 4404',
    about: 'Referral diagnostics lab. Reports are shared digitally with your vet, usually the same day.',
  },
  {
    id: 'rapid-paws-ambulance-blr',
    name: 'RapidPaws Animal Ambulance',
    category: 'ambulance', city: 'Bengaluru', area: 'City-wide',
    address: 'Dispatch hub: Domlur, Bengaluru 560071',
    image: img('1530281700549-e82e7bf110d6'),
    rating: 4.6, reviews: 301,
    services: ['Emergency pickup', 'Stretcher transport', 'Oxygen support', 'Hospital transfer'],
    species: ['Dogs', 'Cats', 'Livestock'],
    open24x7: true, emergency: true, verified: true,
    hours: 'Dispatch 24 hours', feeFrom: 1200,
    distanceKm: 0, addedDaysAgo: 95, phone: '+91 80 4000 5505',
    about: 'Equipped ambulance vans with trained handlers, coordinating directly with partner emergency hospitals.',
  },
  {
    id: 'second-chance-shelter-jp-nagar',
    name: 'Second Chance Animal Shelter',
    category: 'ngo', city: 'Bengaluru', area: 'JP Nagar',
    address: 'Survey 41, Puttenahalli Road, JP Nagar 7th Phase, Bengaluru 560078',
    image: img('1477884213360-7e9d7dcc1e48'),
    rating: 4.9, reviews: 520,
    services: ['Rescue', 'Adoption', 'Sterilisation drives', 'Volunteering'],
    species: ['Dogs', 'Cats'],
    open24x7: false, emergency: true, verified: true,
    hours: 'Visits 10:00 AM – 5:00 PM · Rescue line 24h',
    distanceKm: 6.1, addedDaysAgo: 400, phone: '+91 80 4000 6606',
    about: 'Volunteer-run shelter that rescues and rehabilitates community animals and finds them permanent homes.',
  },
  {
    id: 'bandra-pet-clinic',
    name: 'Seaside Pet Clinic',
    category: 'clinic', city: 'Mumbai', area: 'Bandra West',
    address: '3, Hill Road, near St. Peter’s Church, Bandra West, Mumbai 400050',
    image: img('1596272875729-ed2ff7d6d9c5'),
    rating: 4.7, reviews: 644,
    services: ['Consultation', 'Vaccination', 'Feline care', 'Nutrition advice'],
    species: ['Dogs', 'Cats'],
    open24x7: false, emergency: false, verified: true,
    hours: 'Mon–Sun · 10:00 AM – 9:30 PM', closesAt: '9:30 PM', feeFrom: 800,
    distanceKm: 1.9, addedDaysAgo: 160, phone: '+91 22 4000 7707',
    about: 'Cat-friendly certified practice with appointment-only feline hours every morning.',
  },
  {
    id: 'andheri-animal-hospital',
    name: 'Western Suburbs Animal Hospital',
    category: 'hospital', city: 'Mumbai', area: 'Andheri East',
    address: '17, MIDC Central Road, Andheri East, Mumbai 400093',
    image: img('1583337130417-3346a1be7dee'),
    rating: 4.4, reviews: 1120,
    services: ['Emergency care', 'Orthopaedics', 'Surgery', 'Physiotherapy'],
    species: ['Dogs', 'Cats', 'Birds'],
    open24x7: true, emergency: true, verified: true,
    hours: 'Open 24 hours, all days', feeFrom: 1000,
    distanceKm: 5.2, addedDaysAgo: 30, phone: '+91 22 4000 8808',
    about: 'Large referral hospital with orthopaedic and rehab specialists and a 24-hour emergency desk.',
  },
  {
    id: 'mumbai-bird-care',
    name: 'Feathers & Friends Avian Care',
    category: 'clinic', city: 'Mumbai', area: 'Dadar',
    address: '45, Gokhale Road, Dadar West, Mumbai 400028',
    image: img('1535241749838-299277b6305f'),
    rating: 4.6, reviews: 189,
    services: ['Avian medicine', 'Exotic pets', 'Wing & nail care', 'Consultation'],
    species: ['Birds', 'Rabbits', 'Exotics'],
    open24x7: false, emergency: false, verified: false,
    hours: 'Tue–Sun · 11:00 AM – 7:00 PM', closesAt: '7 PM', feeFrom: 700,
    distanceKm: 4.3, addedDaysAgo: 3, phone: '+91 22 4000 9909',
    about: 'One of the few practices focused on birds, rabbits and small exotic companions.',
  },
  {
    id: 'delhi-vet-hauz-khas',
    name: 'Capital Companion Vets',
    category: 'clinic', city: 'Delhi', area: 'Hauz Khas',
    address: 'C-12, Hauz Khas Market, New Delhi 110016',
    image: img('1543466835-00a7907e9de1'),
    rating: 4.6, reviews: 503,
    services: ['Consultation', 'Vaccination', 'Dermatology', 'Senior pet care'],
    species: ['Dogs', 'Cats'],
    open24x7: false, emergency: false, verified: true,
    hours: 'Mon–Sat · 9:30 AM – 8:30 PM', closesAt: '8:30 PM', feeFrom: 700,
    distanceKm: 2.1, addedDaysAgo: 75, phone: '+91 11 4000 1110',
    about: 'Family practice with a dermatology clinic and senior-pet wellness plans.',
  },
  {
    id: 'delhi-rescue-foundation',
    name: 'Yamuna Paws Rescue Foundation',
    category: 'ngo', city: 'Delhi', area: 'Mayur Vihar',
    address: 'Plot 9, Mayur Vihar Phase 1 Extension, Delhi 110091',
    image: img('1570018144715-43110363d70a'),
    rating: 4.8, reviews: 342,
    services: ['Street animal rescue', 'Adoption', 'Feeding programmes', 'First aid'],
    species: ['Dogs', 'Cats', 'Birds', 'Livestock'],
    open24x7: false, emergency: true, verified: true,
    hours: 'Rescue helpline 24h · Adoption days Sat–Sun',
    distanceKm: 7.8, addedDaysAgo: 20, phone: '+91 11 4000 1212',
    about: 'Community rescue network covering East Delhi, running sterilisation drives and weekend adoption camps.',
  },
  {
    id: 'pune-diagnostics',
    name: 'Deccan Pet Imaging & Lab',
    category: 'diagnostics', city: 'Pune', area: 'Kothrud',
    address: '28, Karve Road, Kothrud, Pune 411038',
    image: img('1561037404-61cd46aa615b'),
    rating: 4.5, reviews: 211,
    services: ['CT scan', 'Ultrasound', 'Pathology', 'Cardiac screening'],
    species: ['Dogs', 'Cats', 'Exotics'],
    open24x7: false, emergency: false, verified: true,
    hours: 'Mon–Sat · 8:00 AM – 9:00 PM', closesAt: '9 PM', feeFrom: 500,
    distanceKm: 3.4, addedDaysAgo: 9, phone: '+91 20 4000 1313',
    about: 'Imaging centre with CT and echocardiography, taking referrals from clinics across Pune.',
  },
  {
    id: 'pune-boarding',
    name: 'Sahyadri Pet Retreat',
    category: 'boarding', city: 'Pune', area: 'Baner',
    address: 'Lane 5, Baner–Pashan Link Road, Pune 411045',
    image: img('1548199973-03cce0bbc87b'),
    rating: 4.7, reviews: 176,
    services: ['Farm-style boarding', 'Daycare', 'Training', 'Pick-up & drop'],
    species: ['Dogs'],
    open24x7: true, emergency: false, verified: false,
    hours: 'Check-in 7:00 AM – 9:00 PM', feeFrom: 950,
    distanceKm: 6.6, addedDaysAgo: 2, phone: '+91 20 4000 1414',
    about: 'Open-air boarding with large play yards, small group sizes and daily photo updates.',
  },
  {
    id: 'hyd-hospital',
    name: 'Banjara Hills Veterinary Hospital',
    category: 'hospital', city: 'Hyderabad', area: 'Banjara Hills',
    address: 'Road No. 10, Banjara Hills, Hyderabad 500034',
    image: img('1558788353-f76d92427f16'),
    rating: 4.6, reviews: 731,
    services: ['Emergency care', 'Surgery', 'Oncology', 'Dialysis'],
    species: ['Dogs', 'Cats'],
    open24x7: true, emergency: true, verified: true,
    hours: 'Open 24 hours, all days', feeFrom: 900,
    distanceKm: 4.0, addedDaysAgo: 120, phone: '+91 40 4000 1515',
    about: 'Advanced-care hospital with oncology and dialysis units and specialist surgeons on call.',
  },
  {
    id: 'hyd-ambulance',
    name: 'Deccan Animal Ambulance Network',
    category: 'ambulance', city: 'Hyderabad', area: 'City-wide',
    address: 'Dispatch hub: Madhapur, Hyderabad 500081',
    image: img('1544568100-847a948585b9'),
    rating: 4.4, reviews: 98,
    services: ['Emergency pickup', 'Large animal transport', 'Hospital transfer'],
    species: ['Dogs', 'Cats', 'Livestock'],
    open24x7: true, emergency: true, verified: false,
    hours: 'Dispatch 24 hours', feeFrom: 1000,
    distanceKm: 0, addedDaysAgo: 4, phone: '+91 40 4000 1616',
    about: 'Ambulance network that also handles large-animal and cattle transport on the city outskirts.',
  },
  {
    id: 'chennai-clinic',
    name: 'Marina Pet Care Clinic',
    category: 'clinic', city: 'Chennai', area: 'Adyar',
    address: '11, LB Road, Adyar, Chennai 600020',
    image: img('1587300003388-59208cc962cb'),
    rating: 4.5, reviews: 287,
    services: ['Consultation', 'Vaccination', 'Deworming', 'Home visits'],
    species: ['Dogs', 'Cats', 'Rabbits'],
    open24x7: false, emergency: false, verified: true,
    hours: 'Mon–Sat · 9:00 AM – 8:00 PM', closesAt: '8 PM', feeFrom: 500,
    distanceKm: 2.8, addedDaysAgo: 45, phone: '+91 44 4000 1717',
    about: 'Practice offering home visits for anxious or senior pets across South Chennai.',
  },
  {
    id: 'chennai-shelter',
    name: 'Coromandel Animal Welfare Trust',
    category: 'ngo', city: 'Chennai', area: 'Velachery',
    address: '7, Taramani Link Road, Velachery, Chennai 600042',
    image: img('1450778869180-41d0601e046e'),
    rating: 4.7, reviews: 204,
    services: ['Rescue', 'Adoption', 'Cattle rehabilitation', 'Volunteering'],
    species: ['Dogs', 'Cats', 'Livestock'],
    open24x7: false, emergency: true, verified: true,
    hours: 'Visits 9:00 AM – 4:00 PM · Rescue line 24h',
    distanceKm: 5.5, addedDaysAgo: 15, phone: '+91 44 4000 1818',
    about: 'Shelter and sanctuary rehabilitating rescued dogs, cats and cattle.',
  },
  {
    id: 'mumbai-boarding',
    name: 'Powai Pet Hotel',
    category: 'boarding', city: 'Mumbai', area: 'Powai',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    image: img('1494256997604-768d1f608cac'),
    rating: 4.3, reviews: 143,
    services: ['Boarding', 'Cat suites', 'Grooming', 'Daycare'],
    species: ['Dogs', 'Cats'],
    open24x7: true, emergency: false, verified: true,
    hours: 'Check-in 8:00 AM – 10:00 PM', feeFrom: 1100,
    distanceKm: 3.1, addedDaysAgo: 60, phone: '+91 22 4000 1919',
    about: 'Climate-controlled pet hotel with dedicated quiet cat suites and on-site groomers.',
  },
]

export const providerById = (id: string) => PROVIDERS.find((p) => p.id === id)
