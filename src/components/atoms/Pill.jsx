import React from 'react'

const Pill = ({ text, className = '' }) => {
  return (
    <span className={`text-white text-xs font-bold ${className}`}>
      {text}
    </span>
  )
}

export default Pill