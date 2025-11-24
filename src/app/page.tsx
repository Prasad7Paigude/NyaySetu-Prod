"use client";
import { SparklesPreview } from "../components/sparclesUi";
import NavbarComponent from "@/components/navbar/NavbarComponent";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import FooterComponent from "@/components/footer/FooterComponent";
import { MagicCard } from "@/components/ui/magic-card";
import { ShinyButton } from "@/components/ui/shiny-button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavbarComponent />
      <SparklesPreview />

      <div className="bg-background flex flex-col items-center justify-center space-y-12 py-12 px-4 transition-colors duration-300">
        {/* Heading and subheading */}
        <div className="text-center max-w-2xl mt-5">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Powerful AI Features
          </h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            Experience the next generation of legal technology with our advanced
            AI agents and intelligent automation.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {/* Card 1 – Chatbot */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c4.97 0 9-3.58 9-8s-4.03-8-9-8-9 3.58-9 8c0 2.64 1.32 5 3.43 6.57L5 22l4.21-1.31C10.1 21.56 11.03 22 12 22z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">Chatbot</h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Acts as a legal guidance chatbot that explains complex IPC sections,
                legal terms, and document purposes in simple English.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Launch Chatbot
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>


          {/* Card 2 – IPC Section Prediction */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">
                IPC Section Prediction
              </h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Automatically predicts the most relevant IPC Section(s) based on
                a user’s incident description.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Start Prediction
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>

          {/* Card 3 – Legal Draft Generator */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"></path>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h4"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Legal Draft Generator
              </h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Automates the creation of legal documents using predefined
                templates and dynamic questioning.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Generate Draft
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>

          {/* Card 4 – Law & Judgement Updation */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 6h-8l-2-3H3v17h18V6z"></path>
                  <path d="M3 13h18"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Law & Judgement Updation
              </h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Automatically fetches legal news, updates, and judgments;
                delivered via website or newsletter.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  View Updates
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>
        </div>
        <MacbookScroll src="/macbook-image.png" />

      </div>




      <div className="bg-background flex flex-col items-center justify-center space-y-12 py-12 px-4 transition-colors duration-300">
        {/* Heading and subheading */}
        <div className="text-center max-w-2xl mt-5">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Powerful AI Features
          </h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            Experience the next generation of legal technology with our advanced
            AI agents and intelligent automation.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {/* Card 1 – Smart Automated Document */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c4.97 0 9-3.58 9-8s-4.03-8-9-8-9 3.58-9 8c0 2.64 1.32 5 3.43 6.57L5 22l4.21-1.31C10.1 21.56 11.03 22 12 22z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">Smart Automated Document</h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Intelligent document processing with AI-powered analysis, formatting, and legal compliance checking.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Start Processing
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>

          {/* Card 2 – Multi Agent Collaboration */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Multi Agent Collaboration
              </h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Coordinated AI agents working together to provide comprehensive legal solutions and insights.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Collaborate
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>

          {/* Card 3 – Agentic Approach */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"></path>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h4"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Agentic Approach
              </h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Advanced AI agents that autonomously handle complex legal tasks with intelligent decision-making capabilities.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Explore Agents
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>

          {/* Card 4 – 24/7 Availability */}
          <MagicCard className="w-full h-auto hover:scale-105 transition-transform">
            <div className="p-6 text-foreground flex flex-col h-full">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 6h-8l-2-3H3v17h18V6z"></path>
                  <path d="M3 13h18"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold mb-2">
                24/7 Availability
              </h3>
              <p className="text-sm text-muted-foreground flex-grow">
                Round-the-clock legal assistance and document processing without any downtime.
              </p>
              <Link href="/login" className="w-full">
                <ShinyButton className="mt-4 bg-primary text-primary-foreground">
                  Get Help Now
                </ShinyButton>
              </Link>
            </div>
          </MagicCard>
        </div>

      </div>

      {/* Macbook Scroll Effect */}
      <FooterComponent />
    </>
  );
}
