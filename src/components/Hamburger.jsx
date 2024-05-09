import React, {useState} from 'react';

const Hamburger = ({ menuOpen, setMenuOpen, className = '' }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
        setIsHovering(false); 
    };
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div className={`hamburger ${menuOpen ? 'open' : ''} ${className} ${isHovering ? 'hover' : ''}`} onClick={handleMenuToggle}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Hamburger;
