# tickEasy - Your Event, Our Responsibility

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://event-grid-2-0.vercel.app)
[![Flutter App](https://img.shields.io/badge/Flutter-Check%20App-blue)](https://github.com/minhaj47/tick_easy_check_easy_2_0)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive event ticketing and management platform designed to handle real-world events with enterprise-level performance. Successfully processed 1000+ attendees in 1-1.5 hours with 100% success rate across multiple live events.

## 🌟 Live Demo

**Platform:** [https://event-grid-2-0.vercel.app](https://event-grid-2-0.vercel.app)

### Demo Credentials
```
User Account:
Email: [DEMO_USER_EMAIL]
Password: [DEMO_USER_PASSWORD]

Organization Account:
Email: [DEMO_ORG_EMAIL]
Password: [DEMO_ORG_PASSWORD]
```

## 🚀 Key Features

### For Event Attendees
- **Instant Booking**: Purchase tickets without registration
- **Multiple Payment Methods**: bKash, Nagad, Upay, Visa, Mastercard support
- **Instant Delivery**: Tickets via email or WhatsApp
- **Tickipass**: QR code-based mobile ticket access
- **User Dashboard**: Manage all purchased tickets

### For Event Organizers
- **Event Creation & Management**: Full control over event details
- **Real-time Analytics**: Sales reports and attendance tracking
- **Efficient Check-in**: Integrated scanning system
- **Organization Dashboard**: Comprehensive event oversight
- **Attendee Management**: Complete participant tracking

### Technical Highlights
- **High Performance**: Optimized for 1000+ concurrent users
- **Database Connection Pooling**: Efficient resource management
- **JWT Authentication**: Secure user sessions
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live event data synchronization

## 🏗️ Tech Stack

### Frontend
- **Next.js** (TypeScript)
- **React** with modern hooks
- **Responsive Design** (Mobile-first)

### Backend
- **Node.js** (TypeScript)
- **Express.js** REST API
- **JWT** Authentication
- **BCrypt** Password hashing

### Database & ORM
- **Neon Postgres** (Cloud database)
- **Prisma ORM** (Type-safe database access)
- **Connection Pooling** (Performance optimization)

### Deployment & DevOps
- **Vercel** (Frontend deployment)
- **Render** (Backend deployment)
- **Git Branching** (Version control strategy)

### Mobile Integration
- **Flutter Check App**: [tick_easy_check_easy_2_0](https://github.com/minhaj47/tick_easy_check_easy_2_0)

## 📊 Real-World Impact

### Performance Metrics
- **Events Handled**: 2+ major events
- **Total Attendees**: 1000-1200 participants
- **Processing Time**: 1-1.5 hours per event
- **Success Rate**: 100%
- **Manual Alternative**: Impossible at this scale

### Problem Solved
Traditional manual event management becomes impossible at scale. tickEasy transforms chaotic event check-ins into streamlined, efficient processes, saving organizers countless hours while providing attendees with a seamless experience.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Git

### Environment Variables
Create `.env` files in both frontend and backend directories:

#### Backend (.env)
```env
DATABASE_URL="your_neon_postgres_connection_string"
JWT_SECRET="your_jwt_secret"
BCRYPT_ROUNDS=12
PORT=5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="your_backend_url"
NEXT_PUBLIC_APP_URL="your_frontend_url"
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [YOUR_REPO_URL]
   cd tickeasy
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🏗️ Repository Structure

```
tickeasy/
├── backend/          # Node.js + Express API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/         # Next.js Application
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

> **Note**: Migration to monorepo structure is planned to leverage shared TypeScript types and improved development workflow.

## 📱 Mobile Check-in App

The companion Flutter application handles on-site ticket verification and check-in processes.

**Repository**: [tick_easy_check_easy_2_0](https://github.com/minhaj47/tick_easy_check_easy_2_0)

## 🔄 Development Workflow

- **Branching Strategy**: Feature-based Git branching
- **Code Quality**: TypeScript for type safety
- **Database**: Prisma for type-safe database operations
- **Authentication**: JWT-based secure sessions

## 🚀 Future Roadmap

- [ ] **Monorepo Migration**: Consolidate codebase for better type sharing
- [ ] **Payment Gateway Integration**: Complete payment processing implementation
- [ ] **Email Service Integration**: Automated notification system
- [ ] **Advanced Analytics**: Enhanced reporting capabilities
- [ ] **Mobile App Integration**: Deeper Flutter app connectivity

## 🎯 Business Model

tickEasy operates as a professional event management solution, supporting quality events and organizations. The platform is actively maintained and scaled based on real-world usage and user feedback.

## 👨‍💻 Solo Development

This entire platform was conceptualized, designed, and built by a single developer, including:
- **System Architecture Design**
- **Database Schema Design**
- **Full-stack Development**
- **UI/UX Design**
- **Logo and Branding**
- **Testing and Quality Assurance**
- **User Feedback Integration**
- **Production Deployment**

## 🤝 Contributing

This project welcomes contributions from developers interested in event management technology. Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For business inquiries, support, or collaboration opportunities, please reach out through the platform's contact channels.

---

**Built with ❤️ for seamless event experiences**