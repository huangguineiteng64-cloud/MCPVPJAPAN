'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getCrafatarAvatarUrl, resolveMinecraftUuid } from '@/lib/crafatar'

export function RankingAvatar({ playerName }: { playerName: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let disposed = false

    void resolveMinecraftUuid(playerName, controller.signal)
      .then((uuid) => {
        if (!disposed) {
          setAvatarUrl(getCrafatarAvatarUrl(uuid))
        }
      })
      .catch((error: unknown) => {
        if (!disposed && !(error instanceof DOMException && error.name === 'AbortError')) {
          console.error(`Failed to load the Minecraft avatar for ${playerName}:`, error)
          setAvatarUrl('/placeholder-user.jpg')
        }
      })

    return () => {
      disposed = true
      controller.abort()
    }
  }, [playerName])

  return (
    <Image
      src={avatarUrl ?? '/placeholder-user.jpg'}
      alt=""
      width={32}
      height={32}
      unoptimized
      className="size-5 shrink-0 rounded-sm sm:size-8"
    />
  )
}
