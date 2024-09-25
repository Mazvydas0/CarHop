'use client'

import FindForm from "@/components/home/FindForm"
import TripList from "@/components/home/TripList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Calendar, Clock, MapPin, Star } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const upcomingTrips = [
    { id: 1, driver: "John Doe", rating: 4.8, origin: "New York", destination: "Boston", date: "2023-06-15", price: 45 },
    { id: 2, driver: "Jane Smith", rating: 4.9, origin: "Los Angeles", destination: "San Francisco", date: "2023-06-16", price: 60 },
    { id: 3, driver: "Bob Johnson", rating: 4.7, origin: "Chicago", destination: "Detroit", date: "2023-06-17", price: 40 },
  ]

  return (
    (<div className="container mx-auto p-4">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr] pt-4">
        <FindForm />

        <TripList upcomingTrips={upcomingTrips}/>
      </div>
    </div>)
  );
}