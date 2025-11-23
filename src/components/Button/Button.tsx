
import React, { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant: "primary" | "secondary",
    children: React.ReactNode
}

export default function Button({ children, ...props}:ButtonProps) {
  return (
    <button {...props} className={`${props.className} ${props.variant === 'primary' ? styles.primary : styles.secondary} ${styles.button}`}>
        {children}
    </button>
  )
}
