'use client';

import { useState } from 'react';
import { PropertyData, EstimateData, QualificationData } from './HomeValueFlow';

interface QualificationQuestionsProps {
  propertyData: PropertyData;
  initialEstimate: EstimateData;
  onComplete: (data: QualificationData) => void;
}

type ConditionType = 'excellent' | 'good' | 'fair' | 'needs-work';
type TimelineType = 'asap' | 'this-year' | 'curious' | 'exploring';

const CONDITION_OPTIONS = [
  {
    id: 'excellent' as ConditionType,
    title: 'Excellent',
    description: 'Move-in ready, recently updated',
    icon: '⭐',
    multiplier: 1.05
  },
  {
    id: 'good' as ConditionType,
    title: 'Good',
    description: 'Well-maintained, minor updates needed',
    icon: '👍',
    multiplier: 1.0
  },
  {
    id: 'fair' as ConditionType,
    title: 'Fair',
    description: 'Some wear, needs moderate updating',
    icon: '🔧',
    multiplier: 0.95
  },
  {
    id: 'needs-work' as ConditionType,
    title: 'Needs Work',
    description: 'Significant repairs or renovations needed',
    icon: '🚧',
    multiplier: 0.85
  }
];

const TIMELINE_OPTIONS = [
  {
    id: 'asap' as TimelineType,
    title: 'ASAP (0-3 months)',
    description: 'I need to sell quickly',
    icon: '🚀'
  },
  {
    id: 'this-year' as TimelineType,
    title: 'This Year',
    description: 'Planning to sell within 12 months',
    icon: '📅'
  },
  {
    id: 'curious' as TimelineType,
    title: 'Just Curious',
    description: 'Want to know my home\'s current value',
    icon: '🤔'
  },
  {
    id: 'exploring' as TimelineType,
    title: 'Exploring Options',
    description: 'Considering selling in the future',
    icon: '🔍'
  }
];

export function QualificationQuestions({ propertyData, initialEstimate, onComplete }: QualificationQuestionsProps) {
  const [condition, setCondition] = useState<ConditionType | null>(null);
  const [timeline, setTimeline] = useState<TimelineType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<'condition' | 'timeline'>('condition');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAdjustedEstimate = (conditionMultiplier?: number) => {
    const multiplier = conditionMultiplier || 1.0;
    return {
      low: Math.round(initialEstimate.lowEstimate * multiplier),
      high: Math.round(initialEstimate.highEstimate * multiplier)
    };
  };

  const handleConditionSelect = (selectedCondition: ConditionType) => {
    setCondition(selectedCondition);
    setCurrentQuestion('timeline');
  };

  const handleTimelineSelect = (selectedTimeline: TimelineType) => {
    setTimeline(selectedTimeline);
    
    if (condition) {
      onComplete({
        condition,
        timeline: selectedTimeline
      });
    }
  };

  const currentEstimate = condition ? getAdjustedEstimate(CONDITION_OPTIONS.find(c => c.id === condition)?.multiplier) : {
    low: initialEstimate.lowEstimate,
    high: initialEstimate.highEstimate
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <div className="w-16 h-1 bg-green-500 mx-2"></div>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <div className="w-16 h-1 bg-spyglass-orange mx-2"></div>
              <div className="w-8 h-8 bg-spyglass-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600">Step 3 of 3 - Almost Done!</p>
        </div>

        {/* Current Estimate Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Current Estimate
            </h2>
            <div className="text-3xl md:text-4xl font-bold text-spyglass-orange">
              {formatPrice(currentEstimate.low)} - {formatPrice(currentEstimate.high)}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="h-2 bg-gray-200 rounded-full flex-1 max-w-48">
                <div 
                  className="h-2 bg-gradient-to-r from-green-400 to-spyglass-orange rounded-full"
                  style={{ width: `${initialEstimate.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{initialEstimate.confidence}% confident</span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          
          {/* Condition Question */}
          {currentQuestion === 'condition' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  What's the overall condition of your home?
                </h1>
                <p className="text-gray-600 text-lg">
                  This helps us refine your estimate based on your property's current state
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONDITION_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleConditionSelect(option.id)}
                    className="p-6 border-2 border-gray-200 hover:border-spyglass-orange rounded-xl transition-all duration-200 hover:shadow-lg group text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-spyglass-orange mb-1">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{option.description}</p>
                        
                        {/* Show estimate adjustment */}
                        <div className="text-sm">
                          <span className="text-gray-500">Estimate: </span>
                          <span className="font-semibold text-spyglass-orange">
                            {formatPrice(getAdjustedEstimate(option.multiplier).low)} - {formatPrice(getAdjustedEstimate(option.multiplier).high)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                Select the condition that best describes your property
              </div>
            </div>
          )}

          {/* Timeline Question */}
          {currentQuestion === 'timeline' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Are you thinking of selling?
                </h1>
                <p className="text-gray-600 text-lg">
                  Let us know your timeline so we can provide relevant insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TIMELINE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleTimelineSelect(option.id)}
                    className="p-6 border-2 border-gray-200 hover:border-spyglass-orange rounded-xl transition-all duration-200 hover:shadow-lg group text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-spyglass-orange mb-1">
                          {option.title}
                        </h3>
                        <p className="text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentQuestion('condition')}
                  className="text-spyglass-orange hover:text-spyglass-orange-hover font-medium"
                >
                  ← Back to previous question
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Property Address Reminder */}
        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">
            Property: {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
          </p>
        </div>
      </div>
    </div>
  );
}