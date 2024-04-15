'use client'
import ModerationBtn from '@/app/(profile)/moderation/(components)/ModerationBtn/ModerationBtn'
import CreateProfileBtn from '@/app/(profile)/my-profile/(components)/CreateProfileBtn/CreateProfileBtn'
import { Button } from '@/components/Button/Button'
import MobileGitHubStarsBtn from '@/components/Button/MobileGitHubStarsBtn'
import LoginBtn from '@/components/LoginBtn/LoginBtn'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import GithubAcc from '../GithubAcc/GithubAcc'
import HunterAcc from '../HunterAcc/HunterAcc'
import LogOutBtn from '../LogOutBtn/LogOutBtn'
import styles from './HamburgerMenuMobileBtn.module.scss'

const HamburgerMenuMobileBtn = ({
  userHasProfile,
  userIsModerator,
  userIsHunter,
}: {
  userHasProfile?: boolean | null | undefined
  userIsModerator?: boolean | null | undefined
  userIsHunter?: boolean | null | undefined
}) => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className={styles.menu}>
      <Button onClick={handleOpenMenu} variant="standard">
        {isMenuOpen ? 'X' : 'Menu'}
      </Button>
      {isMenuOpen && (
        <>
          <div className={styles.overlay} onClick={handleCloseMenu}></div>
          <div className={styles.hamburger}>
            {userHasProfile ? (
              <>
                <div className={styles.wrapper}>
                  <GithubAcc />
                  {userIsModerator && <ModerationBtn />}
                </div>
                <MobileGitHubStarsBtn />
              </>
            ) : (
              <>
                <div className={styles.wrapper}>
                  {userIsHunter ? (
                    <>
                      <HunterAcc />
                      <LogOutBtn />
                    </>
                  ) : (
                    <>
                      <CreateProfileBtn data-testid="create-profile-button" />
                      {session?.user && <LogOutBtn />}
                    </>
                  )}
                  {userIsModerator && <ModerationBtn />}

                  {!session?.user && (
                    <LoginBtn variant={'secondary'}>Join as hunter</LoginBtn>
                  )}
                </div>

                <MobileGitHubStarsBtn />
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default HamburgerMenuMobileBtn