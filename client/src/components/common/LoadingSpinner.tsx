// // components/common/LoadingSpinner.tsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import styled from 'styled-components';

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 200px;
// `;

// const Spinner = styled(motion.div)`
//   width: 40px;
//   height: 40px;
//   border: 4px solid ${props => props.theme.colors.border};
//   border-top: 4px solid ${props => props.theme.colors.primary};
//   border-radius: 50%;
// `;

// const LoadingSpinner: React.FC = () => {
//   return (
//     <Container>
//       <Spinner
//         animate={{ rotate: 360 }}
//         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//       />
//     </Container>
//   );
// };

// export default LoadingSpinner;