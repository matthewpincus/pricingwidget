import type { NextPage } from 'next'
import PricingWidget from '../components/pricing-widget'

const Home: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <PricingWidget />
    </div>
  )
}

export default Home