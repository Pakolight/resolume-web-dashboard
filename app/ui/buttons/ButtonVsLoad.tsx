import {useFetcher} from "react-router";
import React, {useEffect} from "react";
import type {ColumnData} from "~/services/dataFetch";


interface ButtonVsLoadProps {
    idx: number,
    name: number,
    clicked: boolean,
    setAction: React.Dispatch<React.SetStateAction<ColumnData | undefined>>,
    className?: string,
    colName?: string
}


export default function ButtonVsLoad({idx, name, clicked, setAction, className, colName}: ButtonVsLoadProps) {
    const fetcher = useFetcher()
    useEffect(() => {
        console.log(fetcher.state)
        if (fetcher.state === "idle" && fetcher.data) {
            console.log(fetcher.data)
            setAction(fetcher.data)
        }
    }, [fetcher.state]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("column", name.toString());
            formData.append("index", idx.toString());
            fetcher.submit(formData, {method: "put", encType: "multipart/form-data"});
        }

    };

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const columnsCustomName = JSON.parse(localStorage.getItem("columnsCustomName") as string)
        if (idx !== undefined)
        {
            columnsCustomName[idx] = e.target.value
            localStorage.setItem("columnsCustomName", JSON.stringify(columnsCustomName))
            columnsCustomName[idx] = e.target.value
            localStorage.setItem("columnsCustomName", JSON.stringify(columnsCustomName))

        }}


    return (
        <fetcher.Form method="post" className={"relative text-center"}>
            <div className={`${className} bg-edit`}></div>
            <div className="group ">
                <div  className={`${clicked ?"border-gray-300" : "border-cyan-500"} relative btn-video`}>
                    <button className={"absolute w-full h-full"} type={!!className? "submit": "button"}></button>
                    <img  src={`http://192.168.2.6:8080/api/v1/composition/layers/3/clips/${(idx ?? 0) + 9}/thumbnail`} alt=""/>
                    <input className={"hidden"} name={"column"} value={name} readOnly/>
                    <input onBlur={(e) => handleBlur(e)}
                        className={`${clicked ? "bg-gray-300" : ""} ${!!className? "": "bg-white border-1"} title-btn-video`} disabled={!!className} placeholder={colName}>
                    </input>
                </div>
            </div>
            <div
                className={`${clicked ? "bg-gray-300" : ""} ${className} bg-cyan-500 hover:bg-gray-300 
                duration-100 hover:text-black  rounded-lg relative text-xs text-white p-1 w-30 text-center
                mb-4 lg:w-28`}>
                Load video
                <input type="file" name={"file"}
                       onChange={handleFileChange}
                       className={`${className} absolute p-3 w-30 text-[0px] appearance-none border-0 rounded-lg outline-none text-xs top-0 left-0`}/>
            </div>
        </fetcher.Form>
    )
}