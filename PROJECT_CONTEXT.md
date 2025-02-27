# EMR Onboarding System - Project Context

## Application Overview
This application automates the setup of aesthetic clinics in an EMR system by extracting data from websites and documents, structuring it into JSON, and guiding users through an 8-step onboarding process.

## Key Components
1. **Data Extraction Layer**: Scraping clinic websites and processing documents
2. **JSON Structuring**: Organizing data according to a predefined schema
3. **Multi-Step Onboarding UI**: 8-step process with sidebar navigation
4. **Form Management**: Pre-filled, editable forms for each step
5. **API Integration**: Step-specific APIs for saving data

## Onboarding Steps (Schema Structure)
1. **Business Information**
   - Business name, address details, website, business hours
   - Logo URL, owner details, contact information

2. **Clinic Locations**
   - Name, address, contact information for multiple branches
   - Notification settings, online booking preferences, tip settings

3. **Staff Information**
   - Personal details: name, email, phone
   - Role: provider, admin, front desk, medical director
   - Settings: tips, booking availability, medical director requirements
   - Schedule: weekly availability with shifts
   - Profile: photo URL, bio, assigned locations

4. **Services**
   - Service category and name
   - Type (virtual/in-person) and duration
   - Provider and clinic availability
   - Booking settings, description
   - Payment details: deposit amount, card capture
   - Service incompatibilities

5. **Equipment**
   - Name, assigned clinic
   - Schedule, required services
   - Cleanup time

6. **Resources**
   - Name, clinic, type
   - Schedule, required services

7. **Inventory**
   - Category, product name
   - Pricing: cost, regular price, member price
   - Tax, units, description

8. **Packages & Memberships**
   - Packages:
     - Discount details: name, type, percentage/amount
     - Pricing: package price, member price
     - Applicability: product selection, customer availability
     - Availability: online portal, locations, providers
     - Dates: start and end date, description
   - Memberships:
     - Name, discount percentage
     - Payment options: monthly, yearly, both
     - Fees: setup, monthly, yearly
     - Settings: agreement, wallet, portal visibility
     - Benefits: discounts, free items, description

## UI Structure
- **Sidebar**: Navigation between the 8 steps
- **Form Area**: Pre-populated form for current step
- **Save Process**: Triggers step-specific API, updates JSON context

## Data Flow
1. Extract data from clinic website/documents
2. Structure into JSON object
3. Pre-fill forms for each step
4. Allow user edits
5. Save via API for each step
6. Complete when all 8 steps are processed

## Technical Requirements

### Previous Tech Stack
- **Frontend Framework**: React
- **TypeScript**: For type safety
- **Build Tool**: Vite
- **State Management**: React Context and useReducer
- **Styling**: Tailwind CSS
- **Form Management**: Formik
- **Validation**: Yup
- **Icons**: Lucide React
- **API Integration**: Supabase
- **Linting**: ESLint with TypeScript and React plugins

### New Tech Stack (Improvements)
- **Framework**: Next.js with App Router (server components, API routes, file-based routing)
- **TypeScript**: Enhanced type safety with stricter configurations
- **Build & Dev**: Next.js built-in tooling (replacing Vite)
- **State Management**: React Context and useReducer (maintained)
- **Styling**: Tailwind CSS with Shadcn UI components
- **Form Management**: React Hook Form (replacing Formik for better performance)
- **Validation**: Zod (replacing Yup for better TypeScript integration)
- **Icons**: Lucide React (maintained)
- **API Integration**: Next.js API Routes (replacing Supabase edge functions)
- **Server-Side Operations**: Server Components & Server Actions
- **Authentication**: NextAuth.js or Auth.js
- **Linting**: ESLint with Next.js configuration

## Development Optimizations
- Type-safe API routes with input/output schemas
- Progressive enhancement with server/client components
- Caching and revalidation strategies
- Incremental Static Regeneration for performance
- Component composition for reusability
- Strict TypeScript checks to prevent runtime errors 