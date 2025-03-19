import React from 'react';
import Swal from 'sweetalert2';
import { Button } from './Button';
import { ExternalLink } from 'lucide-react';

/**
 * GoogleFormModal component
 * 
 * This component provides a button to manually open a SweetAlert2 modal
 * with an embedded Google Form.
 */
export function GoogleFormModal() {
  // Google Form URL - Change this to your actual Google Form URL
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfQGcNyLMgn4FRlrC_LIkRhOsnH02SBJBYvmQ-kYFK7wYNqVQ/viewform?embedded=true';
  
  // Function to show the Google Form in a SweetAlert2 modal
  const showGoogleForm = () => {
    // Configure SweetAlert2 modal with embedded Google Form
    Swal.fire({
      title: 'Feedback Form',
      html: `
        <iframe 
          src="${GOOGLE_FORM_URL}" 
          width="100%" 
          height="520px" 
          frameborder="0" 
          marginheight="0" 
          marginwidth="0"
        >
          Loading form...
        </iframe>
      `,
      width: 700,
      padding: '1em',
      showCloseButton: true,
      showConfirmButton: false,
      focusConfirm: false,
      heightAuto: false,
      // Customize the modal appearance
      customClass: {
        container: 'swal-container',
        popup: 'swal-popup',
        title: 'text-xl font-bold text-gray-800 mb-4',
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ExternalLink className="w-5 h-5 mr-2 text-primary-600" />
        Google Form Modal
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Click the button below to open a modal with an embedded Google Form.
        </p>
        
        <Button
          onClick={showGoogleForm}
          className="w-full flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open Google Form
        </Button>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>
            <strong>Note:</strong> The Google Form URL can be changed in the <code>GoogleFormModal.tsx</code> file.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoogleFormModal;