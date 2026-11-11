'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { SkinViewer } from 'skinview3d'
import { getCrafatarSkinUrl, resolveMinecraftUuid } from '@/lib/crafatar'

export function RankingAvatar({ playerName }: { playerName: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
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
        pixelRatio: Math.min(Math.max(window.devicePixelRatio, 1), 2),
        fov: 36,
      })
    } catch (error) {
      console.error(`Failed to initialize the skin viewer for ${playerName}:`, error)
      setLoadError(true)
      return
    }

    const { skin } = viewer.playerObject
    skin.body.visible = false
    skin.leftArm.visible = false
    skin.rightArm.visible = false
    skin.leftLeg.visible = false
    skin.rightLeg.visible = false

    viewer.autoRotate = false
    viewer.controls.enableRotate = true
    viewer.controls.enableZoom = false
    viewer.controls.enablePan = false
    viewer.controls.target.set(0, 28, 0)
    viewer.camera.position.set(0, 28, 40)
    viewer.zoom = 3
    viewer.controls.update()

    void resolveMinecraftUuid(playerName, controller.signal)
      .then((uuid) => {
        if (disposed) return
        return viewer.loadSkin(getCrafatarSkinUrl(uuid), { model: 'auto-detect' })
      })
      .then(() => {
        if (!disposed) setIsLoaded(true)
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
  }, [playerName])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${playerName}のMinecraftスキンの3D頭部。ドラッグで回転できます`}
      className="relative size-5 shrink-0 touch-none cursor-grab overflow-hidden rounded-sm active:cursor-grabbing sm:size-8"
    >
      {!isLoaded || loadError ? (
        <Image
          src="/placeholder-user.jpg"
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      ) : null}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 size-full ${isLoaded && !loadError ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
