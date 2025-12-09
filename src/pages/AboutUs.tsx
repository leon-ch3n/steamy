import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    bio: "Former product lead at a major auto marketplace. Frustrated by the car buying experience, Alex set out to fix it.",
  },
  {
    name: "Jordan Rivera",
    role: "CTO & Co-founder",
    bio: "AI researcher turned entrepreneur. Built the conversational AI that powers AutoMate's understanding of what you really need.",
  },
  {
    name: "Sam Patel",
    role: "Head of Partnerships",
    bio: "Spent a decade in automotive retail. Now uses that knowledge to get better deals for AutoMate users.",
  },
];

const values = [
  {
    title: "Transparency First",
    description: "No hidden fees, no dealer games. You see exactly what you're paying for.",
    icon: "👁️",
  },
  {
    title: "Time is Everything",
    description: "We respect your time. What used to take weeks now takes minutes.",
    icon: "⏱️",
  },
  {
    title: "Your Advocate",
    description: "We work for you, not the dealership. Our AI negotiates to save you money.",
    icon: "🤝",
  },
];

export const AboutUs = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-24">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            About <span className="gradient-text">AutoMate</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We believe buying a car should be as simple as ordering takeout. No pressure, no games, no wasted weekends at dealerships.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card p-8 md:p-12 mb-16 animate-slide-up">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            The traditional car buying experience is broken. It's designed to confuse, pressure, and extract maximum profit from buyers. We're building the alternative: an AI-powered platform that puts you in control. Tell us what you need, and we handle the research, comparison, negotiation, and paperwork—all without you ever having to set foot in a dealership.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="glass-card p-8 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="glass-card p-8 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-thistle to-mauve mb-4 flex items-center justify-center text-2xl font-bold text-primary">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                <p className="text-sm text-primary/70 mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-lg text-slate-600 mb-6">Ready to experience car buying done right?</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Find Your Car
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
};

