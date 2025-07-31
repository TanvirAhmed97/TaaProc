"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, RefreshCw } from "lucide-react"

const NETWORKS = {
  1: { name: "Ethereum", color: "bg-blue-500" },
  137: { name: "Polygon", color: "bg-purple-500" },
  56: { name: "BSC", color: "bg-yellow-500" },
  42161: { name: "Arbitrum", color: "bg-blue-400" },
  10: { name: "Optimism", color: "bg-red-500" },
}

export function WalletConnection() {
  const { account, balance, isConnected, chainId, connectWallet, disconnectWallet, switchNetwork, getBalance } =
    useWallet()

  const currentNetwork = NETWORKS[chainId as keyof typeof NETWORKS] || { name: "Unknown", color: "bg-gray-500" }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </div>
          <Badge className={`${currentNetwork.color} text-white`}>{currentNetwork.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Account</p>
            <p className="font-mono text-sm text-white">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Balance</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-white">{Number.parseFloat(balance).toFixed(4)} ETH</p>
              <Button variant="ghost" size="sm" onClick={getBalance}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Network</p>
            <Select value={chainId.toString()} onValueChange={(value) => switchNetwork(Number.parseInt(value))}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="1">Ethereum</SelectItem>
                <SelectItem value="137">Polygon</SelectItem>
                <SelectItem value="56">BSC</SelectItem>
                <SelectItem value="42161">Arbitrum</SelectItem>
                <SelectItem value="10">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={disconnectWallet}
          className="w-full border-slate-600 text-white hover:bg-slate-700 bg-transparent"
        >
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  )
}
