"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Coins, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function TokenCreator() {
  const { isConnected, signer } = useWallet()
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [decimals, setDecimals] = useState("18")
  const [description, setDescription] = useState("")
  const [isMintable, setIsMintable] = useState(false)
  const [isBurnable, setIsBurnable] = useState(false)
  const [isPausable, setIsPausable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCreateToken = async () => {
    if (!isConnected || !signer) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!tokenName || !tokenSymbol || !totalSupply) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      // Simulate token creation
      await new Promise((resolve) => setTimeout(resolve, 4000))

      toast({ title: "Success", description: `Token ${tokenSymbol} created successfully!` })

      // Reset form
      setTokenName("")
      setTokenSymbol("")
      setTotalSupply("")
      setDescription("")
      setIsMintable(false)
      setIsBurnable(false)
      setIsPausable(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to create token", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const generateContract = () => {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
${isMintable ? 'import "@openzeppelin/contracts/access/Ownable.sol";' : ""}
${isBurnable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";' : ""}
${isPausable ? 'import "@openzeppelin/contracts/security/Pausable.sol";' : ""}

contract ${tokenSymbol || "MyToken"} is ERC20${isMintable ? ", Ownable" : ""}${isBurnable ? ", ERC20Burnable" : ""}${isPausable ? ", Pausable" : ""} {
    constructor() ERC20("${tokenName || "My Token"}", "${tokenSymbol || "MTK"}") {
        _mint(msg.sender, ${totalSupply || "1000000"} * 10**decimals());
    }
    
    ${
      isMintable
        ? `
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }`
        : ""
    }
    
    ${
      isPausable
        ? `
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }`
        : ""
    }
}`
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to create custom tokens</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-5 w-5" />
            Create ERC-20 Token
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Token Name *</Label>
              <Input
                placeholder="My Awesome Token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Symbol *</Label>
              <Input
                placeholder="MAT"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Total Supply *</Label>
              <Input
                type="number"
                placeholder="1000000"
                value={totalSupply}
                onChange={(e) => setTotalSupply(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Decimals</Label>
              <Input
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              placeholder="Describe your token's purpose and utility"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Token Features</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Mintable</Label>
                <p className="text-xs text-gray-400">Allow creating new tokens after deployment</p>
              </div>
              <Switch checked={isMintable} onCheckedChange={setIsMintable} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Burnable</Label>
                <p className="text-xs text-gray-400">Allow token holders to burn their tokens</p>
              </div>
              <Switch checked={isBurnable} onCheckedChange={setIsBurnable} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Pausable</Label>
                <p className="text-xs text-gray-400">Allow pausing all token transfers</p>
              </div>
              <Switch checked={isPausable} onCheckedChange={setIsPausable} />
            </div>
          </div>

          <Button
            onClick={handleCreateToken}
            disabled={isLoading || !tokenName || !tokenSymbol || !totalSupply}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            {isLoading ? "Creating Token..." : "Create Token"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Code className="h-5 w-5" />
            Smart Contract Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-auto max-h-96">
            <pre>{generateContract()}</pre>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Gas:</span>
              <span className="text-white">~2,500,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Deployment Cost:</span>
              <span className="text-white">~$50-100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
