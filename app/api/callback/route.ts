import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code not found' }, { status: 400 });
  }

  try {
    // 1. 認可コードを使ってアクセストークンを取得
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to fetch access token', details: tokenData }, { status: 400 });
    }

    // 2. アクセストークンを使って指定サーバーのユーザーメンバー情報（ロール等）を取得
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const memberData = await memberResponse.json();

    // 3. 取得したロール情報をCookieに保存してトップページ（/）に自動で移動
    const response = NextResponse.redirect(new URL('/', request.url));
    
    response.cookies.set('user_roles', JSON.stringify(memberData.roles || []), {
      httpOnly: false,
      maxAge: 60 * 60 * 24, // 1日間保存
    });

    return response;
  } catch (error) {
    console.error('OAuth Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}