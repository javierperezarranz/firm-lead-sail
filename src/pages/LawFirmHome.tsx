
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const LawFirmHome = () => {
  const { firmId } = useParams<{ firmId: string }>();
  
  if (!firmId) {
    return <div>Law firm not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header firmId={firmId} />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-8 animate-fade-up">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Direct Mail website of Law Firm
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Try out the form that your clients will fill out and manage your account
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={`/${firmId}/intake`}>
                <Button size="lg" variant="secondary" className="gap-2 px-6">
                  Try client form
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" className="gap-2 px-6">
                  Log in
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

export default LawFirmHome;
