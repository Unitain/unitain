import { Users, FileText, MessageSquare, LogOut } from 'lucide-react';
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

  return (
    <header className="bg-white/80 backdrop-blur-glass border-b border-gray-200/50 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20">
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
            <nav className="flex gap-11 text-sm sm:text-base font-medium">
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

        {/* Right Section: Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-primary-600 bg-primary-50 px-5 py-2 rounded-xl hover:text-primary-800 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
