
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border bg-background/80 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">LS</span>
            </div>
            <span className="font-medium text-lg tracking-tight">LawScheduling</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-8 animate-fade-up">
            <div className="space-y-6">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-2">
                Client Intake Solution
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Streamline your law firm's client intake process
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A simple, elegant way to collect and manage potential client information for your law practice.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/lawfirm1/intake">
                <Button size="lg" className="gap-2 px-6">
                  Try Client Form
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lawfirm1/back">
                <Button size="lg" variant="outline" className="gap-2 px-6">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t border-border py-6 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} LawScheduling. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
