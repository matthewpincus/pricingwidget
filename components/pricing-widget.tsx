'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, PlusCircle, Zap } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js';

// Placeholder for Slider component
interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ value, onValueChange, max, step, className }) => (
  <input
    type="range"
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value)])}
    max={max}
    step={step}
    className={className}
  />
)

// Remove the IconPlaceholder component as we'll use real icons now

const plans = {
  Now: {
    baseRate: 2,
    setupFee: 100,
    additionalMinuteRate: 2.50
  },
  Flow: {
    baseRate: 3,
    setupFee: 500,
    additionalMinuteRate: 3.50
  }
} as const

const baseFee = 200

export default function CMRSlider() {
  const [product, setProduct] = useState<'Now' | 'Flow'>('Now')
  const [minutes, setMinutes] = useState(300)

  const calculateTotalCost = (mins: number) => {
    return baseFee + (mins * plans[product].baseRate)
  }

  const handleGetStarted = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          minutes,
          totalCost: calculateTotalCost(minutes),
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex relative">
        {(['Now', 'Flow'] as const).map((plan) => (
          <div
            key={plan}
            onClick={() => setProduct(plan)}
            className={`cursor-pointer transition-all duration-300 ease-in-out ${
              product === plan
                ? 'w-[55%] bg-[#3bb573] text-white z-10 shadow-lg'
                : 'w-[50%] bg-gray-100 text-gray-600'
            } p-4 text-center`}
          >
            <h2 className="text-xl font-bold">{plan}</h2>
            <p className="text-sm">${plans[plan].baseRate}/min</p>
          </div>
        ))}
      </div>
      <CardContent className="p-6">
        <div className="mb-6">
          <Slider
            value={[minutes]}
            onValueChange={(value: number[]) => setMinutes(value[0])}
            max={1000}
            step={100}
            className="w-full"
          />
        </div>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-[#3bb573] mb-2">{minutes} minutes</p>
          <p className="text-3xl font-semibold">${calculateTotalCost(minutes).toFixed(2)}/month</p>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-[#3bb573]" />
            <span className="font-semibold">$200 base fee</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-6 h-6 mr-2 text-[#3bb573]" />
            <span>{minutes} minutes @ <span className="font-semibold">${plans[product].baseRate}/min</span></span>
          </div>
          <div className="flex items-center">
            <PlusCircle className="w-6 h-6 mr-2 text-[#3bb573]" />
            <span>Additional minutes: <span className="font-semibold">${plans[product].additionalMinuteRate.toFixed(2)}/min</span></span>
          </div>
          <div className="flex items-center">
            <Zap className="w-6 h-6 mr-2 text-[#3bb573]" />
            <span>One-time setup fee: <span className="font-semibold">${plans[product].setupFee}</span></span>
          </div>
        </div>
        <Button 
          onClick={handleGetStarted} 
          className="w-full bg-[#3bb573] hover:bg-[#2a9960] text-white mb-4"
        >
          Get Started
        </Button>
        <p className="text-center text-sm text-gray-600">No long term commitment required</p>
      </CardContent>
    </Card>
  )
}