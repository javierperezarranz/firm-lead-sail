
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border py-4 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">LS</span>
            </div>
            <span className="font-medium text-lg tracking-tight">LawScheduling</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gradient">
                Grow your law practice with targeted direct mail
              </h1>
              <p className="text-xl text-muted-foreground mx-auto max-w-2xl">
                Connect with potential clients who need your legal services using our compliant, data-driven direct mail campaigns.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" className="gap-2 px-8" onClick={handleSignUpClick}>
                  Sign up
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="gap-2 px-8">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Practice Areas Section */}
        <section className="py-16 bg-card">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Targeted Direct Mail for Every Practice Area</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our direct mail programs are tailored to reach the right clients at the right time.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 pt-4">
                <div className="p-6 rounded-lg bg-background/50 border border-border">
                  <h3 className="text-xl font-semibold mb-3">Family Law</h3>
                  <p className="text-muted-foreground">
                    Reach individuals going through major life changes who may need family law services.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-background/50 border border-border">
                  <h3 className="text-xl font-semibold mb-3">Criminal Defense</h3>
                  <p className="text-muted-foreground">
                    Connect with potential clients who may need representation for criminal matters.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-background/50 border border-border">
                  <h3 className="text-xl font-semibold mb-3">Real Estate Law</h3>
                  <p className="text-muted-foreground">
                    Target new homeowners and property investors who need legal guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to know about our direct mail service for law firms.
                </p>
              </div>
              
              <div className="space-y-6 pt-4">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    How do you source your data?
                  </h3>
                  <p className="text-muted-foreground">
                    We use publicly available data from court records, property transactions, and other legal sources to identify individuals who may need legal services.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Is this service compliant with bar regulations?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, our direct mail campaigns are designed to comply with all state bar regulations regarding attorney advertising and client solicitation.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    How does the pricing work?
                  </h3>
                  <p className="text-muted-foreground">
                    Our service is pay-per-lead, meaning you only pay for potential clients who respond to your direct mail campaign. There are no long-term commitments, and you can cancel anytime.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-card border border-border">
                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    How do potential clients respond?
                  </h3>
                  <p className="text-muted-foreground">
                    Each direct mail piece includes a personalized URL for the recipient to visit. When they fill out your intake form, you'll be immediately notified of the new lead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-card">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold">Ready to grow your practice?</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Sign up today and start receiving qualified leads through our direct mail campaigns.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" className="gap-2 px-8" onClick={handleSignUpClick}>
                  Sign up now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-semibold text-sm">LS</span>
              </div>
              <span className="font-medium text-lg tracking-tight">LawScheduling</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LawScheduling. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
