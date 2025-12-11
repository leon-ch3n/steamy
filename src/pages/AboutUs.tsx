import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import lukePhoto from "../luke.png";
import leonPhoto from "../leon.png";

const team = [
  {
    name: "Leon Chen",
    role: "CEO & Co-founder",
    bio: "Leon built AI products at Google and previously scaled an infrastructure startup to $2.5M ARR. After seeing family and friends struggle with their own car purchase, he set out to fix a process that hasn't changed in decades.",
    photo: leonPhoto,
    photoScale: 1,
  },
  {
    name: "Luke Weinbach",
    role: "CTO & Co-founder",
    bio: "Luke researched how large language models reason through complex information at Wolfram. Seeing friends and family struggle with buying a car, he became focused on a simple idea: real intelligence should make the process effortless.",
    photo: lukePhoto,
    photoScale: 1.15,
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
    title: "We're Your Advocate",
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
            The traditional car-buying experience is broken. It forces buyers to sift through scattered information, seller-aligned platforms, and endless confusion. AutoMate is the alternative: an AI-powered guide that turns your needs into clear recommendations, pricing context, and next steps, all in one place, so you can buy with confidence instead of chaos.
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
                <h3 className="text-xl font-bold text-primary mb-2 italic">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="glass-card p-8 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {member.photo ? (
                  <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      style={{ transform: `scale(${member.photoScale || 1})` }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-thistle to-mauve mb-4 flex items-center justify-center text-3xl font-bold text-primary">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
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

