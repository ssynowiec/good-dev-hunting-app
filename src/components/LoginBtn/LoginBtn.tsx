'use client'
import { Button } from '@/components/Button/Button'
import { AppRoutes } from '@/utils/routes'
import { usePathname, useRouter } from 'next/navigation'

interface LoginBtnProps {
  children: string
}

const LoginBtn = (props: LoginBtnProps) => {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === AppRoutes.login) {
    return null
  }

  return (
    <Button onClick={() => router.push(AppRoutes.login)} variant={'secondary'}>
      {props.children}
    </Button>
  )
}

export default LoginBtn
