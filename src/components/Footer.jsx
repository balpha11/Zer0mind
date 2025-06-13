import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 text-center border-t border-border">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 