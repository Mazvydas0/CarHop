"use client"

import React, { useEffect, useRef } from 'react'

export function RoadAnimationComponent() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId

    const drawRoad = (offset) => {
      if (!canvas || !ctx) return

      // Set canvas size to full width and fixed height
      canvas.width = window.innerWidth
      canvas.height = 60

      // Draw black road
      ctx.fillStyle = '#333333'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw white lines
      ctx.fillStyle = '#FFFFFF'
      const lineWidth = 50
      const lineHeight = 10
      const gap = 40
      const totalWidth = lineWidth + gap

      for (let x = -totalWidth + offset; x < canvas.width; x += totalWidth) {
        ctx.fillRect(x, canvas.height / 2 - lineHeight / 2, lineWidth, lineHeight)
      }
    }

    let offset = 0
    const animate = () => {
      offset = (offset + 0.5) % 90 // Slow down the animation by reducing the increment
      drawRoad(offset)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        drawRoad(offset)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    };
  }, [])

  return (
    (<div className="w-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[40px]" aria-hidden="true" />
    </div>)
  );
}