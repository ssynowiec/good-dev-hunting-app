import { GithubLoginButton } from '@/app/(auth)/(components)/GithubLoginButton/GithubLoginButton'
import { authOptions } from '@/app/(auth)/auth'
import MyProfileBtn from '@/app/(profile)/(components)/MyProfileBtn/MyProfileBtn'
import CreateProfileBtn from '@/app/(profile)/my-profile/(components)/CreateProfileBtn/CreateProfileBtn'
import { findUserByEmail } from '@/backend/user/user.service'
import GithubStarsButton from '@/components/Button/GitHubStarsBtn'
import { Container } from '@/components/Container/Container'
import FindTalentsBtn from '@/components/FindTalentsBtn/FindTalentsBtn'
import LoginBtn from '@/components/LoginBtn/LoginBtn'
import Logo from '@/components/Logo/Logo'
import { getServerSession } from 'next-auth'
import styles from './LandingHeader.module.scss'

const LandingHeader = async () => {
  const session = await getServerSession(authOptions)

  const user = session?.user?.email
    ? await findUserByEmail(session.user.email)
    : null

  if (session) {
    return (
      <header className={styles.wrapper}>
        <Container>
          <div className={styles.headerContent}>
            <Logo />

            <div className={styles.frameButtons}>
              {user?.profile ? (
                <>
                  <GithubStarsButton />
                  <MyProfileBtn />
                </>
              ) : (
                <>
                  <GithubStarsButton />
                  <CreateProfileBtn />
                </>
              )}
            </div>
          </div>
        </Container>
      </header>
    )
  }

  return (
    <header className={styles.wrapper}>
      <Container>
        <div className={styles.headerContent}>
          <Logo />
          <div className={styles.frameButtons}>
            <GithubStarsButton />
            <div className={styles.buttonBoxDesktop}>
              <FindTalentsBtn variant="tertiary" />
              <LoginBtn variant="secondary">Login</LoginBtn>
              <div className={styles.btnSeparator}></div>
              <LoginBtn variant="secondary">Join as Hunter</LoginBtn>
              <CreateProfileBtn />
            </div>
            <div className={styles.buttonBoxMobile}>
              <GithubLoginButton />
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
export default LandingHeader
