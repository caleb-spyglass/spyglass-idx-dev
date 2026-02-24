import { Suspense } from 'react';

async function CommunitiesTestResults() {
  try {
    // Test the communities API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/communities/test?fast=true`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Test API failed: ${response.status}`);
    }
    
    const diagnostics = await response.json();
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Summary</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{diagnostics.summary.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{diagnostics.summary.passed}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{diagnostics.summary.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{diagnostics.summary.responseTime}ms</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            diagnostics.summary.failed === 0 ? 'bg-green-100 border border-green-200' : 'bg-yellow-100 border border-yellow-200'
          }`}>
            <p className="font-medium text-gray-800">{diagnostics.recommendation}</p>
            <p className="text-sm text-gray-600 mt-1">Backend Editor Endpoint: <code className="bg-white px-2 py-1 rounded">{diagnostics.backendEditorUrl}</code></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Test Results</h2>
          <div className="space-y-4">
            {diagnostics.tests.map((test: any, index: number) => (
              <div key={index} className={`border rounded-lg p-4 ${
                test.status === 'pass' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    test.status === 'pass' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {test.status === 'pass' ? '✅ Pass' : '❌ Fail'}
                  </span>
                </div>
                
                {test.error && (
                  <div className="mb-2">
                    <p className="text-sm text-red-600 font-medium">Error: {test.error}</p>
                  </div>
                )}
                
                {test.details && (
                  <div className="text-sm text-gray-600">
                    <pre className="bg-white p-2 rounded border overflow-auto">
{JSON.stringify(test.details, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  Response time: {test.responseTime}ms
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">For Backend Editor Integration</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-900">Recommended API Endpoint</h4>
              <code className="text-sm text-blue-700">/api/communities?static=true</code>
              <p className="text-sm text-blue-600 mt-1">Fast, reliable static data perfect for backend editor</p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <h4 className="font-medium text-green-900">Individual Community</h4>
              <code className="text-sm text-green-700">/api/communities/[slug]</code>
              <p className="text-sm text-green-600 mt-1">Get detailed information for specific communities</p>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium text-gray-900">Frontend Routes</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div><code>/communities</code> - Communities overview page</div>
                <div><code>/communities/[slug]</code> - Individual community pages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Test Failed</h2>
        <p className="text-red-600">
          Error running diagnostics: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }
}

export default function CommunitiesTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities Backend Editor Test</h1>
          <p className="text-gray-600">
            Diagnostic page to verify communities data is accessible for the backend editor.
            All tests should pass for proper backend integration.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Running community diagnostics...</p>
          </div>
        }>
          <CommunitiesTestResults />
        </Suspense>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p>For issues, check server logs or contact development team</p>
        </div>
      </div>
    </div>
  );
}