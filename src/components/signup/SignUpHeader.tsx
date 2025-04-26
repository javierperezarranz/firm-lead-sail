
import { Link } from 'react-router-dom';

export const SignUpHeader = () => {
  return (
    <header className="w-full border-b border-border py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-semibold text-sm">LS</span>
          </div>
          <span className="font-medium text-lg tracking-tight">LawScheduling</span>
        </Link>
      </div>
    </header>
  );
};
