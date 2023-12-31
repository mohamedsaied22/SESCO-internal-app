'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import React from "react";
import {SessionProvider} from "next-auth/react";

const DashboardLayout = ({
                             children
                         }: {
    children: React.ReactNode;
}) => {
    return (
        <SessionProvider>
            <div className=" min-h-[100vh] relative bg-gradient-to-t from-sky-50 via-gray-100 to-gray-100">
                <div className="h-full hidden md:w-64 md:flex md:flex-col md:fixed md:inset-y-0 z-20 ">
                    <Sidebar/>
                </div>
                <main className=" md:pl-64">
                    <Navbar/>
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}

export default DashboardLayout;