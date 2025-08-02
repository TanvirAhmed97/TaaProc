"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown, Copy, ExternalLink, RefreshCw, LogOut, Network, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const networks = {
  1: { name: "Ethereum", color: "bg-blue-500", explorer: "https://etherscan.io" },
  5: { name: "Goerli", color: "bg-yellow-500", explorer: "https://goerli.etherscan.io" },
  137: { name: "Polygon", color: "bg-purple-500", explorer: "https://polygonscan.com" },
  80001: { name: "Mumbai", color: "bg-orange-500", explorer: "https://mumbai.polygonscan.com" },
}

export function WalletConnection() {
  const {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
  } = useWallet()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkInfo = (chainId: number | null) => {
    if (!chainId || !networks[chainId as keyof typeof networks]) {
      return { name: "Unknown", color: "bg-gray-500", explorer: "#" }
    }
    return networks[chainId as keyof typeof networks]
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm hover-lift">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white">Connect Your Wallet</CardTitle>
          <CardDescription>Connect your Web3 wallet to access DeFi features</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 animate-glow"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const networkInfo = getNetworkInfo(chainId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 hover-lift"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${networkInfo.color} animate-pulse`} />
              <span className="hidden sm:inline">{networkInfo.name}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="font-mono">{formatAddress(account!)}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-slate-800 border-slate-700 text-white" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Wallet Connected</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Address:</span>
              <code className="text-xs bg-slate-700 px-2 py-1 rounded">{formatAddress(account!)}</code>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0 hover:bg-slate-700">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-700" />

        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Balance</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 p-0 hover:bg-slate-700"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="text-lg font-bold text-white">
            {balance} {chainId === 137 || chainId === 80001 ? "MATIC" : "ETH"}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-700" />

        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Network</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${networkInfo.color}`} />
              <span className="text-sm">{networkInfo.name}</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-700" />

        <DropdownMenuItem onClick={() => switchNetwork(1)} className="hover:bg-slate-700 cursor-pointer">
          <Network className="mr-2 h-4 w-4" />
          Switch to Ethereum
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => switchNetwork(137)} className="hover:bg-slate-700 cursor-pointer">
          <Network className="mr-2 h-4 w-4" />
          Switch to Polygon
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-700" />

        <DropdownMenuItem
          onClick={() => window.open(`${networkInfo.explorer}/address/${account}`, "_blank")}
          className="hover:bg-slate-700 cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-700" />

        <DropdownMenuItem
          onClick={disconnectWallet}
          className="hover:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
