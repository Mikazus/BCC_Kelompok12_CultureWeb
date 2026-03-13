import Back from './main'
import Fore from './event'
import NAV from './nav2'
import Kategori from './kategori'
import CaraKerja from './ckerja'
import Review from './review'
import Engage from './engage'
import Footer from './footer'

const DashboardPage = () => {
  return (
    <main className="bg-[#f6f1e9] pb-16 pt-16">
      <Back />
      <NAV />
      <Fore />
      <Kategori />
      <CaraKerja />
      <Review />
      <Engage />
      <Footer />
      
    </main>
  )
}

export default DashboardPage
