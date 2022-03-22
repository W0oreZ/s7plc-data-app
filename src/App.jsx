import React, { useEffect, useState } from 'react';

function App() {
  const [Platform, setPlatform] = useState(window.api.getOS());
  const [program, setProgram] = useState("")
  const [dataPoints, setDataPoints] = useState([]);
  useEffect(() => {
    window.api.onStateChange(state=>{
      //console.log(data);
      var newState = state.dataPoints.filter(x=>x.name!=="PROGRAM_NAME");
      setProgram(state.dataPoints[state.dataPoints.length-1].value)
      setDataPoints(newState);
    })
    
  }, [])
  
  return (
    <>
      <main>
        <h1>DSG-CANUSA Dashboard</h1>
        <p>developped by NEXTRONIC</p>
      </main>
      <div className='prg'>
            <h3>ACTIVE PROGRAM</h3>
            <h1>{program}</h1>
      </div>
      <ul>
        {dataPoints.map(dp=>(
          <li key={dp.name} className="card">
            <div className="card__flipper">
              <div className="card__front">
                <p className="card__name"><span></span><br />{dp.name}</p>
                <p className="card__num">{isNaN(Math.round(dp.value)) ? dp.value : Math.round(dp.value) }</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
  // <li className="card">
  //   <div className="card__flipper">
  //     <div className="card__front">
  //       <p className="card__name"><span>Tony</span><br />Romo</p>
  //       <p className="card__num">9</p>
  //     </div>
  //   </div>
  // </li>
  // <li className="card">
  //   <div className="card__flipper">
  //      <div className="card__front">
  //        <p className="card__name"><span>Aaron</span><br />Rodgers</p>
  //       <p className="card__num">12</p>
  //     </div>
  //   </div>
  // </li>
  // <li className="card">
  //   <div className="card__flipper">
  //      <div className="card__front">
  //       <p className="card__name"><span>Ben</span><br />Roethlisberger</p>
  //       <p className="card__num">7</p>
  //     </div>
  //   </div>
  // </li>
  // <li className="card">
  //   <div className="card__flipper">
  //      <div className="card__front">
  //       <p className="card__name"><span>Peyton</span><br />Manning</p>
  //       <p className="card__num">18</p>
  //     </div>
  //   </div>
  // </li>
  // <li className="card">
  //   <div className="card__flipper">
  //      <div className="card__front">
  //       <p className="card__name"><span>Tom</span><br />Brady</p>
  //       <p className="card__num">12</p>
  //     </div>
     
  //   </div>
  // </li>
  // <li className="card">
  //   <div className="card__flipper">
  //      <div className="card__front">
  //       <p className="card__name"><span>Drew</span><br />Brees</p>
  //       <p className="card__num">9</p>
  //     </div>
    
  //   </div>
  // </li>