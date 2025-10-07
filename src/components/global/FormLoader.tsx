import { Loader2 } from 'lucide-react'
import React from 'react'

const FormLoader = () => {
  return (
    <div className='h-full flex items-center justify-center'>
      <Loader2 className='animate-spin h-12 w-12 text-[var(--primary)]' />
    </div>
  )
}

export default FormLoader