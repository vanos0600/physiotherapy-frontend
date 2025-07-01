import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, action }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;