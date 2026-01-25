import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetworkSwitch } from "@/hooks/use-network-switch";

export function NetworkSwitchPrompt() {
	const { needsSwitch, isPending, switchToCorrectNetwork, expectedChainId } = useNetworkSwitch();

	if (!needsSwitch) return null;

	return (
		<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
			<div className="flex items-start gap-3">
				<AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
				<div className="flex-1">
					<h3 className="text-sm font-semibold text-yellow-900 mb-1">
						Wrong Network Detected
					</h3>
					<p className="text-sm text-yellow-800 mb-3">
						This app requires network chain ID {expectedChainId}. Please switch your network in MetaMask to continue.
					</p>
					<Button
						size="sm"
						onClick={switchToCorrectNetwork}
						disabled={isPending}
						className="bg-yellow-600 hover:bg-yellow-700 text-white"
					>
						{isPending ? "Switching..." : "Switch Network"}
					</Button>
				</div>
			</div>
		</div>
	);
}
