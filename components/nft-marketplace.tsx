"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Upload, ShoppingCart, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const MOCK_NFTS = [
  {
    id: 1,
    name: "Cosmic Cat #1234",
    price: "0.5",
    image: "/placeholder.svg?height=300&width=300",
    owner: "0x1234...5678",
    collection: "Cosmic Cats",
  },
  {
    id: 2,
    name: "Digital Landscape #567",
    price: "1.2",
    image: "/placeholder.svg?height=300&width=300",
    owner: "0x9876...5432",
    collection: "Digital Art",
  },
  {
    id: 3,
    name: "Pixel Punk #890",
    price: "2.1",
    image: "/placeholder.svg?height=300&width=300",
    owner: "0x5555...7777",
    collection: "Pixel Punks",
  },
  {
    id: 4,
    name: "Abstract Dreams #123",
    price: "0.8",
    image: "/placeholder.svg?height=300&width=300",
    owner: "0x3333...9999",
    collection: "Dream Collection",
  },
]

export function NFTMarketplace() {
  const { isConnected, account } = useWallet()
  const [mintName, setMintName] = useState("")
  const [mintDescription, setMintDescription] = useState("")
  const [mintPrice, setMintPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleMintNFT = async () => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!mintName || !mintDescription || !mintPrice) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      // Simulate NFT minting
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({ title: "Success", description: `NFT "${mintName}" minted successfully!` })
      setMintName("")
      setMintDescription("")
      setMintPrice("")
    } catch (error) {
      toast({ title: "Error", description: "Failed to mint NFT", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNFT = async (nft: any) => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    try {
      // Simulate NFT purchase
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({ title: "Success", description: `Successfully purchased ${nft.name} for ${nft.price} ETH!` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to purchase NFT", variant: "destructive" })
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to access the NFT marketplace</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="marketplace" className="space-y-6">
      <TabsList className="bg-slate-800 border-slate-700">
        <TabsTrigger value="marketplace" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Marketplace
        </TabsTrigger>
        <TabsTrigger value="mint" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Mint NFT
        </TabsTrigger>
      </TabsList>

      <TabsContent value="marketplace">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_NFTS.map((nft) => (
            <Card key={nft.id} className="bg-slate-800 border-slate-700 overflow-hidden">
              <div className="aspect-square relative">
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white">{nft.name}</h3>
                  <p className="text-sm text-gray-400">{nft.collection}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="font-bold text-white">{nft.price} ETH</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {nft.owner === account ? "Owned" : "For Sale"}
                  </Badge>
                </div>

                {nft.owner !== account && (
                  <Button
                    onClick={() => handleBuyNFT(nft)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Buy Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="mint">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="h-5 w-5" />
                Mint New NFT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">NFT Name</Label>
                <Input
                  placeholder="Enter NFT name"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  placeholder="Describe your NFT"
                  value={mintDescription}
                  onChange={(e) => setMintDescription(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="0.1"
                  value={mintPrice}
                  onChange={(e) => setMintPrice(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Upload Image</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <Button
                onClick={handleMintNFT}
                disabled={isLoading || !mintName || !mintDescription || !mintPrice}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isLoading ? "Minting..." : "Mint NFT"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="h-16 w-16 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white">{mintName || "NFT Name"}</h3>
                <p className="text-sm text-gray-400">{mintDescription || "NFT Description"}</p>
                <p className="font-bold text-white">{mintPrice || "0"} ETH</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
