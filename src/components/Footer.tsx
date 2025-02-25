import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Globe } from 'lucide-react';
import { ChangelogPopup } from './ChangelogPopup';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  const [showChangelog, setShowChangelog] = useState(false);
  const [version, setVersion] = useState('1.8.9');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const { data, error } = await supabase
          .from('changelog')
          .select('version')
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        if (data?.version) {
          setVersion(data.version);
        }
      } catch (error) {
        console.error('Failed to fetch version:', error);
      }
    };

    fetchLatestVersion();
  }, []);

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:support@unitain.net" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  support@unitain.net
                </a>
              </li>
            </ul>
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
              <button
                onClick={() => setShowChangelog(true)}
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Version {version}
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Unitain. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <ChangelogPopup
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </footer>
  );
}

export default Footer;