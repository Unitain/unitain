import React from 'react';
import { Globe, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  return (
    <footer className="bg-[#14161f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Unitain</h3>
            <p className="text-gray-400 text-sm">
              Professional vehicle tax exemption services for expats in Portugal.
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Available in multiple languages</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <a href="mailto:support@unitain.net" className="hover:text-white transition-colors">
                support@unitain.net
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link to="/imprint" className="text-gray-400 hover:text-white transition-colors">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Version 1.8.9</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Unitain. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;