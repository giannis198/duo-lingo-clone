import MobileHeader from '@/components/MobileHeader'
import Sidebar from '@/components/Sidebar'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className='hidden lg:flex' />
      <main className='h-full pt-[50px] lg:pl-[256px] lg:pt-0'>
        <section className='mx-auto h-full max-w-[1056px] pt-6'>
          {children}
        </section>
      </main>
    </>
  )
}

export default MainLayout
