import { useAccount, useSwitchChain } from "wagmi";
import { chain } from "@/lib/wagmi";
import { useEffect } from "react";

export function useNetworkSwitch() {
	const { chainId, isConnected } = useAccount();
	const { switchChain, error, isPending } = useSwitchChain();

	const isCorrectChain = chainId === chain.id;
	const needsSwitch = isConnected && !isCorrectChain;

	const switchToCorrectNetwork = () => {
		if (needsSwitch && switchChain) {
			switchChain({ chainId: chain.id });
		}
	};

	// Auto-switch when connected to wrong chain
	useEffect(() => {
		if (needsSwitch && switchChain) {
			// Auto-switch after a short delay to let the UI render
			const timer = setTimeout(() => {
				switchChain({ chainId: chain.id });
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [needsSwitch, switchChain]);

	return {
		chainId,
		expectedChainId: chain.id,
		isCorrectChain,
		needsSwitch,
		switchToCorrectNetwork,
		isPending,
		error,
	};
}
