"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Play, FileText, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const SAMPLE_CONTRACTS = [
  {
    name: "ERC-20 Token",
    address: "0x1234567890123456789012345678901234567890",
    abi: `[
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
]`,
  },
  {
    name: "Uniswap V2 Router",
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    abi: `[
  {
    "inputs": [{"name": "amountIn", "type": "uint256"}, {"name": "path", "type": "address[]"}],
    "name": "getAmountsOut",
    "outputs": [{"name": "amounts", "type": "uint256[]"}],
    "type": "function"
  }
]`,
  },
]

export function ContractInteraction() {
  const { isConnected, signer } = useWallet()
  const [contractAddress, setContractAddress] = useState("")
  const [contractABI, setContractABI] = useState("")
  const [selectedFunction, setSelectedFunction] = useState("")
  const [functionInputs, setFunctionInputs] = useState<{ [key: string]: string }>({})
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [deployBytecode, setDeployBytecode] = useState("")
  const [constructorArgs, setConstructorArgs] = useState("")
  const { toast } = useToast()

  const loadSampleContract = (contract: any) => {
    setContractAddress(contract.address)
    setContractABI(contract.abi)
    toast({ title: "Success", description: `Loaded ${contract.name} contract` })
  }

  const parseABI = () => {
    try {
      const abi = JSON.parse(contractABI)
      return abi.filter((item: any) => item.type === "function")
    } catch {
      return []
    }
  }

  const handleFunctionCall = async () => {
    if (!isConnected || !signer) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!contractAddress || !contractABI || !selectedFunction) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      // Simulate contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult = "0x1234567890abcdef" // Mock transaction hash or return value
      setResult(mockResult)
      toast({ title: "Success", description: "Contract function executed successfully!" })
    } catch (error) {
      toast({ title: "Error", description: "Contract interaction failed", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!isConnected || !signer) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!deployBytecode) {
      toast({ title: "Error", description: "Please provide contract bytecode", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
      toast({ title: "Success", description: `Contract deployed at: ${mockAddress}` })
      setResult(`Contract deployed successfully at: ${mockAddress}`)
    } catch (error) {
      toast({ title: "Error", description: "Contract deployment failed", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to interact with smart contracts</p>
        </CardContent>
      </Card>
    )
  }

  const functions = parseABI()

  return (
    <Tabs defaultValue="interact" className="space-y-6">
      <TabsList className="bg-slate-800 border-slate-700">
        <TabsTrigger value="interact" className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Interact
        </TabsTrigger>
        <TabsTrigger value="deploy" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Deploy
        </TabsTrigger>
        <TabsTrigger value="verify" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Verify
        </TabsTrigger>
      </TabsList>

      <TabsContent value="interact">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="h-5 w-5" />
                Contract Interaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Sample Contracts</Label>
                <div className="flex gap-2">
                  {SAMPLE_CONTRACTS.map((contract, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleContract(contract)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      {contract.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Contract Address</Label>
                <Input
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Contract ABI</Label>
                <Textarea
                  placeholder="Paste contract ABI JSON here"
                  value={contractABI}
                  onChange={(e) => setContractABI(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white font-mono min-h-32"
                />
              </div>

              {functions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Function</Label>
                  <Select value={selectedFunction} onValueChange={setSelectedFunction}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select function" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {functions.map((func: any, index: number) => (
                        <SelectItem key={index} value={func.name}>
                          {func.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedFunction && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Function Parameters</Label>
                  {functions
                    .find((f: any) => f.name === selectedFunction)
                    ?.inputs?.map((input: any, index: number) => (
                      <Input
                        key={index}
                        placeholder={`${input.name} (${input.type})`}
                        value={functionInputs[input.name] || ""}
                        onChange={(e) => setFunctionInputs({ ...functionInputs, [input.name]: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    ))}
                </div>
              )}

              <Button
                onClick={handleFunctionCall}
                disabled={isLoading || !contractAddress || !contractABI || !selectedFunction}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isLoading ? "Executing..." : "Execute Function"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Execution Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 min-h-32">
                {result ? (
                  <div className="space-y-2">
                    <Badge className="bg-green-500 text-white">Success</Badge>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{result}</pre>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Execute a function to see results here</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="deploy">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5" />
              Deploy Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Contract Bytecode</Label>
              <Textarea
                placeholder="Paste contract bytecode here"
                value={deployBytecode}
                onChange={(e) => setDeployBytecode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white font-mono min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Constructor Arguments (optional)</Label>
              <Input
                placeholder="Comma-separated constructor arguments"
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="bg-slate-700 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-white">Deployment Info</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Estimated Gas:</span>
                  <span>~2,500,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Price:</span>
                  <span>20 gwei</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Cost:</span>
                  <span>~$50-100</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDeploy}
              disabled={isLoading || !deployBytecode}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isLoading ? "Deploying..." : "Deploy Contract"}
            </Button>

            {result && (
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verify">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-20">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Contract Verification</h3>
            <p className="text-gray-400">
              Contract verification feature coming soon. This will allow you to verify your deployed contracts on
              Etherscan and other block explorers.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
