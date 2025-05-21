import { motion } from 'framer-motion';

/**
 * Loading spinner component with customizable appearance
 * 
 * @param props - Component properties
 * @param props.size - Size of the spinner in pixels
 * @param props.color - CSS color value for the spinner
 * @returns Animated loading spinner component
 */
export const LoadingSpinner = ({ 
  size = 40, 
  color = 'rgba(255, 255, 255, 0.8)',
  className = ''
}: { 
  size?: number; 
  color?: string;
  className?: string;
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="rounded-full border-t-transparent"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `${Math.max(2, size / 10)}px solid ${color}`,
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity
        }}
      />
    </div>
  );
}; 