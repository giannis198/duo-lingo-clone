'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [previousYear, setPreviousYear] = useState(currentYear) // Track previous year

  useEffect(() => {
    const updateYear = () => {
      const newYear = new Date().getFullYear()
      if (newYear > previousYear) {
        // Check if it's a new year
        setCurrentYear(newYear)
        setPreviousYear(newYear) // Update stored year
      }
    }

    // Update initially and schedule an annual update
    updateYear()
    const intervalId = setInterval(updateYear, 31536000000) // One year in milliseconds

    return () => clearInterval(intervalId) // Cleanup function to stop interval on unmount
  }, [previousYear]) // Dependency on previousYear to trigger on change

  return (
    <div className='flex items-center justify-center'>
      <div className='flex items-center justify-between gap-x-1'>
        <p>Coded with</p>
        <Image src='/heart.svg' alt='heart' width={16} height={16} />
        by
        <Link
          href='https://www.linkedin.com/in/ioannis-nikitopoulos-547a99122/'
          className='text-green-700'
        >
          Ioannis Nik.
        </Link>
        @{currentYear}
      </div>
    </div>
  )
}

export default Footer
