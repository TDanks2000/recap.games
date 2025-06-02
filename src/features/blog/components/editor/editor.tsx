"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MarkdownPreview } from "../MarkdownPreview";
import { EditorToolbar } from "./editorToolbar";

interface EditorProps {
	initialContent?: string;
	onContentChange?: (content: string) => void;
	className?: string;
	textAreaClassName?: string;
}

export function Editor({
	initialContent = "",
	onContentChange,
	className,
	textAreaClassName,
}: EditorProps) {
	const [content, setContent] = useState(initialContent);
	const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const insertAtCursor = useCallback(
		(syntax: string, placeholder = "") => {
			const textarea = textareaRef.current;
			if (!textarea) return;
			const { selectionStart, selectionEnd } = textarea;
			const before = content.substring(0, selectionStart);
			const selected =
				content.substring(selectionStart, selectionEnd) || placeholder;
			const after = content.substring(selectionEnd);
			const newText = `${before}${syntax.replace("%s", selected)}${after}`;
			setContent(newText);
			onContentChange?.(newText);
			// reposition cursor inside syntax
			const cursorPos = before.length + syntax.indexOf(selected);
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(cursorPos, cursorPos + selected.length);
			}, 0);
		},
		[content, onContentChange],
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const val = e.target.value;
			setContent(val);
			onContentChange?.(val);
		},
		[onContentChange],
	);

	return (
		<div className={cn("w-full space-y-4", className)}>
			<Tabs
				value={activeTab}
				onValueChange={(val) => setActiveTab(val as "write" | "preview")}
			>
				<div className="mt-4 flex items-center justify-between">
					<TabsList>
						<TabsTrigger value="write">Write</TabsTrigger>
						<TabsTrigger value="preview">Preview</TabsTrigger>
					</TabsList>
					<EditorToolbar onInsertText={insertAtCursor} />
				</div>

				<TabsContent value="write" className="mt-4">
					<Textarea
						id={useId()}
						name="editor"
						ref={textareaRef}
						value={content}
						onChange={handleChange}
						placeholder="Write your blog post in markdown..."
						className={cn(
							"field-sizing-content resize-non min-h-[500px] font-mono",
							textAreaClassName,
						)}
					/>
				</TabsContent>

				<TabsContent value="preview" className="mt-4">
					<MarkdownPreview content={content} className="min-h-[500px]" />
				</TabsContent>
			</Tabs>
		</div>
	);
}
