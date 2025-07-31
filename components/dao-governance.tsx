"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, Users, Plus, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const PROPOSALS = [
  {
    id: 1,
    title: "Increase Staking Rewards by 2%",
    description:
      "Proposal to increase staking rewards from 4.5% to 6.5% APY to attract more liquidity to the protocol.",
    status: "Active",
    votesFor: 1250000,
    votesAgainst: 340000,
    totalVotes: 1590000,
    quorum: 2000000,
    timeLeft: "2 days",
    proposer: "0x1234...5678",
  },
  {
    id: 2,
    title: "Add New Token Pair: ETH/MATIC",
    description: "Add ETH/MATIC trading pair to the DEX with 0.3% trading fees and liquidity mining rewards.",
    status: "Passed",
    votesFor: 2100000,
    votesAgainst: 450000,
    totalVotes: 2550000,
    quorum: 2000000,
    timeLeft: "Ended",
    proposer: "0x9876...5432",
  },
  {
    id: 3,
    title: "Treasury Diversification Strategy",
    description: "Diversify 20% of treasury funds into blue-chip DeFi protocols to generate additional yield.",
    status: "Pending",
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    quorum: 2000000,
    timeLeft: "Starts in 1 day",
    proposer: "0x5555...7777",
  },
]

export function DAOGovernance() {
  const { isConnected, account } = useWallet()
  const [proposalTitle, setProposalTitle] = useState("")
  const [proposalDescription, setProposalDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [votingPower] = useState("15,000") // Mock voting power
  const { toast } = useToast()

  const handleCreateProposal = async () => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    if (!proposalTitle || !proposalDescription) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({ title: "Success", description: "Proposal created successfully!" })
      setProposalTitle("")
      setProposalDescription("")
    } catch (error) {
      toast({ title: "Error", description: "Failed to create proposal", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!isConnected) {
      toast({ title: "Error", description: "Please connect your wallet first", variant: "destructive" })
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({ title: "Success", description: `Vote ${support ? "FOR" : "AGAINST"} proposal #${proposalId} submitted!` })
    } catch (error) {
      toast({ title: "Error", description: "Voting failed", variant: "destructive" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Passed":
        return "bg-blue-500"
      case "Pending":
        return "bg-yellow-500"
      case "Failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-20">
          <p className="text-gray-400">Connect your wallet to participate in DAO governance</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Your Governance Power
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Voting Power</p>
              <p className="text-2xl font-bold text-white">{votingPower}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Proposals Created</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Votes Cast</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Participation Rate</p>
              <p className="text-2xl font-bold text-green-400">85%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="proposals" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Proposal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals">
          <div className="space-y-4">
            {PROPOSALS.map((proposal) => (
              <Card key={proposal.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-white">
                        #{proposal.id} {proposal.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(proposal.status)} text-white`}>{proposal.status}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          {proposal.timeLeft}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{proposal.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Votes For</span>
                      <span className="text-green-400">{proposal.votesFor.toLocaleString()}</span>
                    </div>
                    <Progress value={(proposal.votesFor / proposal.quorum) * 100} className="h-2 bg-slate-700" />

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Votes Against</span>
                      <span className="text-red-400">{proposal.votesAgainst.toLocaleString()}</span>
                    </div>
                    <Progress value={(proposal.votesAgainst / proposal.quorum) * 100} className="h-2 bg-slate-700" />

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Quorum Progress</span>
                      <span className="text-white">
                        {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(proposal.totalVotes / proposal.quorum) * 100} className="h-2 bg-slate-700" />
                  </div>

                  {proposal.status === "Active" && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleVote(proposal.id, true)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Vote For
                      </Button>
                      <Button
                        onClick={() => handleVote(proposal.id, false)}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        Vote Against
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Plus className="h-5 w-5" />
                Create New Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Proposal Title</Label>
                <Input
                  placeholder="Enter proposal title"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  placeholder="Describe your proposal in detail"
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-32"
                />
              </div>

              <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-white">Requirements</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Minimum 10,000 tokens required to create proposal</li>
                  <li>• Voting period: 7 days</li>
                  <li>• Quorum: 2,000,000 votes</li>
                  <li>• Execution delay: 2 days after passing</li>
                </ul>
              </div>

              <Button
                onClick={handleCreateProposal}
                disabled={isLoading || !proposalTitle || !proposalDescription}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? "Creating Proposal..." : "Create Proposal"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
