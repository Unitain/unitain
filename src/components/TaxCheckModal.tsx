import React from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useAuthStore } from '../lib/store';

/**
 * TaxCheckModal component
 * 
 * This component provides functionality to:
 * 1. Show different modals based on authentication state
 * 2. Handle beta test start process
 * 3. Manage terms acceptance for new users
 */
export function showTaxCheckModal() {
  const { user } = useAuthStore.getState();

  if (user) {
    // Show simpler modal for authenticated users
    Swal.fire({
      title: 'Start your test to improve unitain.net',
      html: `
        <div class="text-left">
          <p class="mb-4">You're about to start the beta test for our tax exemption service.</p>
          
        <div class="bg-blue-50 p-3 rounded-md mb-4">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p class="text-sm text-blue-700">
              During this test, you'll be using our PayPal sandbox environment to simulate the payment process.
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
      
      // Scroll to eligibility checker
      scrollToEligibilityChecker();
      }
    });
  } else {
    // Show authentication modal for unauthenticated users
    Swal.fire({
      title: 'Start your test to improve unitain.net',
      html: `
        <div class="text-left">
          <p class="mb-4">To start the beta test, you'll need to create an account or sign in.</p>
          
          <div class="mb-4">
            <div class="flex items-start mb-4">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  I accept the 
                  <a href="/terms" target="_blank" class="text-blue-600 hover:text-blue-800 ml-1">
                    Terms of Use
                  </a>
                </label>
                <p class="text-gray-500">
                  By continuing, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 p-3 rounded-md mb-4">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p class="text-sm text-blue-700">
                During this test, you'll be using our PayPal sandbox environment to simulate the payment process.
              </p>
            </div>
          </div>
        </div>
      `,
      width: 600,
      padding: '1.5em',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Continue to Sign Up',
      cancelButtonText: 'Sign In Instead',
      confirmButtonColor: '#2563eb',
      focusConfirm: true,
      preConfirm: () => {
        const termsAccepted = document.getElementById('terms') as HTMLInputElement;
        if (!termsAccepted?.checked) {
          Swal.showValidationMessage('Please accept the Terms of Use to continue');
          return false;
        }
        return true;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("result", result.isConfirmed);
        
        // User chose to sign up
        document.getElementById('auth-button')?.click();
        
        // const authModal = document.querySelector('[data-auth-modal]');
        // if (authModal) {
        //   (authModal as HTMLElement).dataset.initialMode = 'signup';
        // }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to sign in
        document.getElementById('auth-button')?.click();
        const authModal = document.querySelector('[data-auth-modal]');
        if (authModal) {
          (authModal as HTMLElement).dataset.initialMode = 'login';
        }
      }
    });
  }
}

function scrollToEligibilityChecker() {
  setTimeout(() => {
    const element = document.getElementById("eligibility-checker");
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollPosition = window.pageYOffset + rect.top - 20;
      
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
      });
      
      setTimeout(() => {
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

export default showTaxCheckModal;