'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { FunctionAnimation, SkinViewer } from 'skinview3d'
import { getCrafatarSkinUrl, resolveMinecraftUuid } from '@/lib/crafatar'

export function PodiumSkin({ playerName }: { playerName: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef({ active: false, x: 0, y: 0, pose: -1 })
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
        zoom: 0.62,
      })
    } catch (error) {
      console.error(`Failed to initialize the skin viewer for ${playerName}:`, error)
      setLoadError(true)
      return
    }

    viewer.autoRotate = false
    viewer.globalLight.color.set('#ffe3c2')
    viewer.globalLight.intensity = 2.2
    viewer.cameraLight.color.set('#ffd09a')
    viewer.cameraLight.intensity = 2.8
    viewer.controls.enableRotate = false
    viewer.controls.enableZoom = false
    viewer.controls.enablePan = false
    viewer.controls.target.set(0, 14, 0)
    viewer.camera.position.set(0, 14, 30)
    viewer.controls.update()
    viewer.animation = new FunctionAnimation((player, progress) => {
      const { active, x, y, pose } = pointerRef.current
      const head = player.skin.head
      const leftArm = player.skin.leftArm
      const rightArm = player.skin.rightArm
      const leftLeg = player.skin.leftLeg
      const rightLeg = player.skin.rightLeg

      head.rotation.set(active ? y * 0.22 : -0.05, active ? x * 0.35 : 0.1, -0.04)
      leftArm.rotation.set(-0.08, 0, 0.13)
      rightArm.rotation.set(-0.08, 0, -0.13)
      leftLeg.rotation.set(0, 0, 0)
      rightLeg.rotation.set(0, 0, 0)
      player.skin.body.rotation.set(0, -0.08, 0)

      if (!active) return

      const wave = Math.sin(progress * 5) * 0.14
      if (pose === 0) {
        rightArm.rotation.z = -2.55 + wave
        rightArm.rotation.x = -0.25
      } else if (pose === 1) {
        leftArm.rotation.z = 2.55 - wave
        leftArm.rotation.x = -0.25
      } else if (pose === 2) {
        leftArm.rotation.z = 1.15
        rightArm.rotation.z = -1.15
        leftArm.rotation.x = -0.2
        rightArm.rotation.x = -0.2
      } else {
        leftArm.rotation.z = 2.7
        rightArm.rotation.z = -2.7
        leftLeg.rotation.x = -0.25
        rightLeg.rotation.x = -0.25
      }
    })

    void resolveMinecraftUuid(playerName, controller.signal)
      .then((uuid) => viewer.loadSkin(getCrafatarSkinUrl(uuid), { model: 'auto-detect' }))
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

  const lookAtPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerRef.current.active = true
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    pointerRef.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
  }

  const startPose = () => {
    pointerRef.current.pose = (pointerRef.current.pose + 1) % 4
    pointerRef.current.active = true
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      role="img"
      aria-label={`${playerName}のMinecraftスキン。カーソルを合わせると視線を追い、ポーズが切り替わります`}
      onPointerEnter={(event) => {
        startPose()
        lookAtPointer(event)
      }}
      onPointerMove={lookAtPointer}
      onPointerLeave={() => {
        pointerRef.current.active = false
      }}
      onFocus={startPose}
      onBlur={() => {
        pointerRef.current.active = false
      }}
      tabIndex={0}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[15%] top-[12%] z-0 h-3/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,176,82,0.28),rgba(255,140,48,0.1)_42%,transparent_72%)] blur-md"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[4%] left-1/4 z-0 h-4 w-1/2 rounded-[50%] bg-black/75 blur-md"
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 block h-full w-full"
        style={{ filter: 'brightness(1.7) drop-shadow(0 5px 5px rgb(0 0 0 / 55%))' }}
      />
      {loadError && (
        <span className="absolute inset-0 grid place-items-center bg-black/70 px-2 text-center text-xs text-red-200">
          スキンを読み込めませんでした
        </span>
      )}
    </div>
  )
}
