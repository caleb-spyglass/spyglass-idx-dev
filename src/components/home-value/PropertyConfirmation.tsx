'use client';

import { PropertyData } from './HomeValueFlow';

interface PropertyConfirmationProps {
  propertyData: PropertyData;
  onConfirm: () => void;
  onBack: () => void;
}

export function PropertyConfirmation({ propertyData, onConfirm, onBack }: PropertyConfirmationProps) {
  const fullAddress = `${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zip}`.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-spyglass-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="w-16 h-1 bg-gray-300 mx-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="w-16 h-1 bg-gray-300 mx-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600">Step 1 of 3</p>
        </div>

        {/* Property Confirmation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
            Is This Your Property?
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Please confirm the details below are correct
          </p>

          {/* Property Card */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Property Image Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-full md:w-48 h-36 bg-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <p className="text-sm">Property Photo</p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {fullAddress}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-spyglass-orange">
                      {propertyData.bedrooms || '?'}
                    </div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-spyglass-orange">
                      {propertyData.bathrooms || '?'}
                    </div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-spyglass-orange">
                      {propertyData.sqft ? propertyData.sqft.toLocaleString() : '?'}
                    </div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-spyglass-orange">
                      {propertyData.yearBuilt || '?'}
                    </div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>Property data from public records and MLS. Details will be refined in your full report.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              ← Back to Search
            </button>
            
            <button
              onClick={onConfirm}
              className="px-8 py-3 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white rounded-xl transition-colors font-semibold"
            >
              Yes, This is My Property →
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't see your property details? Don't worry - we'll gather more information in the next steps.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>MLS Verified Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}