import {useFetcher} from "react-router";
import React, {useEffect} from "react";
import type {ColumnData} from "~/services/dataFetch";


interface ButtonVsLoadProps {
    name: number,
    clicked: boolean,
    setAction: React.Dispatch<React.SetStateAction<ColumnData | undefined>>,
    children: React.ReactNode,
    colName?: string,
    className?: string,
    index?: number
}


export default function ButtonVideo({
                                        name,
                                        clicked,
                                        setAction,
                                        children,
                                        colName,
                                        className,
                                        index
                                    }: ButtonVsLoadProps) {
    const fetcher = useFetcher()

    useEffect(() => {
        console.log(fetcher.state)
        if (fetcher.state === "idle" && fetcher.data) {
            console.log(fetcher.data)
            setAction(fetcher.data)
        }
    }, [fetcher.state]);

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const columnsPredefinedName = JSON.parse(localStorage.getItem("columnsPredefinedName") as string)
        if (index !== undefined) {
            console.log({msg: "HandlerBlur", columnsPredefinedName, index, value: e.target.value})
            columnsPredefinedName[index] = e.target.value
            localStorage.setItem("columnsPredefinedName", JSON.stringify(columnsPredefinedName))

        }
    }
    return (
        <div className={"flex flex-col justify-center "}>
            <fetcher.Form method={"post"} className={"relative"}>
                <div className={`${className} bg-edit`}></div>
                <div className="group">
                    <div className={`${clicked ? "border-gray-300" : "border-cyan-500"} btn-video`}>
                        <button className={"absolute w-full h-full"} type={!!className? "submit": "button"}></button>
                        <img src={`http://192.168.2.6:8080/api/v1/composition/layers/3/clips/${(index ?? 0) + 1}/thumbnail`} alt=""/>
                        <input className={"hidden"} name={"column"} value={name} readOnly
                        />
                        <input onBlur={(e) => handleBlur(e)}
                               className={`${clicked ? "bg-gray-300" : ""} ${!!className ? "" : "bg-white border-1"} title-btn-video`}
                               disabled={!!className}
                               placeholder={colName}>
                        </input>
                        {children}
                    </div>
                </div>
                <div className={`${className} w-full h-[41px]`}></div>
            </fetcher.Form>
        </div>
    )
}