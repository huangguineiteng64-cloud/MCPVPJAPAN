const knownProfileUuids: Record<string, string> = {
  gmm_youtube: '7eaa988552384ae4ac020ed99ceebec3',
  _gmm: '7eaa988552384ae4ac020ed99ceebec3',
}

export async function resolveMinecraftUuid(username: string, signal?: AbortSignal) {
  const knownUuid = knownProfileUuids[username.toLowerCase()]
  if (knownUuid) return knownUuid

  const response = await fetch(`/api/minecraft-profile/${encodeURIComponent(username)}`, { signal })
  if (!response.ok) {
    throw new Error(`Minecraft profile lookup returned HTTP ${response.status} for ${username}`)
  }

  const profile: unknown = await response.json()
  if (
    typeof profile !== 'object' ||
    profile === null ||
    !('uuid' in profile) ||
    typeof profile.uuid !== 'string' ||
    !/^[a-f0-9]{32}$/i.test(profile.uuid)
  ) {
    throw new Error(`Minecraft profile lookup returned invalid data for ${username}`)
  }

  return profile.uuid
}

export function getCrafatarSkinUrl(uuid: string) {
  return `https://crafatar.com/skins/${uuid}.png`
}

export function getCrafatarAvatarUrl(uuid: string) {
  return `https://crafatar.com/avatars/${uuid}?size=64&overlay`
}
