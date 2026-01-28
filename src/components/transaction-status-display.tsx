import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStatus } from "@/hooks/use-transaction-status";

type Props = {
	hash: string;
	showHistory?: boolean;
};

const statusConfig = {
	sent: {
		label: "Sent",
		variant: "secondary" as const,
		icon: Clock,
		color: "text-blue-600",
	},
	submitted: {
		label: "Submitted",
		variant: "secondary" as const,
		icon: Loader2,
		color: "text-yellow-600",
	},
	confirmed: {
		label: "Confirmed",
		variant: "default" as const,
		icon: CheckCircle2,
		color: "text-green-600",
	},
	failed: {
		label: "Failed",
		variant: "default" as const,
		icon: XCircle,
		color: "text-red-600",
	},
};

export function TransactionStatusDisplay({ hash, showHistory = true }: Props) {
	const { data, isLoading, error } = useTransactionStatus(hash);
	const [selectedStatusIndex, setSelectedStatusIndex] = useState(0);
	const latest = data?.latest;

	// Use selected status if available, otherwise fall back to latest
	const displayedStatus = data?.history?.[selectedStatusIndex] || latest;

	if (isLoading) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-red-600">
						Error loading transaction status: {error.message}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!data?.latest || !displayedStatus) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Transaction Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-muted-foreground">No transaction data found</div>
				</CardContent>
			</Card>
		);
	}

	const status = displayedStatus.status as keyof typeof statusConfig;
	const config = statusConfig[status] || statusConfig.sent;
	const StatusIcon = config.icon;

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center justify-between">
						Transaction Status
						{selectedStatusIndex > 0 && (
							<Badge variant="outline" className="text-xs">
								Historical (index {selectedStatusIndex})
							</Badge>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<div className="text-sm font-mono text-xs text-muted-foreground">
								Hash
							</div>
							<div className="font-mono text-sm break-all">{hash}</div>
						</div>
						<Badge variant={config.variant} className={config.color}>
							<StatusIcon className="h-3 w-3 mr-1" />
							{config.label}
						</Badge>
					</div>

					{displayedStatus.statusReason && (
						<div className="bg-red-50 border border-red-200 rounded p-3">
							<div className="text-sm font-medium text-red-800">Reason:</div>
							<div className="text-sm text-red-700">
								{displayedStatus.statusReason}
							</div>
						</div>
					)}

					<div className="grid grid-cols-2 gap-4 text-sm">
						{displayedStatus.sentAt && (
							<div>
								<div className="text-muted-foreground">Sent At</div>
								<div className="font-medium">
									{formatDistanceToNow(displayedStatus.sentAt, {
										addSuffix: true,
									})}
								</div>
							</div>
						)}
						{displayedStatus.confirmedAt && (
							<div>
								<div className="text-muted-foreground">Confirmed At</div>
								<div className="font-medium">
									{formatDistanceToNow(displayedStatus.confirmedAt, {
										addSuffix: true,
									})}
								</div>
							</div>
						)}
						{displayedStatus.nonce !== null && (
							<div>
								<div className="text-muted-foreground">Nonce</div>
								<div className="font-medium">{displayedStatus.nonce}</div>
							</div>
						)}
						{displayedStatus.gasLimit && (
							<div>
								<div className="text-muted-foreground">Gas Limit</div>
								<div className="font-medium">
									{displayedStatus.gasLimit.toLocaleString()}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{showHistory && data.history.length > 1 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Status History</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{data.history.map((status, index) => {
								const sConfig =
									statusConfig[status.status as keyof typeof statusConfig] ||
									statusConfig.sent;
								const SIcon = sConfig.icon;
								const isSelected = index === selectedStatusIndex;

								return (
									<button
										type="button"
										key={status.id}
										onClick={() => setSelectedStatusIndex(index)}
										className={`w-full text-left flex items-start gap-3 p-3 rounded border transition-colors ${
											isSelected
												? "bg-primary/10 border-primary/30 hover:bg-primary/15"
												: "hover:bg-muted/50"
										}`}
									>
										<SIcon className={`h-4 w-4 mt-0.5 ${sConfig.color}`} />
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<span className="font-medium text-sm">
													{status.status}
													{index === 0 && (
														<span className="ml-2 text-xs text-muted-foreground">
															(latest)
														</span>
													)}
												</span>
												<span className="text-xs text-muted-foreground">
													{formatDistanceToNow(status.eventTimestamp, {
														addSuffix: true,
													})}
												</span>
											</div>
										</div>
									</button>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
