import React from "react";

interface ButtonMain {
    children: React.ReactNode,
    onClick?: () => void
    className?: string
}


export default function ButtonMain({children, onClick, className}: ButtonMain) {
    return (
        <button onClick={onClick} className={`relative p-1 border rounded-sm border-white text-white hover:bg-gray-300 duration-100 hover:text-black active:bg-black active:text-white ${className}`} >{children}</button>
    )
}