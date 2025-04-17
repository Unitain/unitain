import {X, Users, FileText, MessageSquare, LogOut, MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
}
const Header = ({
  handleLogout,
  user,
}: {
  handleLogout: () => void;
  user: User | null;
}) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'flex items-center gap-2 p-1 text-primary-600 border-b-2 border-primary-600 transition-colors cursor-pointer'
      : 'flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors cursor-pointer';
      const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-glass border-b border-gray-200/50 sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20">
        {/* Left Section: Logo & Navigation */}
        <div className="flex gap-10 items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <button className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200">
              Admin Unitain
            </button>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="md:flex hidden gap-11 text-sm sm:text-base font-medium">
              <NavLink to="/" className={navLinkClass}>
                <Users className="w-5 h-5" />
                <span>Users</span>
              </NavLink>
              <NavLink to="/documents" className={navLinkClass}>
                <FileText className="w-5 h-5" />
                <span>Documents</span>
              </NavLink>
              <NavLink to="/messages" className={navLinkClass}>
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </NavLink>
            </nav>
          )}
        </div>

        {/* Mobile Menu Button and Logout */}
        <div className="md:hidden flex gap-5" >
          {user && (
            <>
              <button
                onClick={handleLogout}
                className="text-primary-600 bg-primary-50 px-5 py-2 rounded-xl">
                <LogOut className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X/>: <MenuIcon/>}
              </button>
            </>
          )}
        </div>

        {/* Desktop Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="md:flex hidden items-center gap-2 text-primary-600 bg-primary-50 px-5 py-2 rounded-xl hover:text-primary-800 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        )}

        {/* Mobile Menu */}
          <div className={`fixed inset-0 z-50 h-screen w-full transition-opacity duration-300 ease-in-out  ${isOpen ? 'opacity-100': 'opacity-0 pointer-events-none'}`}>
            <div 
              className="absolute inset-0 bg-black/20" 
              onClick={() => setIsOpen(false)}
            />
            
            <div className="absolute right-0 top-0 h-full w-4/5 sm:w-2/5 bg-white shadow-lg p-5 flex flex-col transform transition-transform duration-300 ease-in-out">
              <button
                className="self-end mb-5 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Menu Items */}
              <nav className="flex flex-col gap-6 text-sm sm:text-base font-medium">
                <NavLink
                  to="/"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  <span>Users</span>
                </NavLink>
                <NavLink
                  to="/documents"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                </NavLink>
                <NavLink
                  to="/messages"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Messages</span>
                </NavLink>
              </nav>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;