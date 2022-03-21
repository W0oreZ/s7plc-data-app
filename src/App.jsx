import React, { useState } from 'react';

function App() {
  const [Platform, setPlatform] = useState(window.api.getOS());
  return (
    <div className="App">
      <h1>Hello World !</h1>
      <h1>{Platform}</h1>
    </div>
  );
}

export default App;
