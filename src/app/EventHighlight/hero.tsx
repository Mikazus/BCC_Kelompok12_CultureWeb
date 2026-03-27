import Image from 'next/image'
import dashImage from '@/image/dash.png'
import { FaArrowRightLong } from 'react-icons/fa6'
import { HiMiniCalendarDays } from 'react-icons/hi2'
import { HiMapPin } from 'react-icons/hi2'
import { HiMiniTicket } from 'react-icons/hi2'

const Back = () => {
  return (
    <section className="mx-auto  mt-8 w-[92%] max-w-[1352px]">
      <div className="relative overflow-hidden rounded-[26px] border border-[#9f7a3f]/35">
        <Image
          src={dashImage}
          alt="Budaya performance"
          priority
          className="h-[560px] w-full object-cover md:h-[680px] lg:h-[760px]"
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,14,6,0.88)_8%,rgba(20,14,6,0.25)_56%,rgba(20,14,6,0.55)_100%)]" />

        <div className="absolute left-10 top-[120px] max-w-[520px] text-white sm:left-16">
          <h1 className="text-4xl font-semibold leading-tight sm:text-[52px]">
            Temukan Budaya
            <br />
            Rayakan Karya Lokal
          </h1>
          <p className="mt-4 max-w-[440px] text-[13px] leading-6 text-white/80">
            Satu platform untuk semua event budaya dari pertunjukan wayang hingga bazar karya UMKM.
            Dukung acara, pengrajin, hingga komunitas promoter event.
          </p>
        </div>

        
      </div>
    </section>
  )
}

export default Back