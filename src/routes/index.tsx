import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4 tracking-tighter text-[#D4AF37]">
        GOLDEN VAULT XM
      </h1>
      <p className="text-lg mb-8 opacity-80">Precision. Velocity. Insight.</p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Button className="bg-[#D4AF37] text-black hover:bg-[#B8860B] font-bold">
          INITIALIZE TRADING
        </Button>
        <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
          EXPLORE MARKETS
        </Button>
      </div>
    </div>
  )
}
