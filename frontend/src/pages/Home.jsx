import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      if (user) navigate('/profile');
      else navigate('/login');
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}
}
