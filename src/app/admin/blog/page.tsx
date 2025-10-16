"use client";

import {
	ArrowLeft,
	BarChart3,
	ListFilter,
	Minus,
	Plus,
	Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogForm from "@/features/admin/components/BlogForm";
import BlogPostsList from "@/features/admin/components/BlogPostsList";
import { BlogAnalytics } from "@/features/admin/components/blogAnalytics";

export default function BlogAdminPage() {
	const [formCount, setFormCount] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const handleAddForm = () => setFormCount((prev) => prev + 1);
	const handleRemoveForm = () =>
		formCount > 1 && setFormCount((prev) => prev - 1);

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="font-bold text-2xl text-white sm:text-3xl">
					Blog Management
				</h1>
				<Button variant="outline" asChild className="gap-2">
					<Link href="/admin">
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Back to Dashboard</span>
						<span className="inline sm:hidden">Back</span>
					</Link>
				</Button>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="existing" className="w-full">
				{/* Tab Navigation */}
				<div className="mb-6">
					<TabsList className="grid w-full grid-cols-3 sm:inline-grid sm:w-auto">
						<TabsTrigger value="existing">
							<span className="hidden sm:inline">Existing Posts</span>
							<span className="inline sm:hidden">Existing</span>
						</TabsTrigger>
						<TabsTrigger value="analytics" className="gap-2">
							<BarChart3 className="h-4 w-4" />
							<span className="hidden sm:inline">Analytics</span>
							<span className="inline sm:hidden">Stats</span>
						</TabsTrigger>
						<TabsTrigger value="add" className="gap-2">
							<span className="hidden sm:inline">Add New</span>
							<span className="inline sm:hidden">Add</span>
							<Badge variant="secondary" className="px-1.5 py-0.5">
								{formCount}
							</Badge>
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Existing Posts Tab */}
				<TabsContent value="existing" className="mt-0 space-y-4">
					{/* Search and Actions */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
						<div className="relative flex-1 sm:max-w-xs">
							<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search posts..."
								className="border-none pl-9 text-white"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button variant="outline" asChild className="gap-2">
							<Link href="/blog/create">
								<Plus className="h-4 w-4" />
								<span>Quick Create</span>
							</Link>
						</Button>
					</div>

					{/* Posts List Card */}
					<Card className="border-none bg-transparent">
						<CardHeader className="bg-card p-4 sm:p-5">
							<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
								<CardTitle>All Blog Posts</CardTitle>
								<Button variant="outline" size="sm" className="gap-2">
									<ListFilter className="h-4 w-4" />
									<span>Filter</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<BlogPostsList searchQuery={searchQuery} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value="analytics" className="mt-0">
					<Card className="border-none bg-transparent">
						<CardHeader className="bg-card p-4 sm:p-5">
							<CardTitle>Blog Analytics</CardTitle>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<BlogAnalytics />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Add New Post Tab */}
				<TabsContent value="add" className="mt-0 space-y-4">
					{/* Form Controls */}
					<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
						<Button
							variant="outline"
							size="sm"
							onClick={handleAddForm}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							<span>Add Form</span>
						</Button>
						{formCount > 1 && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleRemoveForm}
								className="gap-2"
							>
								<Minus className="h-4 w-4" />
								<span>Remove Form</span>
							</Button>
						)}
					</div>

					{/* Blog Forms */}
					<div className="space-y-6">
						{Array.from({ length: formCount }).map((_, index) => (
							<Card
								// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
								key={index}
								className="border-none"
							>
								<CardHeader className="bg-card p-4 sm:p-5">
									<CardTitle>
										{formCount > 1 ? `Post ${index + 1}` : "New Blog Post"}
									</CardTitle>
								</CardHeader>
								<CardContent className="p-4 sm:p-6">
									<BlogForm formIndex={index} />
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
