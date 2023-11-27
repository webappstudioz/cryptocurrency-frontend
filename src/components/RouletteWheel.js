import React, { useEffect } from 'react';

const RouletteWheel = () => {
  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  // const buildWheel = () => {
  //   const wheel = (

  //   );

  //   return wheel;
  // };

  const spinWheel = () => {
    let degree = 0;

    for (let i = 0; i < 36; i++) {
      // if (wheelnumbersAC[i] === winningSpin) {
        degree = i * 9.73 + 362;
        break;
      // }
    }

    const wheel = document.getElementById('wheel');
    const ballTrack = document.getElementById('ballTrack');

    wheel.style.animation = 'wheelRotate 5s linear infinite';
    ballTrack.style.animation = 'ballRotate 1s linear infinite';

    setTimeout(() => {
      ballTrack.style.animation = 'ballRotate 2s linear infinite';
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerText = `@keyframes ballStop { from { transform: rotate(0deg); } to { transform: rotate(-${degree}deg); } }`;
      document.head.appendChild(style);
    }, 2000);

    // setTimeout(() => {
    //   ballTrack.style.animation = 'ballStop 3s linear';
    // }, 6000);

    // setTimeout(() => {
    //   ballTrack.style.transform = `rotate(-${degree}deg)`;
    // }, 9000);

    // setTimeout(() => {
    //   wheel.style.animation = '';
    //   const style = document.querySelector('style');
    //   if (style) {
    //     style.remove();
    //   }
    // }, 10000);
  };

  useEffect(() => {
    spinWheel();
  }, []); // Run only once on component mount

  return (
    <div className="wheel" id="wheel">
    <div className="outerRim"></div>
    {numbers.map((number, index) => {
      const a = index + 1;
      const spanClass = number < 10 ? 'single' : 'double';
      return (
        <div key={`sect${a}`} id={`sect${a}`} className="sect">
          <span className={spanClass}>{number}</span>
          <div className="block"></div>
        </div>
      );
    })}
    <div className="pocketsRim"></div>
    <div className="ballTrack" id="ballTrack">
      <div className="ball"></div>
    </div>
    <div className="pockets"></div>
    <div className="cone"></div>
    <div className="turret"></div>
    <div className="turretHandle">
      <div className="thendOne"></div>
      <div className="thendTwo"></div>
    </div>
  </div>
  );
};

export default RouletteWheel;
