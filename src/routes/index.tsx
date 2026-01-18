import { WalletConnectButton } from '@/components/wallet-connect-button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to OneCal
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Revolutionizing mentorship and consultation booking with blockchain-powered payments.
            </p>
            <p className="text-md text-gray-500">
              Built on Base Network • Powered by IDRX • Commitment-based booking to eliminate no-shows
            </p>
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </div>
  )
}
