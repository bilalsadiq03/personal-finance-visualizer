import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const categories = await db.collection("categories").find({}).sort({ name: 1 }).toArray()

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const category = await request.json()

    // Validate category data
    if (!category.name || !category.color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if category already exists
    const existingCategory = await db.collection("categories").findOne({ name: category.name })

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 })
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json({
      _id: result.insertedId,
      ...category,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}
