"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  account: string | null
  balance: string
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  signer: any
  provider: any
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const { toast } = useToast()

  const networks = {
    1: { name: "Ethereum Mainnet", rpcUrl: "https://mainnet.infura.io/v3/", currency: "ETH" },
    5: { name: "Goerli Testnet", rpcUrl: "https://goerli.infura.io/v3/", currency: "ETH" },
    137: { name: "Polygon Mainnet", rpcUrl: "https://polygon-rpc.com/", currency: "MATIC" },
    80001: { name: "Mumbai Testnet", rpcUrl: "https://rpc-mumbai.maticvigil.com/", currency: "MATIC" },
  }

  useEffect(() => {
    checkConnection()
    setupEventListeners()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          await getChainId()
          await getBalance(accounts[0])
          setupProvider()
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
      window.ethereum.on("disconnect", handleDisconnect)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      getBalance(accounts[0])
    }
  }

  const handleChainChanged = (chainId: string) => {
    setChainId(Number.parseInt(chainId, 16))
    if (account) {
      getBalance(account)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  const setupProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      // In a real app, you'd use ethers.js or web3.js here
      setProvider(window.ethereum)
      setSigner(window.ethereum)
    }
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        await getChainId()
        await getBalance(accounts[0])
        setupProvider()

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setBalance("0.0")
    setChainId(null)
    setIsConnected(false)
    setProvider(null)
    setSigner(null)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const getChainId = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      setChainId(Number.parseInt(chainId, 16))
    } catch (error) {
      console.error("Error getting chain ID:", error)
    }
  }

  const getBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      // Convert from wei to ether (simplified)
      const balanceInEther = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
      setBalance(balanceInEther)
    } catch (error) {
      console.error("Error getting balance:", error)
      setBalance("0.0")
    }
  }

  const refreshBalance = async () => {
    if (account) {
      await getBalance(account)
      toast({
        title: "Balance Refreshed",
        description: "Your wallet balance has been updated",
      })
    }
  }

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        const network = networks[targetChainId as keyof typeof networks]
        if (network) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${targetChainId.toString(16)}`,
                  chainName: network.name,
                  rpcUrls: [network.rpcUrl],
                  nativeCurrency: {
                    name: network.currency,
                    symbol: network.currency,
                    decimals: 18,
                  },
                },
              ],
            })
          } catch (addError) {
            console.error("Error adding network:", addError)
            toast({
              title: "Network Error",
              description: "Failed to add network to MetaMask",
              variant: "destructive",
            })
          }
        }
      } else {
        console.error("Error switching network:", error)
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch network",
          variant: "destructive",
        })
      }
    }
  }

  const value: WalletContextType = {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    signer,
    provider,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
