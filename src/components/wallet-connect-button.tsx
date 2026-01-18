import { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect, type Connector } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LogOut } from 'lucide-react';
import { formatAddress } from '@/lib/utils';
import { toast } from 'sonner';

type ButtonSize = 'sm' | 'md' | 'lg';

interface WalletConnectButtonProps {
  size?: ButtonSize;
}

export function WalletConnectButton({ size = 'md' }: WalletConnectButtonProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm py-1.5 px-4';
      case 'lg':
        return 'text-lg py-3 px-8';
      case 'md':
      default:
        return 'text-base py-2 px-6';
    }
  };
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect({
    mutation: {
      onSettled(error) {
        setIsDialogOpen(false);
        if (error) console.log("Error");
        else console.log("No Error");
      },
    }
  });
  const { disconnect } = useDisconnect();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getWalletInfo = (connector: Connector) => {
    if (typeof window === 'undefined') {
      return {
        id: connector.id,
        name: connector.name,
        description: 'Connect using wallet',
      };
    }

    const provider = (window as any).ethereum;

    if (connector.id === 'coinbaseWallet') {
      return {
        id: connector.id,
        name: 'Coinbase Wallet',
        description: 'Connect using Coinbase Wallet',
      };
    }

    if (connector.id === 'injected') {
      if (!provider) {
        return {
          id: connector.id,
          name: 'No Wallet Found',
          description: 'Please install a wallet browser extension',
          disabled: true,
        };
      }

      let walletName = 'Injected Wallet';
      if (provider.isMetaMask) {
        walletName = 'MetaMask';
      } else if (provider.isBraveWallet) {
        walletName = 'Brave Wallet';
      } else if (provider.isPhantom) {
        walletName = 'Phantom';
      } else if (provider.isRabby) {
        walletName = 'Rabby';
      }

      return {
        id: connector.id,
        name: walletName,
        description: `Connect using ${walletName}`,
      };
    }

    return {
      id: connector.id,
      name: connector.name,
      description: `Connect using ${connector.name}`,
    };
  };

  const handleConnect = async (connector: Connector) => {
    try {
      connect({ connector });
      toast.success(`Successfully connected to ${connector.name}!`);
    } catch (err) {
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full ${getSizeClasses()}`}
          >
            {formatAddress(address)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Wallet Connected</DialogTitle>
            <DialogDescription>
              You are connected with {formatAddress(address)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full ${getSizeClasses()}`}
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm bg-white shadow-2xl border-0 overflow-hidden">
        <DialogHeader className="text-left pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Connect a Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Select a wallet to connect to the platform
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 max-h-sm overflow-y-auto">
          {(() => {
            const uniqueWallets = connectors.filter((connector, index, self) => {
              const info = getWalletInfo(connector);
              const firstIndex = self.findIndex(
                (c) => getWalletInfo(c).name === info.name
              );
              return firstIndex === index;
            });

            return uniqueWallets.map((connector) => {
              const walletInfo = getWalletInfo(connector);
              return (
                <Button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  disabled={isPending || walletInfo.disabled}
                >
                  {walletInfo.name}
                </Button>
              );
            });
          })()}
        </div>
        {error && (
          <div className="text-sm text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="font-medium">Connection Error</div>
            <div className="mt-1">{error.message}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
