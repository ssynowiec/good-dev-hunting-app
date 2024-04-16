import ContactBtn from '@/app/(profile)/(components)/ContactForm/ContactBtn/ContactBtn'
import { findProfileById } from '@/app/(profile)/_actions'
import { ProfileModel } from '@/app/(profile)/_models/profile.model'
import { Button } from '@/components/Button/Button'
import GoBackButton from '@/components/GoBackButton/GoBackButton'
import SocialItems from '@/components/SocialItems/SocialItems'
import classNames from 'classnames/bind'
import { type UserProfileHeaderType } from '../types'
import styles from './UserProfileHeader.module.scss'

const cx = classNames.bind(styles)

export default async function UserProfileHeader({
  profileId,
  withBackButton,
  isNerdbordConnected,
}: UserProfileHeaderType) {
  const profile = await findProfileById(profileId)
  const mappedProfile = new ProfileModel(profile)

  const socialItemCount =
    (mappedProfile.githubUsername ? 1 : 0) +
    (profile.linkedIn ? 1 : 0) +
    (mappedProfile.githubUsername && isNerdbordConnected ? 1 : 0)

  const commonClasses = cx('wrapper', {
    [styles.withBackBackButton]: !!withBackButton,
  })

  const wrapClasses = cx({
    [styles.actions]: true,
    [styles.wrap]: socialItemCount > 1,
  })

  return (
    <div className={commonClasses}>
      {withBackButton && (
        <div className={styles.hideOnMobile}>
          <GoBackButton>Go back</GoBackButton>
        </div>
      )}
      <div className={wrapClasses}>
        <div className={styles.socialItemsWrapper}>
          <SocialItems
            githubUsername={mappedProfile.githubUsername}
            linkedIn={mappedProfile.linkedIn}
            isNerdbordConnected={isNerdbordConnected}
          />
        </div>
        {profile.isOpenForWork ? (
          <div className={styles.buttonWrapper}>
            <ContactBtn />
          </div>
        ) : (
          <Button variant={'primary'} disabled>
            Not available for new projects
          </Button>
        )}
      </div>
    </div>
  )
}
