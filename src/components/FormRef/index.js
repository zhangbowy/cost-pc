import React from 'react';

export const logProps = (WrappedComponent) => props => {
  return <WrappedComponent {...props} />;
};
