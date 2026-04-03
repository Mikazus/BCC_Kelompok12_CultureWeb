import { NextRequest, NextResponse } from "next/server"

const DEFAULT_API_BASE_URL = "https://event-budaya.iccn.or.id/api"

const resolveApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const authorization = request.headers.get("authorization") || ""
  if (!authorization) {
    return NextResponse.json({ message: "Authorization header tidak ditemukan." }, { status: 401 })
  }

  const { id } = await context.params
  const safeId = id?.trim()

  if (!safeId) {
    return NextResponse.json({ message: "ID tiket wajib diisi." }, { status: 400 })
  }

  const response = await fetch(`${resolveApiBaseUrl()}/me/tickets/${encodeURIComponent(safeId)}/download`, {
    method: "GET",
    headers: {
      Authorization: authorization,
    },
    cache: "no-store",
  })

  const contentType = response.headers.get("content-type") || ""

  if (!response.ok) {
    const raw = await response.text()
    try {
      const parsed = JSON.parse(raw)
      return NextResponse.json(parsed, { status: response.status })
    } catch {
      return NextResponse.json({ message: raw || "Gagal mengunduh tiket." }, { status: response.status })
    }
  }

  if (contentType.includes("application/json")) {
    const raw = await response.text()
    try {
      const parsed = JSON.parse(raw)
      return NextResponse.json(parsed, { status: response.status })
    } catch {
      return NextResponse.json({ message: raw || "Respons download tidak valid." }, { status: response.status })
    }
  }

  const arrayBuffer = await response.arrayBuffer()
  const contentDisposition = response.headers.get("content-disposition")

  return new NextResponse(arrayBuffer, {
    status: response.status,
    headers: {
      "Content-Type": contentType || "application/pdf",
      ...(contentDisposition ? { "Content-Disposition": contentDisposition } : {}),
    },
  })
}
