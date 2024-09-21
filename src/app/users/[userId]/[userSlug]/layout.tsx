import { avatars } from "@/models/client/config";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { userId: string; userSlug: string };
}) => {
    const user = await users.get<UserPrefs>(params.userId);
    console.log(user)

    return (
        <div className="container mx-auto space-y-6 px-6 pb-20 pt-32">
            <div className="flex flex-col gap-6 sm:flex-row bg-transparent shadow-lg rounded-lg p-6">
                <div className="w-40 shrink-0">
                    <picture className="block w-full">
                        <img
                            src={avatars.getInitials(user.name, 200, 200).href}
                            alt={user.name}
                            className="h-full w-full rounded-xl object-cover border-4 border-gradient-to-br from-blue-400 to-purple-500 shadow-lg"
                        />
                    </picture>
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div className="block space-y-1">
                            <h1 className="text-4xl font-bold text-white hover:text-cyan-300 transition-colors duration-200">{user.name}</h1>
                            <p className="text-lg text-gray-300">{user.email}</p>
                            <p className="flex items-center gap-1 text-sm text-gray-400">
                                <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
                                <span className="font-bold">{convertDateToRelativeTime(new Date(user.$createdAt))}</span>
                            </p>
                            <p className="flex items-center gap-1 text-sm text-gray-400">
                                <IconClockFilled className="w-4 shrink-0" /> Last activity{" "}
                                <span className="font-bold">{convertDateToRelativeTime(new Date(user.$updatedAt))}</span>
                            </p>
                        </div>
                        <div className="shrink-0">
                            <EditButton />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row">
                <Navbar />
                <div className="flex-1 p-4 rounded-lg shadow-inner bg-gray-800">{children}</div> {/* Dark background for children */}
            </div>
        </div>
    );
};

export default Layout;
