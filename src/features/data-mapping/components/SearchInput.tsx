import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function SearchInput({
	value,
	onChange,
	placeholder = "Search...",
	className,
}: SearchInputProps) {
	return (
		<div className={`relative ${className || ""}`}>
			<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pl-9"
			/>
		</div>
	);
}
