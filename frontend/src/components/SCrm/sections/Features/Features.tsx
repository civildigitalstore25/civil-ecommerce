import { useAdminTheme } from "../../../../contexts/AdminThemeContext";
import FeatureCard from "./FeatureCard";
import FeatureCenterCard from "./FeatureCenterCard";
import OldNewWayComparison from "../OldNewWay/OldNewWayComparison";
import JourneySteps from "../JourneySteps/JourneySteps";
import LimitedTimeOffer from "../LimitedTimeOffer/LimitedTimeOffer";
import { LayoutDashboard, Clock, Bot, GitMerge, Database, Webhook, MessageSquare, Calendar, Link, Zap, PenTool, Sparkles } from "lucide-react";



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
  icon={LayoutDashboard}
  title="Kanban Dashboard"
  description="Visualize your sales pipeline with a drag-and-drop Kanban board."
  color="#3B82F6"
/>

<FeatureCard 
  icon={Clock}
  title="Schedule Messages"
  description="Plan and schedule WhatsApp messages for perfect timing."
  color="#F59E0B"
/>

<FeatureCard 
  icon={Bot}
  title="Chatbot Automation"
  description="Automate replies and qualify leads 24/7 without human intervention."
  color="#10B981"
/>

<FeatureCard 
  icon={GitMerge}
  title="Follow-up Funnels"
  description="Create automated sequences to nurture leads into customers."
  color="#8B5CF6"
/>

<FeatureCard 
  icon={Database}
  title="Data Backup & Restore"
  description="Keep your customer data safe with automatic backups."
  color="#EC4899"
/>

<FeatureCard 
  icon={Webhook}
  title="Webhook & API"
  description="Connect with Zapier, Pabbly, and more."
  color="#6366F1"
/>

<FeatureCard 
  icon={MessageSquare}
  title="Bulk Messaging"
  description="Send personalized broadcasts safely."
  color="#EF4444"
/>

<FeatureCard 
  icon={Calendar}
  title="Meeting Scheduling"
  description="Let clients book appointments directly via WhatsApp."
  color="#14B8A6"
/>

<FeatureCard 
  icon={Link}
  title="Link Generator"
  description="Create custom WhatsApp links for campaigns."
  color="#F97316"
/>

<FeatureCard 
  icon={Zap}
  title="Quick Reply"
  description="Save time with pre-saved responses."
  color="#EAB308"
/>

<FeatureCard 
  icon={PenTool}
  title="Team Signature"
  description="Add professional signatures to every message."
  color="#06B6D4"
/>

<FeatureCard 
  icon={Sparkles}
  title="AI Assistant"
  description="Leverage AI to write better messages and close deals."
  color="#D946EF"
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
  image="https://images.moneycontrol.com/static-mcnews/2024/12/20241224123954_WhatsApp-Image-2024-11-13-at-13.42.06.jpeg?impolicy=website&width=770&height=431"
  title="Live Chat + Tags"
  description="Real-time messaging with smart tagging system for instant lead organization and follow-up."
  badge="Popular"
/>


  <FeatureCenterCard 
    image="https://smsgraph.com/wp-content/uploads/2023/11/14-1024x683.jpg"
    title="Bulk WhatsApp Messages" 
    description="Send bulk WhatsApp messages with clickable buttons to engage and convert at scale." 
    badge="Featured"
  />

  <FeatureCenterCard 
    image="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
    title="Advanced Chatbot" 
    description="AI-powered chatbot with auto-reply capabilities to handle customer queries automatically." 
    badge="New"
  />

  <FeatureCenterCard 
    image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
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

