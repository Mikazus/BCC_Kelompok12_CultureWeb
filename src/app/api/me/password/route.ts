import { NextRequest, NextResponse } from "next/server"

const DEFAULT_API_BASE_URL = "https://event-budaya.iccn.or.id/api"

const resolveApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL

export async function PATCH(request: NextRequest) {
  const authorization = request.headers.get("authorization") || ""
  if (!authorization) {
    return NextResponse.json({ message: "Authorization header tidak ditemukan." }, { status: 401 })
  }

  const payload = await request.json()

  const response = await fetch(`${resolveApiBaseUrl()}/me/password`, {
    method: "PATCH",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const raw = await response.text()
  try {
    const parsed = JSON.parse(raw)
    return NextResponse.json(parsed, { status: response.status })
  } catch {
    return NextResponse.json({ message: raw || "Terjadi kesalahan saat ubah password." }, { status: response.status })
  }
}
