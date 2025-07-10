"use client"

import React, { useMemo, useCallback } from "react"
import { ImageResizer } from "@/components/shared/responsiveImage/FloorPlanResizer"
import { ApartmentOverlay } from "@/components/shared/overlay/ApartmentOverlay"

interface FloorPlanImageProps {
  selectedFloorPlan: any
  floorPlanId: string
  originalDimensions: any
  maxDimensions: any
  isMobile: boolean
  apartmentAreas: any[]
  hoveredApartment: number | null
  setHoveredApartment: (id: number | null) => void
  handleApartmentClick: (flatId: number, flatNumber: number) => void
  currentFloor: number | undefined
}

export const FloorPlanImage: React.FC<FloorPlanImageProps> = React.memo(
  ({
    selectedFloorPlan,
    floorPlanId,
    originalDimensions,
    maxDimensions,
    isMobile,
    apartmentAreas,
    hoveredApartment,
    setHoveredApartment,
    handleApartmentClick,
    currentFloor,
  }) => {
    const imagePath = useMemo(() => {
      if (!selectedFloorPlan) return "/placeholder.svg"

      const imageUrl = isMobile ? selectedFloorPlan.mobile_image : selectedFloorPlan.desktop_image

      const baseURL = process.env.NEXT_PUBLIC_IMAGE_URL || (typeof window !== "undefined" ? window.location.origin : "")

      return `${baseURL}/${imageUrl}`
    }, [selectedFloorPlan, isMobile])

    const apartmentOverlays = useCallback(
      ({
        scaleFactorX,
        scaleFactorY,
      }: {
        scaleFactorY: number
        scaleFactorX: number
      }) => (
        <>
          {apartmentAreas.map((area) => (
            <ApartmentOverlay
              key={`${area.flatId}-${currentFloor}`}
              flatId={area.flatId}
              flatNumber={area.flatNumber}
              status={area.status}
              coords={area.coords}
              hoveredApartment={hoveredApartment}
              setHoveredApartment={setHoveredApartment}
              onApartmentClick={handleApartmentClick}
              scaleFactorX={scaleFactorX}
              scaleFactorY={scaleFactorY}
            />
          ))}
        </>
      ),
      [apartmentAreas, hoveredApartment, handleApartmentClick, currentFloor, setHoveredApartment],
    )

    return (
      <div className="flex-1 min-h-0 relative">
        <div className="w-full h-full">
          <ImageResizer
            imageSrc={imagePath}
            altText={`${selectedFloorPlan?.name || "Building"} - Floor ${currentFloor} Plan`}
            originalDimensions={originalDimensions}
            maxDimensions={maxDimensions}
            isMobile={isMobile}
            priority
            key={`plan-${floorPlanId}`}
          >
            {apartmentOverlays}
          </ImageResizer>
        </div>
      </div>
    )
  },
)

FloorPlanImage.displayName = "FloorPlanImage"
