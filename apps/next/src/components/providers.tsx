"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { PostHogProvider } from "posthog-js/react";
import { useMemo, useEffect } from "react";

import { Toaster } from "@/lib/components/toaster";
import { AppConfigProvider } from "@/lib/config";

import type { AppConfig } from "@/lib/config-server";
import type { PostHogConfig } from "posthog-js";
import type { ReactNode } from "react";

interface ProvidersProps {
	children: ReactNode;
	config: AppConfig;
}

export function Providers({ children, config }: ProvidersProps) {
	const queryClient = useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 5 * 60 * 1000, // 5 minutes
						retry: false,
					},
				},
			}),
		[],
	);

	const posthogOptions: Partial<PostHogConfig> | undefined = {
		api_host: config.posthogHost,
		capture_pageview: "history_change",
		autocapture: true,
	};

	// Set up Crisp if configured
	useEffect(() => {
		if (config.crispId) {
			// Dynamically import Crisp to avoid SSR issues
			import("crisp-sdk-web").then(({ Crisp }) => {
				Crisp.configure(config.crispId!);
			});
		}
	}, [config.crispId]);

	return (
		<AppConfigProvider config={config}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				storageKey="theme"
			>
				<QueryClientProvider client={queryClient}>
					{config.posthogKey ? (
						<PostHogProvider
							apiKey={config.posthogKey}
							options={posthogOptions}
						>
							{children}
						</PostHogProvider>
					) : (
						children
					)}
					{process.env.NODE_ENV === "development" && (
						<ReactQueryDevtools buttonPosition="bottom-right" />
					)}
				</QueryClientProvider>
				<Toaster />
			</ThemeProvider>
		</AppConfigProvider>
	);
}
