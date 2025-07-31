"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletProvider } from "@/contexts/wallet-context"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenSwap } from "@/components/token-swap"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { TokenCreator } from "@/components/token-creator"
import { StakingPool } from "@/components/staking-pool"
import { DAOGovernance } from "@/components/dao-governance"
import { Portfolio } from "@/components/portfolio"
import { ContractInteraction } from "@/components/contract-interaction"

export default function AdvancedWeb3Platform() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              DeFi Protocol Hub
            </h1>
            <p className="text-gray-300 text-lg">Advanced Web3 platform for DeFi, NFTs, DAOs, and more</p>
          </div>

          <WalletConnection />

          <Tabs defaultValue="portfolio" className="mt-8">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800 border-slate-700">
              <TabsTrigger value="portfolio" className="text-xs">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="swap" className="text-xs">
                Swap
              </TabsTrigger>
              <TabsTrigger value="nft" className="text-xs">
                NFT
              </TabsTrigger>
              <TabsTrigger value="create" className="text-xs">
                Create Token
              </TabsTrigger>
              <TabsTrigger value="stake" className="text-xs">
                Staking
              </TabsTrigger>
              <TabsTrigger value="dao" className="text-xs">
                DAO
              </TabsTrigger>
              <TabsTrigger value="contracts" className="text-xs">
                Contracts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6">
              <Portfolio />
            </TabsContent>

            <TabsContent value="swap" className="mt-6">
              <TokenSwap />
            </TabsContent>

            <TabsContent value="nft" className="mt-6">
              <NFTMarketplace />
            </TabsContent>

            <TabsContent value="create" className="mt-6">
              <TokenCreator />
            </TabsContent>

            <TabsContent value="stake" className="mt-6">
              <StakingPool />
            </TabsContent>

            <TabsContent value="dao" className="mt-6">
              <DAOGovernance />
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <ContractInteraction />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="text-center text-gray-400 py-20">
                <h3 className="text-2xl font-bold mb-4">Analytics Dashboard</h3>
                <p>Advanced analytics and yield farming metrics coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WalletProvider>
  )
}
