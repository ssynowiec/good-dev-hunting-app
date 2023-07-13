import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import styles from './page.module.scss'
import PersonalInfo from '@/components/CreateProfile/PersonalInfo/PersonalInfo'
import LocationPreferences from '@/components/CreateProfile/LocationPreferences/LocationPreferences'
import CreateProfileHeader from '@/components/CreateProfile/CreateProfileHeader/CreateProfileHeader'
import WorkInformation from '@/components/CreateProfile/WorkInformation/WorkInformation'
import CreateProfileFormWrapper from '@/components/CreateProfileFormWrapper/CreateProfileFormWrapper'
const CreateProfilePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <CreateProfileFormWrapper>
      <div className={styles.wrapper}>
        <CreateProfileHeader />
        <div className={styles.formBox}>
          <PersonalInfo />
          <LocationPreferences />
          <WorkInformation />
        </div>
      </div>
    </CreateProfileFormWrapper>
  )
}

export default CreateProfilePage
