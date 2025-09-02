// components/common/StatsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Card = styled(motion.div)<{ color: string; isAction?: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color};
  cursor: ${props => props.isAction ? 'pointer' : 'default'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.isAction ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.isAction ? '0 10px 15px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
`;

const Value = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
`;

const Icon = styled.div<{ color: string }>`
  font-size: 2.5rem;
  color: ${props => props.color};
`;

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  isAction?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, isAction = false }) => {
  return (
    <Card 
      color={color} 
      isAction={isAction}
      whileHover={isAction ? { y: -5 } : {}}
      whileTap={isAction ? { scale: 0.98 } : {}}
    >
      <Content>
        <TextContent>
          <Title>{title}</Title>
          <Value>{value}</Value>
        </TextContent>
        <Icon color={color}>{icon}</Icon>
      </Content>
    </Card>
  );
};

export default StatsCard;