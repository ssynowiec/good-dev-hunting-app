import { CreateProfilePayload, TechStack } from '@/data/frontend/profile/types'
import { sendDiscordNotificationToModeratorChannel } from '@/lib/discord'
import { prisma } from '@/lib/prismaClient'
import { Prisma, PublishingState } from '@prisma/client'
import { serializeProfileToProfileModelSimplified } from './profile.serializer'

export async function getPublishedProfilesPayload() {
  const publishedProfiles = await prisma.profile.findMany({
    where: {
      state: PublishingState.APPROVED,
    },
    include: includeObject,
  })

  const serializedProfile = publishedProfiles.map(
    serializeProfileToProfileModelSimplified,
  )
  return serializedProfile
}

export async function getAllPublishedProfilesPayload() {
  const publishedProfiles = await prisma.profile.findMany({
    where: {
      NOT: {
        state: PublishingState.DRAFT,
      },
    },
    include: includeObject,
  })

  const serializedProfile = publishedProfiles.map(
    serializeProfileToProfileModelSimplified,
  )
  return serializedProfile
}

export async function getProfileById(id: string) {
  const profileById = await prisma.profile.findFirst({
    where: {
      id,
    },
    include: includeObject,
  })

  if (profileById !== null) {
    return serializeProfileToProfileModelSimplified(profileById)
  }

  // Handle the case when profileById is null
  return null
}

export async function doesUserProfileExist(email: string) {
  const foundProfile = await prisma.profile.findFirst({
    where: {
      user: {
        email,
      },
    },
    include: {
      user: true,
      country: true,
      city: true,
      techStack: true,
    },
  })

  return foundProfile
}

export async function createUserProfile(
  email: string,
  profileData: CreateProfilePayload,
) {
  const createdUser = await prisma.profile.create({
    data: {
      user: {
        connect: { email },
      },
      fullName: profileData.fullName,
      linkedIn: profileData.linkedIn,
      bio: profileData.bio,
      country: {
        connectOrCreate: {
          create: {
            name: profileData.country.name,
          },
          where: {
            name: profileData.country.name,
          },
        },
      },
      openForCountryRelocation: profileData.openForCountryRelocation,
      city: {
        connectOrCreate: {
          create: {
            name: profileData.city.name,
          },
          where: {
            name: profileData.city.name,
          },
        },
      },
      openForCityRelocation: profileData.openForCityRelocation,
      remoteOnly: profileData.remoteOnly,
      position: profileData.position,
      seniority: profileData.seniority,
      employmentType: profileData.employmentType,
      state: PublishingState.DRAFT,
    },
    include: includeObject,
  })
  for (const tech of profileData.techStack) {
    await upsertTechnology(tech.techName)
    await createProfileToTechConnection(createdUser.id, tech.techName)
  }
  return createdUser
}

export async function updateUserData(
  id: string,
  userDataToUpdate: Prisma.ProfileUpdateInput,
  techStack?: TechStack,
) {
  const updatedUser = await prisma.profile.update({
    where: {
      id,
    },
    data: userDataToUpdate,
  })
  // update user techStack
  if (techStack) {
    await prisma.technologyOnProfile.deleteMany({
      where: {
        profileId: updatedUser.id,
      },
    })
    for (const tech of techStack) {
      await upsertTechnology(tech.techName)
      await createProfileToTechConnection(updatedUser.id, tech.techName)
    }
  }
  if (userDataToUpdate?.state) {
    sendDiscordNotificationToModeratorChannel(
      `User's ${updatedUser.fullName} profile has got new status: ${userDataToUpdate.state}! Profile: ${process.env.NEXT_PUBLIC_APP_ORIGIN_URL}/dashboard/profile/${updatedUser.userId}`,
    )
  }
  return updatedUser
}

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.profile.findFirst({
    where: { userId },
    include: includeObject,
  })

  if (profile) {
    return serializeProfileToProfileModelSimplified(profile)
  }

  return null
}

export async function getProfileByUserEmail(email: string) {
  const profile = await prisma.profile.findFirst({
    where: { user: { email } },
    include: includeObject,
  })

  if (profile) {
    return serializeProfileToProfileModelSimplified(profile)
  }

  return null
}

export async function getPublishedProfiles(take: number) {
  const publishedProfiles = await prisma.profile.findMany({
    take,
    where: {
      state: PublishingState.APPROVED,
    },
    include: includeObject,
  })
  const serializedProfile = publishedProfiles.map(
    serializeProfileToProfileModelSimplified,
  )
  return serializedProfile
}

export async function getRandomProfiles(profilesCount: number) {
  const totalProfiles = await prisma.profile.count()

  if (profilesCount > totalProfiles) {
    return getPublishedProfiles(6)
  }

  const maxSkipValue = totalProfiles - profilesCount
  const skipValue =
    maxSkipValue > 0 ? Math.floor(Math.random() * maxSkipValue) : 0

  const randomRecords = await prisma.profile.findMany({
    take: profilesCount,
    where: {
      state: PublishingState.APPROVED,
    },
    orderBy: {
      id: 'asc',
    },
    skip: skipValue,
    include: includeObject,
  })

  return randomRecords.map(serializeProfileToProfileModelSimplified)
}

// Due to many to many relationship these 2 functions are kinda necessary to properly update user techstack.
export async function upsertTechnology(techName: string) {
  const technology = await prisma.technology.upsert({
    create: {
      name: techName,
    },
    update: {},
    where: {
      name: techName,
    },
  })
  return technology
}

export async function createProfileToTechConnection(
  profileId: string,
  techName: string,
) {
  const technologyOnProfile = await prisma.technologyOnProfile.create({
    data: {
      techName: techName,
      profileId: profileId,
    },
  })
  return technologyOnProfile
}

// Hence almost all of those queries had such includeObject, i've decided to simply reuse it.
const includeObject = {
  user: {
    include: {
      githubDetails: true,
    },
  },
  country: true,
  city: true,
  techStack: {
    include: {
      technology: true,
    },
  },
}
