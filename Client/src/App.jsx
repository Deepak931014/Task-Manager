import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const session = Cookies.get("user");
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <div className="container">
      {isAuthenticated ? (
        window.location.href = "/dashboard"
      ) : (
        window.location.href = "/login"
      )
      }
    </div>
  )
}

export default App;