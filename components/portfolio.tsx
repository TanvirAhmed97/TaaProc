"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Wallet, Activity, DollarSign, PieChart } from "lucide-react"

const MOCK_PORTFOLIO = {
  totalValue: "45,678.90",
  totalChange: "+12.5",
  totalChangePercent: "+3.8",
  tokens: [
    { symbol: "ETH", amount: "12.5", value: "31,250.00", change: "+5.2", changePercent: "+2.1" },
    { symbol: "USDC", amount: "8,500", value: "8,500.00", change: "0.00", changePercent: "0.0" },
    { symbol: "UNI", amount: "450", value: "3,150.00", change: "+180.50", changePercent: "+6.1" },
    { symbol: "WBTC", amount: "0.08", value: "2,778.90", change: "-45.20", changePercent: "-1.6" },
  ],
  nfts: [
    { name: "Bored Ape #1234", collection: "BAYC", value: "45.2", image: "/placeholder.svg?height=100&width=100" },
    {
      name: "CryptoPunk #5678",
      collection: "CryptoPunks",
      value: "78.5",
      image: "/placeholder.svg?height=100&width=100",
    },
    { name: "Azuki #9012", collection: "Azuki", value: "12.8", image: "/placeholder.svg?height=100&width=100" },
  ],
  defiPositions: [
    { protocol: "Uniswap V3", position: "ETH/USDC LP", value: "5,420.00", apy: "8.5" },
    { protocol: "Compound", position: "USDC Lending", value: "2,100.00", apy: "4.2" },
    { protocol: "Aave", position: "ETH Collateral", value: "8,900.00", apy: "3.8" },
  ],
}

export function Portfolio() {
  const { isConnected, account, balance } = useWallet()
  const [timeframe, setTimeframe] = useState("24h")

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to view your portfolio</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">${MOCK_PORTFOLIO.totalValue}</p>
                <p className="text-sm text-green-400">
                  {MOCK_PORTFOLIO.totalChange} ({MOCK_PORTFOLIO.totalChangePercent}%)
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Wallet Balance</p>
                <p className="text-2xl font-bold text-white">{Number.parseFloat(balance).toFixed(4)} ETH</p>
                <p className="text-sm text-gray-400">~${(Number.parseFloat(balance) * 2500).toFixed(2)}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">DeFi Positions</p>
                <p className="text-2xl font-bold text-white">$16,420</p>
                <p className="text-sm text-green-400">+2.1%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">NFT Collection</p>
                <p className="text-2xl font-bold text-white">136.5 ETH</p>
                <p className="text-sm text-red-400">-1.8%</p>
              </div>
              <PieChart className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tokens" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Token Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_PORTFOLIO.tokens.map((token, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{token.symbol}</p>
                        <p className="text-sm text-gray-400">{token.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${token.value}</p>
                      <p
                        className={`text-sm ${token.changePercent.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {token.change} ({token.changePercent}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_PORTFOLIO.nfts.map((nft, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <img
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white">{nft.name}</h3>
                    <p className="text-sm text-gray-400">{nft.collection}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Floor Price</span>
                      <span className="font-semibold text-white">{nft.value} ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="defi">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">DeFi Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_PORTFOLIO.defiPositions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{position.protocol}</p>
                      <p className="text-sm text-gray-400">{position.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${position.value}</p>
                      <Badge className="bg-green-500 text-white">{position.apy}% APY</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Received ETH</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-400">+2.5 ETH</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Uniswap Swap</p>
                      <p className="text-sm text-gray-400">1 day ago</p>
                    </div>
                  </div>
                  <p className="font-semibold text-white">1 ETH → 2,500 USDC</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Sent USDC</p>
                      <p className="text-sm text-gray-400">3 days ago</p>
                    </div>
                  </div>
                  <p className="font-semibold text-red-400">-1,000 USDC</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
