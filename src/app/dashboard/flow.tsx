import { CalendarCheck2, Search, Ticket, UserPlus } from 'lucide-react'

const flowSteps = [
    {
        title: 'Daftar Akun',
        desc: 'Buat akun gratis dengan email atau Google.',
        icon: UserPlus
    },
    {
        title: 'Cari Event',
        desc: 'Cari ratusan event budaya berdasarkan kategori, biaya, tanggal, atau lokasi di Malang.',
        icon: Search
    },
    {
        title: 'Daftar & Bayar',
        desc: 'Pilih event, lengkapi pendaftaran, dan bayar tiket dengan berbagai metode pembayaran.',
        icon: Ticket
    },
    {
        title: 'Nikmati Event',
        desc: 'Tunjukkan e-tiket di lokasi, dan nikmati pengalaman budaya yang tak terlupakan.',
        icon: CalendarCheck2
    }
]

const Flow = () => {
    return (
        <section id="cara-kerja" className="relative mx-auto mt-12 w-[92%] max-w-338 scroll-mt-28 pb-10 text-[#2d2214]">
            <div className="mb-8 max-w-2xl">
                <p className="  px-2 py-1 text-xl font-semibold text-black">
                Panduan
                </p>
                <h2 className="mt-3 text-5xl font-semibold leading-tight">Cara Kerja</h2>
                <p className="mt-2 text-3xl leading-relaxed text-[#3c2f1e]">
                    Mulai dari daftar akun sampai menghadiri event hanya dalam beberapa langkah mudah.
                </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-[#6f5737] bg-[#f7f2ea]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                    {flowSteps.map((item, index) => {
                        const Icon = item.icon

                        return (
                            <article
                                key={item.title}
                                className="relative min-h-72 border-[#6f5737]/60 px-8 py-7 md:border-r xl:last:border-r-0"
                            >
                                <span className="absolute right-6 top-5 text-6xl font-semibold tracking-tight text-[#8c8c8c]/70">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <Icon className="h-10 w-10 text-[#4a3820]" aria-hidden="true" />
                                <h3 className="mt-7 text-3xl font-semibold leading-tight">{item.title}</h3>
                                <p className="mt-3 max-w-xs text-xl leading-relaxed text-[#2f2415]">{item.desc}</p>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Flow