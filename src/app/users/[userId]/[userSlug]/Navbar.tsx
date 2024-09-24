"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { FaHome, FaQuestionCircle, FaComments, FaVoteYea } from "react-icons/fa"; // Importing icons

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`,
            icon: <FaHome className="w-5 h-5" />, // Icon for Summary
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
            icon: <FaQuestionCircle className="w-5 h-5" />, // Icon for Questions
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
            icon: <FaComments className="w-5 h-5" />, // Icon for Answers
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
            icon: <FaVoteYea className="w-5 h-5" />, // Icon for Votes
        },
    ];

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            {/* Vertical Navbar for larger screens */}
            <ul className="hidden sm:flex flex-col w-full shrink-0 gap-2">
                {items.map(item => (
                    <li key={item.name} className="w-full">
                        <Link
                            href={item.href}
                            className={`block rounded-full px-4 py-2 text-white text-center transition-all duration-200 transform ${pathname === item.href
                                ? "bg-blue-500/80 scale-105 shadow-lg"
                                : "hover:bg-blue-500/80 hover:scale-105"
                                }`}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
            {/* Horizontal Navbar for small screens with only icons */}
            <div className="flex sm:hidden justify-around mt-2">
                {items.map(item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-center rounded-full p-3 bg-black shadow-md hover:bg-blue-500 transition-all duration-200 ${pathname === item.href ? "bg-blue-500/80" : ""}`}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Navbar;
