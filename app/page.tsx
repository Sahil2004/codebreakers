import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white font-sans">
			{/* Navbar */}
			<nav className="w-full flex items-center justify-between px-8 py-4 border-b border-zinc-200 dark:border-zinc-800">
				<Link href="/" className="text-xl font-bold">
					NorthQuest
				</Link>
				<div className="flex gap-6 text-sm">
					<a href="#features" className="hover:underline">
						Features
					</a>
					<Link href="/explore" className="hover:underline">
						Destinations
					</Link>
					<Link href="/trip-planner" className="hover:underline">
						Plan Trip
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-4xl mx-auto">
				<h2 className="text-5xl font-bold leading-tight">
					Discover the Culture & Heritage of North India
				</h2>
				<p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
					AI‑powered digital tourism platform to explore heritage
					sites, eco‑tourism destinations, and authentic cultural
					experiences across North India.
				</p>
				<div className="mt-8 flex gap-4">
					<Link
						href="/trip-planner"
						className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium"
					>
						Start Planning
					</Link>
					<Link
						href="/explore"
						className="px-6 py-3 rounded-full border border-zinc-300 dark:border-zinc-700"
					>
						Explore Destinations
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="max-w-6xl mx-auto px-6 py-16">
				<h3 className="text-3xl font-bold text-center mb-12">
					Smart Travel Features
				</h3>

				<div className="grid md:grid-cols-3 gap-8">
					<div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
						<h4 className="font-semibold text-lg">
							AI Trip Planner
						</h4>
						<p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
							Generate personalized itineraries for North India
							instantly.
						</p>
					</div>

					<div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
						<h4 className="font-semibold text-lg">Hidden Gems</h4>
						<p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
							Discover eco‑tourism spots and unexplored heritage
							locations.
						</p>
					</div>

					<div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
						<h4 className="font-semibold text-lg">
							Local Experiences
						</h4>
						<p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
							Explore local food, festivals, and authentic
							cultural stays.
						</p>
					</div>
				</div>
			</section>

			{/* Destinations Section */}
			<section
				id="destinations"
				className="bg-zinc-100 dark:bg-zinc-900 py-16 px-6"
			>
				<div className="max-w-6xl mx-auto">
					<h3 className="text-3xl font-bold text-center mb-12">
						Popular Destinations
					</h3>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
							<img
								src="https://images.unsplash.com/photo-1548013146-72479768bada"
								className="h-48 w-full object-cover"
							/>
							<div className="p-4">
								<h4 className="font-semibold">Jaipur</h4>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									Forts, palaces and royal heritage.
								</p>
							</div>
						</div>

						<div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
							<img
								src="https://images.unsplash.com/photo-1597040663342-45b6af3d91a5"
								className="h-48 w-full object-cover"
							/>
							<div className="p-4">
								<h4 className="font-semibold">Rishikesh</h4>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									Adventure sports and spiritual retreats.
								</p>
							</div>
						</div>

						<div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
							<img
								src="https://images.unsplash.com/photo-1564507592333-c60657eea523"
								className="h-48 w-full object-cover"
							/>
							<div className="p-4">
								<h4 className="font-semibold">Agra</h4>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									Home of the Taj Mahal and Mughal history.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section id="plan" className="text-center py-20 px-6">
				<h3 className="text-3xl font-bold">
					Plan Your North India Journey
				</h3>
				<p className="mt-4 text-zinc-600 dark:text-zinc-400">
					Use AI to build a personalized itinerary in seconds.
				</p>
				<Link
					href="/trip-planner"
					className="inline-block mt-6 px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black"
				>
					Generate Trip Plan
				</Link>
			</section>

			{/* Footer */}
			<footer className="text-center py-8 border-t border-zinc-200 dark:border-zinc-800 text-sm">
				© 2026 NorthQuest • Digital Tourism Platform for North India
			</footer>
		</div>
	);
}
