'use client'

import { useEffect, useRef, useState } from 'react'
import { FunctionAnimation, SkinViewer } from 'skinview3d'
import { getCrafatarSkinUrl, resolveMinecraftUuid } from '@/lib/crafatar'
import styles from './minecraft-skin.module.css'

export function MinecraftSkin({
  playerName = '_GMM',
  profile = false,
}: {
  playerName?: string
  profile?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isHoveredRef = useRef(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let viewer: SkinViewer
    let disposed = false
    const controller = new AbortController()

    try {
      viewer = new SkinViewer({
        canvas,
        width: container.clientWidth,
        height: container.clientHeight,
        pixelRatio: Math.min(Math.max(window.devicePixelRatio, 2), 3),
        fov: 38,
      })
    } catch {
      setLoadError(true)
      return
    }

    viewer.autoRotate = false
    viewer.controls.enableRotate = false
    viewer.controls.enableZoom = false
    viewer.controls.enablePan = false
    viewer.zoom = profile ? 3.75 : 1.5
    viewer.controls.target.set(0, 10, 0)
    viewer.camera.position.set(0, 10, 28)
    viewer.controls.update()
    viewer.animation = new FunctionAnimation((player, progress) => {
      if (!isHoveredRef.current) {
        player.skin.head.rotation.x = 0
        player.skin.leftArm.rotation.x = 0
        player.skin.rightArm.rotation.x = 0
        player.skin.rightArm.rotation.z = 0
        return
      }

      player.skin.head.rotation.x = 0
      player.skin.leftArm.rotation.x = 0
      player.skin.rightArm.rotation.x = 0
      player.skin.rightArm.rotation.z = -2.7 + Math.sin(progress * 3) * 0.12
    })

    void resolveMinecraftUuid(playerName, controller.signal)
      .then((uuid) => {
        if (disposed) return
        return viewer.loadSkin(getCrafatarSkinUrl(uuid), { model: 'auto-detect' })
      })
      .catch((error: unknown) => {
        if (!disposed && !(error instanceof DOMException && error.name === 'AbortError')) {
          console.error(`Failed to load the Minecraft skin for ${playerName}:`, error)
          setLoadError(true)
        }
      })

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || disposed) return
      viewer.setSize(
        Math.max(1, Math.round(entry.contentRect.width)),
        Math.max(1, Math.round(entry.contentRect.height)),
      )
    })
    resizeObserver.observe(container)

    return () => {
      disposed = true
      controller.abort()
      resizeObserver.disconnect()
      viewer.dispose()
    }
  }, [playerName, profile])

  return (
    <a
      href={`https://namemc.com/profile/${encodeURIComponent(playerName)}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`${playerName}のNameMCプロフィールを開く`}
      className={styles.link}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
          isHoveredRef.current = true
        }
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false
      }}
    >
      <div
        ref={containerRef}
        className={profile ? styles.profileScene : styles.scene}
        role="img"
        aria-label={`${playerName}のMinecraftスキン。標準のMinecraft 3Dモデル`}
      >
        <canvas ref={canvasRef} className={styles.canvas} />
        {loadError && <span className={styles.error}>3Dスキンを読み込めませんでした</span>}
      </div>
    </a>
  )
}
