import React from 'react'

const Nav2 = () => {
  return (
     <div className="absolute bottom-[0.5] left-1/2 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-full border border-white/25 bg-black/35 px-4 py-1 backdrop-blur">
          <div className="grid min-h-12 grid-cols-1 items-center gap-1 text-center text-xs text-white/90 sm:grid-cols-3 sm:gap-0 sm:text-sm">
            <p>Pilih Tanggal</p>
            <p className="sm:border-x sm:border-white/25"> Pilih lokasi</p>
            <p>Pilih biaya</p>
          </div>
        </div>
  )
}

export default Nav2