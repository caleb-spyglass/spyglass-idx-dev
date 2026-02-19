'use client';

import { useState } from 'react';
import { HomeValueHero } from './HomeValueHero';
import { PropertyConfirmation } from './PropertyConfirmation';
import { QuickEstimate } from './QuickEstimate';
import { QualificationQuestions } from './QualificationQuestions';
import { LeadCapture } from './LeadCapture';
import { ReportPreview } from './ReportPreview';

export type PropertyData = {
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  yearBuilt?: number;
  propertyType?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type QualificationData = {
  condition: 'excellent' | 'good' | 'fair' | 'needs-work' | null;
  timeline: 'asap' | 'this-year' | 'curious' | 'exploring' | null;
};

export type EstimateData = {
  lowEstimate: number;
  highEstimate: number;
  confidence: number;
};

export type ContactData = {
  email: string;
  phone: string;
};

const STEPS = {
  HERO: 'hero',
  CONFIRMATION: 'confirmation',
  ESTIMATE: 'estimate',
  QUALIFICATION: 'qualification',
  LEAD_CAPTURE: 'lead-capture',
  REPORT: 'report',
} as const;

type Step = typeof STEPS[keyof typeof STEPS];

export function HomeValueFlow() {
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.HERO);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [qualificationData, setQualificationData] = useState<QualificationData>({
    condition: null,
    timeline: null,
  });
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  const handleAddressSubmit = (data: PropertyData) => {
    setPropertyData(data);
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const handlePropertyConfirmed = () => {
    setCurrentStep(STEPS.ESTIMATE);
  };

  const handleEstimateGenerated = (estimate: EstimateData) => {
    setEstimateData(estimate);
    setCurrentStep(STEPS.QUALIFICATION);
  };

  const handleQualificationComplete = (data: QualificationData) => {
    setQualificationData(data);
    setCurrentStep(STEPS.LEAD_CAPTURE);
  };

  const handleLeadCaptured = (contact: ContactData) => {
    setContactData(contact);
    setCurrentStep(STEPS.REPORT);
  };

  const handleBackToStart = () => {
    setCurrentStep(STEPS.HERO);
    setPropertyData(null);
    setQualificationData({ condition: null, timeline: null });
    setEstimateData(null);
    setContactData(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentStep === STEPS.HERO && (
        <HomeValueHero onAddressSubmit={handleAddressSubmit} />
      )}
      
      {currentStep === STEPS.CONFIRMATION && propertyData && (
        <PropertyConfirmation 
          propertyData={propertyData}
          onConfirm={handlePropertyConfirmed}
          onBack={() => setCurrentStep(STEPS.HERO)}
        />
      )}
      
      {currentStep === STEPS.ESTIMATE && propertyData && (
        <QuickEstimate 
          propertyData={propertyData}
          onEstimateGenerated={handleEstimateGenerated}
        />
      )}
      
      {currentStep === STEPS.QUALIFICATION && propertyData && estimateData && (
        <QualificationQuestions 
          propertyData={propertyData}
          initialEstimate={estimateData}
          onComplete={handleQualificationComplete}
        />
      )}
      
      {currentStep === STEPS.LEAD_CAPTURE && propertyData && estimateData && qualificationData && (
        <LeadCapture 
          propertyData={propertyData}
          estimateData={estimateData}
          qualificationData={qualificationData}
          onComplete={handleLeadCaptured}
        />
      )}
      
      {currentStep === STEPS.REPORT && propertyData && estimateData && qualificationData && contactData && (
        <ReportPreview 
          propertyData={propertyData}
          estimateData={estimateData}
          qualificationData={qualificationData}
          contactData={contactData}
          onStartOver={handleBackToStart}
        />
      )}
    </div>
  );
}