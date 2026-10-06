"use client";

import Link from "next/link";
import ArticlesButton from "@/components/UI/Button";

export default function ReturnHomeButton() {
    return (
        <ArticlesButton component={Link} href="/">
            Return to Home
        </ArticlesButton>
    );
}
