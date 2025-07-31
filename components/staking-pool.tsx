"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Lock, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const STAKING_POOLS = [
  {
    id: 1,
    name: "ETH Staking",
    token: "ETH",
    apy: "4.5",
    tvl: "1,234,567",
    minStake: "0.1",
    lockPeriod: "No lock",
    rewards: "ETH",
    userStaked: "2.5",
    userRewards: "0.0234",
  },
  {
    id: 2,
    name: "High Yield Pool",
    token: "USDC",
    apy: "12.8",
    tvl: "567,890",
    minStake: "100",
    lockPeriod: "30 days",
    rewards: "POOL",
    userStaked: "1000",
    userRewards: "45.67",
  },
  {
    id: 3,
    name: "LP Token Farm",
    token: "ETH-USDC LP",
    apy: "25.4",
    tvl: "234,567",
    minStake: "0.01",
    lockPeriod: "7 days",
    rewards: "FARM",
    userStaked: "0.5",
    userRewards: "12.34",
  },
]

export function StakingPool() {
  const { isConnected } = useWallet()
  const [selectedPool, setSelectedPool] = useState(STAKING_POOLS[0])
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleStake = async () => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!stakeAmount || Number.parseFloat(stakeAmount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({ title: "Success", description: `Successfully staked ${stakeAmount} ${selectedPool.token}` })
      setStakeAmount("")
    } catch (error) {
      toast({ title: "Error", description: "Staking failed", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnstake = async () => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!unstakeAmount || Number.parseFloat(unstakeAmount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({ title: "Success", description: `Successfully unstaked ${unstakeAmount} ${selectedPool.token}` })
      setUnstakeAmount("")
    } catch (error) {
      toast({ title: "Error", description: "Unstaking failed", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({ title: "Success", description: `Claimed ${selectedPool.userRewards} ${selectedPool.rewards} rewards` })
    } catch (error) {
      toast({ title: "Error", description: "Claiming rewards failed", variant: "destructive" })
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to access staking pools</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAKING_POOLS.map((pool) => (
          <Card
            key={pool.id}
            className={`bg-slate-800 border-slate-700 cursor-pointer transition-all ${
              selectedPool.id === pool.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedPool(pool)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-white">
                <span className="text-lg">{pool.name}</span>
                <Badge className="bg-green-500 text-white">{pool.apy}% APY</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">TVL</p>
                  <p className="text-white font-semibold">${pool.tvl}</p>
                </div>
                <div>
                  <p className="text-gray-400">Min Stake</p>
                  <p className="text-white font-semibold">
                    {pool.minStake} {pool.token}
                  </p>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-400">Lock Period</p>
                <p className="text-white">{pool.lockPeriod}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5" />
              Stake & Unstake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stake" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake">Unstake</TabsTrigger>
              </TabsList>

              <TabsContent value="stake" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Amount to Stake</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button variant="outline" className="border-slate-600 text-white bg-transparent">
                      Max
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Balance: 10.5 {selectedPool.token}</p>
                </div>

                <Button
                  onClick={handleStake}
                  disabled={isLoading || !stakeAmount}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isLoading ? "Staking..." : "Stake"}
                </Button>
              </TabsContent>

              <TabsContent value="unstake" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Amount to Unstake</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button variant="outline" className="border-slate-600 text-white bg-transparent">
                      Max
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Staked: {selectedPool.userStaked} {selectedPool.token}
                  </p>
                </div>

                <Button
                  onClick={handleUnstake}
                  disabled={isLoading || !unstakeAmount}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  {isLoading ? "Unstaking..." : "Unstake"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5" />
              Your Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Staked Amount</p>
                <p className="text-xl font-bold text-white">
                  {selectedPool.userStaked} {selectedPool.token}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending Rewards</p>
                <p className="text-xl font-bold text-green-400">
                  {selectedPool.userRewards} {selectedPool.rewards}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pool Share</span>
                <span className="text-white">0.12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Rewards</span>
                <span className="text-white">~0.15 {selectedPool.rewards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Rewards</span>
                <span className="text-white">~4.5 {selectedPool.rewards}</span>
              </div>
            </div>

            <Button
              onClick={handleClaimRewards}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Gift className="h-4 w-4 mr-2" />
              Claim Rewards
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
