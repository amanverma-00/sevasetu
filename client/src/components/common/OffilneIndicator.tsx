import React from 'react';

interface OfflineIndicatorProps {
  message?: string;
}

export const OffilneIndicator: React.FC<OfflineIndicatorProps> = ({ 
  message = 'You are currently offline. Changes will be synced when you\'re back online.' 
}) => {
  return (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );
};
//   return (
//     <Container>
//       <span>⚠️</span>
//       <span>{message}</span>
//     </Container>
//   );
// };

// export default OfflineIndicator;