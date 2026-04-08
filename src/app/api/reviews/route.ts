import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { clientName, rating, comment } = body

  if (!clientName || !rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: {
      clientName: String(clientName).trim(),
      rating: Number(rating),
      comment: String(comment).trim(),
    },
  })

  return NextResponse.json(review, { status: 201 })
}
