import React from 'react'
import Button from '@/components/atoms/Button'

const PrimaryButton = ({ children, onClick, className = '', disabled = false, ...props }) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  )
}

export default PrimaryButton