# SocietySphere — TIET Edition
### Official Student Communities Platform for Thapar Institute of Engineering & Technology (TIET), Patiala

**Tagline:** Discover your people. Find your community.

SocietySphere — TIET Edition is a modern centralized web application designed for students of **Thapar Institute of Engineering & Technology, Patiala, Punjab, India**. It unifies 40+ official societies, clubs, student chapters, and administrative cells, campus event calendars (HackTU, Makeathon, Mudra Night, Saturnalia), and core team recruitment drives into a single intuitive platform.

---

## 🌟 Key Features

### 1. Authentic TIET Student Directory
- **Strict Charter Designation:** Preserves the official status of every organization according to the [TIET Student Activities Directory](https://studentsocieties.thapar.edu/):
  - **Societies:** Creative Computing Society (CCS), Music and Dramatic Society (MUDRA), Literary Society (LitSoc), MARS Robotics, EDC, ENACTUS, LUG, TUMUN, TAAS, SOMIE, TSCE, CARE, TMS, GENE, PWS, Pratigya, SPIC MACAY, MAPS, GirlUpTIET, LEAD.
  - **Clubs:** Dance Club NOX, Developer Student Club (DSC), Economics Club, Thapar Movie Club (TMC), TU Toastmasters, TIET Fitness Club, Adventure Club, Echoes, EBSB, Gender Champions, Youth Welfare Club.
  - **Student Chapters:** MLSC, OWASP Student Chapter, ACM Computing, TEDx TIET, Rotaract Club, SAE (Team Fateh), AIESEC, AIChE, ASHRAE, IETE, IET, IEI, IICHE, ISTE, Youth United.
  - **Cells & Units:** Thapar Institute Counselling Cell (TICC), Student Alumni Interaction Cell (SAIC), National Service Scheme (NSS), National Cadet Corps (NCC).
- **Organization Type Filters:** Live filters for `Society`, `Club`, `Student Chapter`, `Cell`, and `Unit`.
- **TIET Domains:** Filter by `Technical / Academic`, `Cultural / Visual Arts`, `Entrepreneurship`, `Social Impact`, `Debate / Literary`, `Sports / Fitness`, and `Special Interest`.
- **Data Integrity:** Official verified contact links; unverified personal phone numbers or names are never fabricated and cleanly display *"Information not available"*.

### 2. Events Hub & Campus QR Tickets
- **Flagship Campus Events:** HackTU 6.0, Mudra Acoustic Night & Nukkad Natak, HackOWASP CTF, TEDxTIET, Thapar E-Summit, and RoboClash.
- **Campus Venues:** COS Complex, TAN Building, Main Auditorium, Central Library, and STEP Incubation Center.
- **Dual View:** Responsive card grid and interactive monthly calendar view.
- **Digital Event Passes:** 1-click RSVP with instant generation of scannable QR admission tickets.

### 3. Recruitment Portal & Status Stepper
- **Active Induction Drives:** Real-time application countdowns for CCS, MLSC, MUDRA, OWASP, EDC, and NOX.
- **Multi-step Application:** Multi-stage application modal capturing branch, year, portfolio, and domain questions.
- **5-Stage Visual Status Stepper:**
  $$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Shortlisted} \longrightarrow \text{Interview Scheduled} \longrightarrow \text{Selected / Not Selected}$$
- **Duplicate Prevention & Withdrawal:** Enforces single active application per organization with withdrawal support.

### 4. Branch-Smart Recommendations
- **Personalized for TIET Branches:** Curated for Computer Engineering (COE), Computer Science & Business Systems (CSBS), Electronics & Communication (ECE), Mechanical (ME), Civil (CIE), Chemical (CHE), Biotechnology (BT), etc.
- **Matching Algorithm:** Calculates alignment percentages based on engineering branch, technical skills, and creative interests.

### 5. Society Admin Dashboard
- **Admin Overview:** High-level KPI summary cards (*Followers*, *Event RSVPs*, *Applications Received*, *Acceptance Ratio*).
- **Interactive Recharts Analytics:** Visual charts for registration trends, department application breakdown, and applicant funnel status.
- **Candidate Evaluation Board:** Filter applicants by status and department, schedule interview dates/venues, and log admin review feedback.
- **Event & Notice Management:** Full CRUD controls for creating workshops and broadcasting official announcements.

---

## 💻 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (dark navy/charcoal foundation with violet, electric blue, and cyan accents)
- **Routing:** React Router DOM v7
- **Icons:** Lucide React + custom SVG brand icons
- **Data Visualizations:** Recharts
- **Storage:** LocalStorage persistence with seeded TIET datasets

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/manasmittal-21/societysphere.git
cd societysphere
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```
