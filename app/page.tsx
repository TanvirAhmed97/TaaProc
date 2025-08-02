"use client"

import { useState, useEffect } from "react"
import { WalletProvider } from "@/contexts/wallet-context"
import { WalletConnection } from "@/components/wallet-connection"
import { Portfolio } from "@/components/portfolio"
import { TokenSwap } from "@/components/token-swap"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { TokenCreator } from "@/components/token-creator"
import { StakingPool } from "@/components/staking-pool"
import { DAOGovernance } from "@/components/dao-governance"
import { ContractInteraction } from "@/components/contract-interaction"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  ArrowUpDown,
  ImageIcon,
  Coins,
  Layers,
  Vote,
  Code,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react"

interface MarketData {
  ethereum: { usd: number; usd_24h_change: number }
  bitcoin: { usd: number; usd_24h_change: number }
  "usd-coin": { usd: number; usd_24h_change: number }
  uniswap: { usd: number; usd_24h_change: number }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin,uniswap&vs_currencies=usd&include_24hr_change=true",
        )
        const data = await response.json()
        setMarketData(data)
      } catch (error) {
        console.error("Failed to fetch market data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/50">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      TaaFi Protocol Hub
                    </h1>
                    <p className="text-sm text-gray-400">Advanced Web3 Platform</p>
                  </div>
                </div>
                <WalletConnection />
              </div>
            </div>
          </header>

          {/* Market Data Banner */}
          <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-6 overflow-x-auto">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                  <span className="text-gray-400">Live Prices:</span>
                </div>
                {isLoading ? (
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : marketData ? (
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">ETH:</span>
                      <span className="font-semibold">{formatPrice(marketData.ethereum.usd)}</span>
                      <Badge
                        variant={marketData.ethereum.usd_24h_change >= 0 ? "default" : "destructive"}
                        className="text-xs animate-pulse"
                      >
                        {formatChange(marketData.ethereum.usd_24h_change)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">BTC:</span>
                      <span className="font-semibold">{formatPrice(marketData.bitcoin.usd)}</span>
                      <Badge
                        variant={marketData.bitcoin.usd_24h_change >= 0 ? "default" : "destructive"}
                        className="text-xs animate-pulse"
                      >
                        {formatChange(marketData.bitcoin.usd_24h_change)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">USDC:</span>
                      <span className="font-semibold">{formatPrice(marketData["usd-coin"].usd)}</span>
                      <Badge
                        variant={marketData["usd-coin"].usd_24h_change >= 0 ? "default" : "destructive"}
                        className="text-xs animate-pulse"
                      >
                        {formatChange(marketData["usd-coin"].usd_24h_change)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">UNI:</span>
                      <span className="font-semibold">{formatPrice(marketData.uniswap.usd)}</span>
                      <Badge
                        variant={marketData.uniswap.usd_24h_change >= 0 ? "default" : "destructive"}
                        className="text-xs animate-pulse"
                      >
                        {formatChange(marketData.uniswap.usd_24h_change)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <span className="text-red-400">Failed to load market data</span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <TabsTrigger
                  value="portfolio"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
                <TabsTrigger
                  value="swap"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Swap</span>
                </TabsTrigger>
                <TabsTrigger
                  value="nft"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">NFTs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="create"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <Coins className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stake"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Stake</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dao"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <Vote className="h-4 w-4" />
                  <span className="hidden sm:inline">DAO</span>
                </TabsTrigger>
                <TabsTrigger
                  value="contracts"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Contracts</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 transition-all duration-300"
                >
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              <div className="animate-fadeIn">
                <TabsContent value="portfolio" className="space-y-6">
                  <Portfolio />
                </TabsContent>

                <TabsContent value="swap" className="space-y-6">
                  <TokenSwap />
                </TabsContent>

                <TabsContent value="nft" className="space-y-6">
                  <NFTMarketplace />
                </TabsContent>

                <TabsContent value="create" className="space-y-6">
                  <TokenCreator />
                </TabsContent>

                <TabsContent value="stake" className="space-y-6">
                  <StakingPool />
                </TabsContent>

                <TabsContent value="dao" className="space-y-6">
                  <DAOGovernance />
                </TabsContent>

                <TabsContent value="contracts" className="space-y-6">
                  <ContractInteraction />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Market Analytics
                      </CardTitle>
                      <CardDescription>Real-time cryptocurrency market data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {marketData &&
                          Object.entries(marketData).map(([key, data]) => (
                            <Card key={key} className="bg-slate-700/50 border-slate-600">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-400 uppercase">{key.replace("-", " ")}</p>
                                    <p className="text-xl font-bold text-white">{formatPrice(data.usd)}</p>
                                  </div>
                                  <Badge
                                    variant={data.usd_24h_change >= 0 ? "default" : "destructive"}
                                    className="animate-pulse"
                                  >
                                    {formatChange(data.usd_24h_change)}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/50 backdrop-blur-sm bg-slate-900/50 mt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-400">
                <p>&copy; 2024 DeFi Protocol Hub. Built with Next.js and Web3 technologies.</p>
                <p className="text-sm mt-2">Real-time data powered by CoinGecko API</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </WalletProvider>
  )
}
