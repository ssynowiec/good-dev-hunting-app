'use client'

import React from 'react'
import styles from './Checkbox.module.scss'
import { IoIosCheckmark } from 'react-icons/io'

interface CheckboxInputProps {
  id: string
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id,
  label,
  checked,
  onChange,
  name,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  }
  return (
    <label className={styles.checkboxLabel} htmlFor={id}>
      <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
        <input
          id={id}
          type="checkbox"
          className={styles.hidden}
          checked={checked}
          onChange={handleCheckboxChange}
          name={name}
        />
        {checked && <IoIosCheckmark className={styles.checkmark} />}
      </div>
      {label}
    </label>
  )
}

export default CheckboxInput