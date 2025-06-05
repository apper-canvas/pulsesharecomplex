import React from 'react'

const Text = ({
  type,
  children,
  className = '',
  ...props
}) => {
  switch (type) {
    case 'h1':
      return <h1 className={`${className}`} {...props}>{children}</h1>
    case 'h2':
      return <h2 className={`${className}`} {...props}>{children}</h2>
    case 'h3':
      return <h3 className={`${className}`} {...props}>{children}</h3>
    case 'h4':
      return <h4 className={`${className}`} {...props}>{children}</h4>
    case 'p':
      return <p className={`${className}`} {...props}>{children}</p>
    case 'span':
      return <span className={`${className}`} {...props}>{children}</span>
    case 'small':
      return <small className={`${className}`} {...props}>{children}</small>
    default:
      return <span className={`${className}`} {...props}>{children}</span>
  }
}

export default Text