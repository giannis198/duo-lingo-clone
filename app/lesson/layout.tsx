type LessonLayoutProps = {
  children: React.ReactNode
}

const LessonLayout = ({ children }: LessonLayoutProps) => {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-full w-full flex-col'>{children}</div>
    </div>
  )
}

export default LessonLayout
