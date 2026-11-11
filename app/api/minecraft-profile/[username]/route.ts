import { NextResponse } from 'next/server'

const usernamePattern = /^[a-zA-Z0-9_]{1,16}$/
const uuidPattern = /^[a-f0-9]{32}$/i

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params
  if (!usernamePattern.test(username)) {
    return NextResponse.json({ error: 'Minecraftユーザー名が不正です' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`,
      { next: { revalidate: 86_400 } },
    )
    if (response.status === 404) {
      return NextResponse.json({ error: 'Minecraftプロフィールが見つかりません' }, { status: 404 })
    }
    if (!response.ok) {
      console.error(`Mojang profile lookup returned HTTP ${response.status} for ${username}`)
      return NextResponse.json({ error: 'Minecraftプロフィールを取得できませんでした' }, { status: 502 })
    }

    const profile: unknown = await response.json()
    if (
      typeof profile !== 'object' ||
      profile === null ||
      !('id' in profile) ||
      typeof profile.id !== 'string' ||
      !uuidPattern.test(profile.id)
    ) {
      console.error(`Mojang profile lookup returned invalid data for ${username}`)
      return NextResponse.json({ error: 'Minecraftプロフィールの形式が不正です' }, { status: 502 })
    }

    return NextResponse.json(
      { uuid: profile.id },
      { headers: { 'Cache-Control': 'public, max-age=86400' } },
    )
  } catch (error) {
    console.error(`Failed to look up the Minecraft profile for ${username}:`, error)
    return NextResponse.json({ error: 'Minecraftプロフィールに接続できませんでした' }, { status: 502 })
  }
}
