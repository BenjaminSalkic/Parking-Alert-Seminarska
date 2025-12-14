import React from "react";

export default function Header() {
  return (
    <header style={{padding: '1rem', borderBottom: '1px solid #eee'}}>
      <div style={{maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1 style={{margin: 0, fontSize: '1.25rem'}}>Parking Alert</h1>
        <nav>
          <a href="#" style={{marginRight: 12}}>Home</a>
        </nav>
      </div>
    </header>
  );
}
