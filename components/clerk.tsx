"use client";
import React from 'react';
import {ClerkLoaded, SignInButton, useUser} from "@clerk/nextjs";
import Link from "next/link";
import  {TrolleyIcon} from "@sanity/icons";
import { ShoppingBag, User} from "lucide-react";

const Header = () => {
    const {user}= useUser();

    return (
        <header className="flex flex-wrap justify-between item-center px-4 py-2" >
            <div className="flex w-full flex-wrap justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0">
                    Becky in Japan
                </Link>
                {/*<Form action="/search" className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0">*/}
                {/*    <input type="text"*/}
                {/*           name="query"*/}
                {/*           placeholder="Search for products"*/}
                {/*           className="bg-gray text-gray-800 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"/>*/}
                {/*    <div className="flex">*/}
                {/*        <button type="submit" className="text-white">*/}
                {/*            S*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</Form>*/}

                <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
                <Link href="/Cart" className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        <TrolleyIcon className="size-5"/>
                        {/*span item count once global state is implemented*/}
                        <span>Cart</span>
                    </Link>

                    <ClerkLoaded>
                        {user && (
                            <Link href="/orders" className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                <ShoppingBag className="size-5"/>
                                <span>My Orders</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-2">
                                <User className="size-5"/>

                                <div className="hidden sm:block text-xs">
                                    <p className="text-gray-400">Welcome Back</p>
                                    <p className="font-bold">{user.fullName}</p>
                                </div>
                            </div>
                        ):(
                            <SignInButton mode="modal"/>
                        )}
                    </ClerkLoaded>

                </div>
            </div>
        </header>
    );
};

export default Header;