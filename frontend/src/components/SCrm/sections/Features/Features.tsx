import { useAdminTheme } from "../../../../contexts/AdminThemeContext";
import FeatureCard from "./FeatureCard";
import FeatureCenterCard from "./FeatureCenterCard";
import OldNewWayComparison from "../OldNewWay/OldNewWayComparison";
import JourneySteps from "../JourneySteps/JourneySteps";
import LimitedTimeOffer from "../LimitedTimeOffer/LimitedTimeOffer";

export default function Features() {
  const { colors } = useAdminTheme();

  return (
    <section id="features" className=" bg-slate-950/95 py-20">
      {/* First Section */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white mb-4">
            Automate the <span style={{ color: colors.interactive.primary }}>Busy-work</span>, Focus on What Matters.
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Super CRM eliminates tedious manual tasks, so you can spend less time managing chats and more time converting customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Kanban Pipeline" 
            description="Manage tasks, workflows, leads, and communication in a visual, drag-and-drop board." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Automated Follow-ups" 
            description="Set up smart follow-up sequences that trigger automatically based on lead behavior." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Bulk Campaigns" 
            description="Send personalized bulk WhatsApp messages to thousands of contacts with one click." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Chatbot & Auto Reply" 
            description="Handle customer inquiries 24/7 with intelligent chatbots and automated responses." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Lead Management" 
            description="Organize and track all your leads with tags, labels, and custom fields." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Analytics & Reports" 
            description="Track message delivery, open rates, and conversion metrics in real-time." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Team Collaboration" 
            description="Share conversations, assign leads, and collaborate seamlessly with your team." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="API Integration" 
            description="Connect with your existing tools and workflows through powerful API endpoints." 
          />
          <FeatureCard 
            image="https://via.placeholder.com/150" 
            title="Message Templates" 
            description="Save and reuse your best-performing message templates for consistent communication." 
          />
        </div>
      </div>

      {/* Second Section - Command Center */}
      <div className="mt-20 mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white mb-4">
            Your All-in-One <span style={{ color: colors.interactive.primary }}>Command Center</span>
          </h2>
          <p className="text-base text-white/60 max-w-xl mx-auto">
            Explore the powerful features designed to automate workflows, manage leads, and grow your sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCenterCard 
            image="https://via.placeholder.com/400x225" 
            title="Live Chat + Tags" 
            description="Real-time messaging with smart tagging system for instant lead organization and follow-up." 
            badge="Popular"
          />
          <FeatureCenterCard 
            image="https://via.placeholder.com/400x225" 
            title="Bulk WhatsApp Messages" 
            description="Send bulk WhatsApp messages with clickable buttons to engage and convert at scale." 
            badge="Featured"
          />
          <FeatureCenterCard 
            image="https://via.placeholder.com/400x225" 
            title="Advanced Chatbot" 
            description="AI-powered chatbot with auto-reply capabilities to handle customer queries automatically." 
            badge="New"
          />
          <FeatureCenterCard 
            image="https://via.placeholder.com/400x225" 
            title="Message Reports" 
            description="Comprehensive analytics for sent and received messages with detailed insights." 
          />
        </div>
        <OldNewWayComparison />
        <JourneySteps />
        <LimitedTimeOffer />
        {/* Hero CTA Section */}
        <div className="mx-auto max-w-4xl px-4 mb-20 mt-20">
          <div className="text-center">
            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white mb-6">
              Ready to Turn Your WhatsApp Into an{" "}
              <span style={{ color: "#06b6d4" }}>Automated</span>{" "}
              <span style={{ color: colors.interactive.primary }}>Sales Machine?</span>
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop leaving money on the table. Get the tool that organizes your chaos, automates your follow-ups, and helps you close more deals.
            </p>

            {/* CTA Button */}
            <button
              className="px-10 py-4 text-lg font-bold text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] active:scale-[0.98] mb-4"
              style={{
                background: `linear-gradient(90deg, #06b6d4, ${colors.interactive.primary})`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(90deg, ${colors.interactive.primary}, #06b6d4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(90deg, #06b6d4, ${colors.interactive.primary})`;
              }}
            >
              Yes! I Want Instant Access Now
            </button>

            {/* Guarantee */}
            <p className="text-sm text-white/80">
              30-Day 100% Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

