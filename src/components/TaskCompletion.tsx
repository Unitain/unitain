import React, { useState } from 'react';
import { Button } from './Button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

// Configuration options
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfQGcNyLMgn4FRlrC_LIkRhOsnH02SBJBYvmQ-kYFK7wYNqVQ/viewform?embedded=true';
const FORM_WIDTH = '100%';
const FORM_HEIGHT = '520px';

/**
 * TaskCompletion component
 * 
 * This component provides a button that simulates a "task completion" event.
 * When clicked, it shows a SweetAlert2 modal with an embedded Google Form.
 */
export function TaskCompletion() {
  const [isCompleting, setIsCompleting] = useState(false);

  // Function to show the Google Form in a SweetAlert2 modal
  const showFeedbackForm = () => {
    // Configure SweetAlert2 modal with embedded Google Form
    Swal.fire({
      title: 'Task Completed!',
      html: `
        <p class="mb-4">Please fill out this quick feedback form:</p>
        <iframe 
          src="${GOOGLE_FORM_URL}" 
          width="${FORM_WIDTH}" 
          height="${FORM_HEIGHT}" 
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

  // Handle task completion
  const handleTaskComplete = () => {
    setIsCompleting(true);
    
    // Simulate task completion process
    setTimeout(() => {
      setIsCompleting(false);
      
      // Show success message
      toast.success('Task completed successfully!');
      
      // Show the feedback form
      showFeedbackForm();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
        Task Completion
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Click the button below to simulate completing a task. This will trigger the feedback form.
        </p>
        
        <Button
          onClick={handleTaskComplete}
          disabled={isCompleting}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4" />
          {isCompleting ? 'Completing Task...' : 'Complete Task'}
        </Button>
        
        <div className="flex items-start mt-4 bg-primary-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary-700">
            When you click the button, a modal will appear with an embedded Google Form.
            In a real application, this would be triggered after a user completes a specific task.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TaskCompletion;