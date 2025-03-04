import React from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

/**
 * TaxCheckModal component
 * 
 * This component provides functionality to:
 * 1. Open a modal informing about the beta test
 * 2. Provide PayPal sandbox credentials for testing
 */
export function showTaxCheckModal() {
  // PayPal sandbox credentials
  const paypalEmail = "sb-no7fn37881668@personal.example.com";
  const paypalPassword = "xx!T%A5C";
  
  // Configure SweetAlert2 modal with PayPal sandbox credentials
  Swal.fire({
    title: 'Start your test to improve unitain.net',
    html: `
      <div class="text-left">
        <p class="mb-4">Copy the following credentials to use them later to pay via PayPal sandbox:</p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            PayPal Sandbox Email
          </label>
          <div class="flex">
            <input
              id="paypal-email"
              type="text"
              value="${paypalEmail}"
              readonly
              class="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
            <button 
              onclick="navigator.clipboard.writeText('${paypalEmail}').then(() => document.getElementById('email-copy-success').classList.remove('hidden'))"
              class="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 hover:bg-gray-200 flex items-center justify-center"
              type="button"
              aria-label="Copy email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <span id="email-copy-success" class="text-xs text-green-600 hidden">Copied!</span>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            PayPal Sandbox Password
          </label>
          <div class="flex">
            <input
              id="paypal-password"
              type="text"
              value="${paypalPassword}"
              readonly
              class="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
            <button 
              onclick="navigator.clipboard.writeText('${paypalPassword}').then(() => document.getElementById('password-copy-success').classList.remove('hidden'))"
              class="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 hover:bg-gray-200 flex items-center justify-center"
              type="button"
              aria-label="Copy password"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <span id="password-copy-success" class="text-xs text-green-600 hidden">Copied!</span>
        </div>
        
        <div class="bg-blue-50 p-3 rounded-md mb-4">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p class="text-sm text-blue-700">
              These credentials will be used to test the PayPal payment process. Please save them for later use.
            </p>
          </div>
        </div>
      </div>
    `,
    width: 600,
    padding: '1.5em',
    showCloseButton: true,
    showCancelButton: false,
    confirmButtonText: 'Start Beta Test',
    confirmButtonColor: '#2563eb',
    focusConfirm: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Show success message
      toast.success('Beta test started!');
      
      // Scroll to eligibility checker with a slight delay to ensure proper scrolling
      setTimeout(() => {
        const element = document.getElementById("eligibility-checker");
        if (element) {
          // Get the element's position
          const rect = element.getBoundingClientRect();
          
          // Calculate the target scroll position to show the eligibility checker content
          // We want to scroll to the element plus some additional offset to show the title
          const scrollPosition = window.pageYOffset + rect.top - 20;
          
          // Scroll to the calculated position
          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth"
          });
          
          // For better visibility, scroll a bit more to show the actual checker content
          setTimeout(() => {
            // Find the actual checker content (the first child with bg-white class)
            const checkerContent = element.querySelector('.bg-white');
            if (checkerContent) {
              const contentRect = checkerContent.getBoundingClientRect();
              const contentPosition = window.pageYOffset + contentRect.top - 120;
              
              window.scrollTo({
                top: contentPosition,
                behavior: "smooth"
              });
            }
          }, 300);
        }
      }, 100);
    }
  });
}

export default showTaxCheckModal;