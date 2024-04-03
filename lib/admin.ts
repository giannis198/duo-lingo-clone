import { auth } from '@clerk/nextjs'

const adminIds = [process.env.NEXT_PUBLIC_ADMIN_ID]

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  return adminIds.indexOf(userId) !== -1
}
