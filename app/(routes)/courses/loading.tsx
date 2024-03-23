import { Loader } from 'lucide-react'

const Loading = () => {
  return (
    <div className='flex h-[100vh] w-full items-center justify-center '>
      <Loader className='h-6 w-6 animate-spin text-muted-foreground' />
    </div>
  )
}

export default Loading
