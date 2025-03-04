import React from 'react';
import SandboxCredentials from './SandboxCredentials';
import TaskCompletion from './TaskCompletion';
import GoogleFormModal from './GoogleFormModal';
import { Info } from 'lucide-react';

/**
 * DemoPage component
 * 
 * This component serves as a container for the demo features:
 * 1. SandboxCredentials - For storing credentials in localStorage
 * 2. TaskCompletion - For simulating a task completion and showing the feedback form
 * 3. GoogleFormModal - For manually opening the Google Form modal
 */
export function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Form Integration Demo
          </h1>
          <p className="text-gray-600">
            This demo showcases embedding a Google Form in a SweetAlert2 modal and storing sandbox credentials in localStorage.
          </p>
        </header>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This demo includes three main features:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-blue-700 ml-2">
                <li>Storing sandbox credentials in localStorage</li>
                <li>Simulating a task completion that triggers a feedback form</li>
                <li>Manually opening a Google Form in a modal</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SandboxCredentials />
          <TaskCompletion />
        </div>

        <div className="mb-8">
          <GoogleFormModal />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Google Form Integration</h3>
              <p className="text-gray-600 text-sm mt-1">
                The Google Form is embedded using an iframe inside a SweetAlert2 modal. The form URL can be changed in the <code>GoogleFormModal.tsx</code> and <code>TaskCompletion.tsx</code> files.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">localStorage Usage</h3>
              <p className="text-gray-600 text-sm mt-1">
                Sandbox credentials are stored in localStorage using the keys <code>sandbox-userId</code> and <code>sandbox-token</code>. The credentials are loaded when the component mounts.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">SweetAlert2 Configuration</h3>
              <p className="text-gray-600 text-sm mt-1">
                SweetAlert2 is configured to display a modal with an embedded iframe. The modal is customized with specific width, padding, and styling to provide a good user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoPage;