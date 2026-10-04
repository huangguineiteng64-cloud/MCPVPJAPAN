'use client'

import { useEffect, useRef, useState } from 'react'
import { FunctionAnimation, SkinViewer } from 'skinview3d'
import styles from './minecraft-skin.module.css'

const skinTextureUrl = 'https://crafatar.com/skins/7eaa988552384ae4ac020ed99ceebec3.png'

export function MinecraftSkin() {
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
    viewer.zoom = 1.5
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

    void viewer.loadSkin(skinTextureUrl, { model: 'auto-detect' }).catch(() => {
      if (!disposed) setLoadError(true)
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
      resizeObserver.disconnect()
      viewer.dispose()
    }
  }, [])

  return (
    <a
      href="https://namemc.com/profile/_GMM"
      target="_blank"
      rel="noreferrer"
      aria-label="_gmmのNameMCプロフィールを開く"
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
        className={styles.scene}
        role="img"
        aria-label="_gmmのMinecraftスキン。標準のMinecraft 3Dモデル"
      >
        <canvas ref={canvasRef} className={styles.canvas} />
        {loadError && <span className={styles.error}>3Dスキンを読み込めませんでした</span>}
      </div>
    </a>
  )
}
