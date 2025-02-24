import {useState} from "react";
import ButtonMain from "~/ui/buttons/ButtonMain";

import {useFetcher} from "react-router";

export default function Input({index, className}: { index: number, className?: string }) {
    const [newText, setNewText] = useState<string>("");
    const fetcher = useFetcher();

    function handleClick() {
        const formData = new FormData();
        formData.append("value", newText);
        formData.append("index", (index.toString()));
        formData.append("param", "textBlock");
        fetcher.submit(formData, { method: "patch", });
    }

    return (
        <div className={`relative right-[59px] flex flex-col gap-1 w-25 md:right-[54px] ${className}`}>
            <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                type="text"
                className="relative z-3 p-1 border rounded-sm  bg-neutral-800 text-white text-xs "
            />
            <ButtonMain className={"relative z-3"} onClick={handleClick}>Apply</ButtonMain>
        </div>
    );
}