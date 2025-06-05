"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const ClarityProvider = (): null => {
	useEffect(() => {
		const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

		if (projectId) {
			Clarity.init(projectId);
		} else {
			console.warn(
				"NEXT_PUBLIC_CLARITY_PROJECT_ID is not set in environment variables. Microsoft Clarity will not be initialized.",
			);
		}
	}, []);
	return null;
};

export default ClarityProvider;
