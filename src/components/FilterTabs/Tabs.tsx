'use client'
import Tab from './Tab'
import { PublishingState } from '@prisma/client'
import { useModerationFilter } from '@/contexts/ModerationFilterContext'

import styles from './tabs.module.scss'

export const availableTabs: PublishingState[] = Object.values(PublishingState)
  .filter((key) => key !== 'DRAFT')
  .map((key) => PublishingState[key] as PublishingState)

export default function Tabs() {
  const {
    pendingStateCounter,
    setPublishingStateFilter,
    activeTab,
    setActiveTab,
    setEmailSearchValue,
  } = useModerationFilter()

  const setModerationFilter = (tab: PublishingState) => {
    setActiveTab && setActiveTab(PublishingState[tab])
    setPublishingStateFilter && setPublishingStateFilter(tab)
    setEmailSearchValue && setEmailSearchValue('')
  }

  const nameWithCounter = (counter: number, name: string) =>
    counter > 0 ? `${name} (${counter})` : name

  return (
    <div className={styles.tabsWrapper}>
      {availableTabs.map((tab, index) => {
        return (
          <Tab
            key={index}
            active={tab === activeTab}
            name={
              tab === PublishingState.PENDING
                ? nameWithCounter(pendingStateCounter, tab)
                : tab
            }
            action={() => setModerationFilter(PublishingState[tab])}
            counter={0}
          />
        )
      })}
    </div>
  )
}
