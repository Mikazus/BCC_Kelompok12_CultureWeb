import Back from './main'
import Fore from './event'
import NAV from './nav2'
import Kategori from './category'
import Wflow from './flow'
import Review from './review'
import Engage from './engage'
import Footer from './footer'

const DashboardPage = () => {
  return (
    <main className="bg-[#f6f1e9] pb-0 pt-16">
      <Back />
      <NAV />
      <Fore />
      <Kategori />
      <Wflow />
      <Review />
      <Engage />
      <Footer />
      
    </main>
  )
}

export default DashboardPage
