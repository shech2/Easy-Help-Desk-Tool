import { FiServer } from 'react-icons/fi';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  };
  
  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className="flex items-center">
      <span className={`${textSizeClasses[size]} font-bold text-white`}>
        <span className="text-blue-500">Help</span>Desk
      </span>
      <div className={`${sizeClasses[size]} text-blue-500 mr-2`}>
        <FiServer />
      </div>
    </div>
  );
};

export default Logo;