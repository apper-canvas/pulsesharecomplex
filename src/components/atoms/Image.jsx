import React from 'react'

const Image = ({ src, alt, className = '' }) => {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`w-full h-64 object-cover ${className}`}
        loading="lazy"
      />
    </div>
  )
}

export default Image