import React from 'react';

export default function Controls (props) {
  // Destructure the props

  return (
    // Add the onClick handlers to the buttons and conditionally render the buttons based on the gameStatus
    <div className='controls-container'>
      <button onClick={onHit} className="hitBtn">HIT</button>
      <button onClick={onStand} className="standBtn">STAND</button>
    </div>
  )
}
