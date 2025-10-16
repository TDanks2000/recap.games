"use client";

import { BlogPostForm } from "@/features/blog/components/editor/blogPostForm";

interface Props {
	formIndex: number;
}

export default function BlogForm({ formIndex: _formIndex }: Props) {
	return <BlogPostForm />;
}
