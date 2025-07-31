"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000" },
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86a33E6441b8C4505B8C4505B8C4505B8C4505" },
  { symbol: "USDT", name: "Tether", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
  { symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
]

export function TokenSwap() {
  const { isConnected, signer } = useWallet()
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const simulateSwap = async () => {
    if (!isConnected || !signer) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      // Simulate price calculation (in real app, you'd use Uniswap/1inch APIs)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockRate = Math.random() * 2000 + 1000 // Mock exchange rate
      const calculatedAmount = (Number.parseFloat(fromAmount) * mockRate).toFixed(6)
      setToAmount(calculatedAmount)

      toast({
        title: "Success",
        description: `Swap simulated: ${fromAmount} ${fromToken} → ${calculatedAmount} ${toToken}`,
      })
    } catch (error) {
      toast({ title: "Error", description: "Swap simulation failed", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to start swapping tokens</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowUpDown className="h-5 w-5" />
            Token Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">From</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {TOKENS.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={handleSwapTokens}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">To</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {TOKENS.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Slippage Tolerance</Label>
              <Select value={slippage} onValueChange={setSlippage}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="0.1">0.1%</SelectItem>
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1.0">1.0%</SelectItem>
                  <SelectItem value="3.0">3.0%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={simulateSwap}
            disabled={isLoading || !fromAmount}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            {isLoading ? "Calculating..." : "Simulate Swap"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5" />
            Swap Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Exchange Rate</span>
              <span>
                1 {fromToken} = ~1,500 {toToken}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Price Impact</span>
              <span className="text-green-400">{"<0.01%"}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Minimum Received</span>
              <span>
                {toAmount ? (Number.parseFloat(toAmount) * 0.995).toFixed(6) : "0"} {toToken}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Network Fee</span>
              <span>~$5.20</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-600">
            <p className="text-xs text-gray-400">
              This is a simulation. In a real implementation, this would connect to DEX protocols like Uniswap,
              SushiSwap, or 1inch for actual token swapping.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
