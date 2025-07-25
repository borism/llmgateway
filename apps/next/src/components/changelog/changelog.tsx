import Image from "next/image";
import Link from "next/link";

import { AppHeader } from "./app-header";
import Footer from "@/components/landing/footer";

import type { ChangelogFrontmatter } from "@/lib/utils/markdown";

interface ChangelogComponentProps {
	entries?: ChangelogFrontmatter[];
}

export function ChangelogComponent({ entries }: ChangelogComponentProps = {}) {
	const changelogEntries = entries || [];

	return (
		<div className="bg-background text-foreground min-h-screen font-sans">
			<AppHeader />
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 md:mb-0">
						Changelog
					</h1>
					{/* <Button
						variant="ghost"
						className="text-gray-300 hover:text-white hover:bg-gray-800"
					>
						<BellIcon className="h-4 w-4 mr-2" />
						Subscribe to updates
					</Button> */}
				</div>

				<div className="space-y-16 max-w-5xl mx-auto">
					{changelogEntries.map((entry: ChangelogFrontmatter) => (
						<article
							key={entry.id}
							className="grid md:grid-cols-[150px_1fr] gap-x-8 gap-y-4"
						>
							<time
								dateTime={entry.date}
								className="text-sm text-muted-foreground md:text-right pt-1"
							>
								{new Date(entry.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
							<div className="space-y-8">
								<div className="space-y-4">
									<h2 className="text-2xl font-medium text-foreground hover:text-muted-foreground transition-colors">
										<Link href={`/changelog/${entry.slug}`} prefetch={true}>
											{entry.title}
										</Link>
									</h2>
									<p className="text-muted-foreground leading-relaxed">
										{entry.summary}
									</p>
									<Link
										href={`/changelog/${entry.slug}`}
										className="text-sm text-primary hover:text-primary/80"
										prefetch={true}
									>
										Read more &rarr;
									</Link>
								</div>
								<div className="bg-card border border-border rounded-lg overflow-hidden">
									<Link href={`/changelog/${entry.slug}`} prefetch={true}>
										<Image
											src={entry.image.src}
											alt={entry.image.alt}
											width={entry.image.width}
											height={entry.image.height}
											className="w-full h-64 object-cover hover:opacity-90 transition-opacity rounded-lg"
										/>
									</Link>
								</div>
							</div>
						</article>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
}
