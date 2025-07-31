"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  account: string
  balance: string
  isConnected: boolean
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  chainId: number
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
  getBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { toast } = useToast()
  const [account, setAccount] = useState<string>("")
  const [balance, setBalance] = useState<string>("0")
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<number>(1)

  useEffect(() => {
    checkConnection()
    setupEventListeners()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          await connectWallet()
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const setupEventListeners = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      getBalance()
    }
  }

  const handleChainChanged = (chainId: string) => {
    setChainId(Number.parseInt(chainId, 16))
    window.location.reload()
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({ title: "Error", description: "Please install MetaMask or another Web3 wallet", variant: "destructive" })
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      setAccount(accounts[0])
      setProvider(provider)
      setSigner(signer)
      setChainId(Number(network.chainId))
      setIsConnected(true)

      await getBalance(accounts[0], provider)
      toast({ title: "Success", description: "Wallet connected successfully!" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to connect wallet", variant: "destructive" })
    }
  }

  const disconnectWallet = () => {
    setAccount("")
    setBalance("0")
    setIsConnected(false)
    setProvider(null)
    setSigner(null)
    setChainId(1)
    toast({ title: "Info", description: "Wallet disconnected" })
  }

  const switchNetwork = async (targetChainId: number) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        toast({ title: "Error", description: "Please add this network to your wallet first", variant: "destructive" })
      } else {
        toast({ title: "Error", description: "Failed to switch network", variant: "destructive" })
      }
    }
  }

  const getBalance = async (address?: string, providerInstance?: ethers.BrowserProvider) => {
    try {
      const addr = address || account
      const prov = providerInstance || provider

      if (addr && prov) {
        const balance = await prov.getBalance(addr)
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error("Error getting balance:", error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        isConnected,
        provider,
        signer,
        chainId,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        getBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
