import { MENTOR_REGISTRY_ADDRESS } from "@/contracts/contract-address";
import { MENTOR_REGISTRY_ABI, mentorRegisterTypes } from "@/lib/constants";
import { getConfig } from "@/lib/wagmi";
import { signTypedData } from "@wagmi/core";
import { useCallback, useState } from "react";
import { type Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

type RegisterParams = {
  username: string;
  mentorAddress: Address;
};

type HookReturn = {
  error: string | null;
  isLoading: boolean;
  registerMentor: (params: RegisterParams) => Promise<void>;
};

export function useRegisterMentor(): HookReturn {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const config = getConfig();

  const { address: userAddress } = useAccount();

  const registerMentor = useCallback(
    async (params: RegisterParams) => {
      if (!userAddress) {
        throw new Error("Wallet not connected");
      }

      setError(null);
      setIsLoading(true);

      try {
        const { mentorAddress, username } = params;

        // 1. Get nonce from MentorRegistry
        const nonce = await config..readContract({
          address: MENTOR_REGISTRY_ADDRESS,
          abi: MENTOR_REGISTRY_ABI,
          args: [userAddress],
          functionName: "getNonce",
        });

        // 2. Prepare EIP-712 typed data
        const signed = {
          mentorAddress,
          nonce: nonce as bigint,
          username,
        } satisfies import("@/lib/constants").MentorRegister;

        // 3. Sign typed data
        const signature = await signTypedData(config, {
          domain,
          message: signed,
          primaryType: "MentorRegister",
          types: mentorRegisterTypes,
        });

        // 4. Split signature into v, r, s
        const sig = signature as `0x${string}`;
        const v = parseInt(sig.slice(-2), 16);
        const r = sig.slice(2, 66) as `0x${string}`;
        const s = sig.slice(66, 130) as `0x${string}`;

        // 5. Encode calldata for registerMentorByRelayer
        const data = encodeFunctionData({
          abi: MENTOR_REGISTRY_ABI,
          functionName: "registerMentorByRelayer",
          args: [
            username,
            mentorAddress,
            BigInt(Math.floor(Date.now() / 1000) + 600), // 10 min deadline
            v,
            r as `0x${string}`,
            s as `0x${string}`,
          ],
        });

        // 6. Send request to relayer
        const relayerUrl = import.meta.env.VITE_RELAYER_URL;
        const relayerApiKey = import.meta.env.VITE_RELAYER_API_KEY;

        if (!relayerApiKey || !relayerUrl) {
          throw new Error("Relayer configuration missing");
        }

        const submitRes = await fetch(`${relayerUrl}/relay`, {
          body: JSON.stringify({
            data,
            from: userAddress,
            meta: {
              mentorAddress,
              username,
            },
            to: MENTOR_REGISTRY_ADDRESS,
          }),
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": relayerApiKey,
          },
          method: "POST",
        });

        if (!submitRes.ok) {
          const err = await submitRes.json();
          throw new Error(err?.error || "Transaction submission failed");
        }

        const result = await submitRes.json();

        if (!result.success) {
          throw new Error(result?.error || "Transaction failed");
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("RegisterMentor error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userAddress],
  );

  return {
    error,
    isLoading,
    registerMentor,
  };
}

export type { MentorAddressUpdate, MentorRegister };
