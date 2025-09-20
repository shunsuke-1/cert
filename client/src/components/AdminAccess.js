import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let keySequence = [];
    const adminSequence = ['a', 'd', 'm', 'i', 'n'];
    
    const handleKeyPress = (event) => {
      // Only listen for key presses when not in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      keySequence.push(event.key.toLowerCase());
      
      // Keep only the last 5 keys
      if (keySequence.length > 5) {
        keySequence = keySequence.slice(-5);
      }
      
      // Check if the sequence matches "admin"
      if (keySequence.join('') === adminSequence.join('')) {
        navigate('/admin?key=swiftui-admin-2024');
        keySequence = []; // Reset sequence
      }
    };

    // Add event listener
    document.addEventListener('keypress', handleKeyPress);
    
    // Cleanup
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default AdminAccess;