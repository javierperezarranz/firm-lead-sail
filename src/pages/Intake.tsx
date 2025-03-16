
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import IntakeForm from '@/components/IntakeForm';

const Intake = () => {
  const { firmId } = useParams<{ firmId: string }>();
  
  if (!firmId) {
    return <div>Law firm not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header firmId={firmId} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center animate-fade-up">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-2">
              Consultation Request
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Request a consultation with our firm
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please fill out the form below and our team will contact you shortly to schedule your consultation.
            </p>
          </div>
          
          <IntakeForm lawFirmId={firmId} />
        </div>
      </main>
    </div>
  );
};

export default Intake;
