import type { Route } from "./+types/home";
import {useFetcher, } from "react-router";
import ButtonVsLoad from "~/ui/buttons/ButtonVsLoad";
import ButtonVideo from "~/ui/buttons/ButtonVideo";
import Input from "~/ui/inputs/Input";
import type {ColumnData} from "~/services/dataFetch";

import {getColumnStatus} from "~/services/dataFetch";
import {useEffect, useState} from "react";
import {connectColumn} from "~/services/dataFetch";
import {loadVideosPath} from "~/services/dataFetch";
import {updateText, updateCulmnName} from "~/services/dataFetch";
import path from "path";
import fs from "fs/promises";
import ButtonMain from "~/ui/buttons/ButtonMain";

const PREDEFINED_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8];
const CUSTOM_COLUMNS = [9, 10, 11, 12, 13, 14, 15, 16];


async function fetchColumnStatuses(): Promise<ColumnData[][]> {
    return Promise.all([getColumnStatus(PREDEFINED_COLUMNS), getColumnStatus(CUSTOM_COLUMNS)]);
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const columnId = formData.get('column');

    if (request.method === 'PATCH') {
        console.log("PATCH");
        const param = formData.get('param');
        const index = formData.get('index');

        if (param === 'textBlock') {
            const newText = formData.get('value');
            console.log({msg: "Data from for", index, newText} );
            if (index !== null && newText !== null) {
                updateText(index.toString(), newText.toString());
            } else {
                throw new Error("Missing index or newText");
            }}
        if(param === 'columnName'){
            const newName = formData.get('value');
            updateCulmnName("some", "thing");

        }
    }
    if (request.method === 'PUT'){
        const file = formData.get('file') as File;
        const index = formData.get('index');
        if (file && typeof file.arrayBuffer === 'function') {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const uploadDir = path.join(process.cwd(), 'public', 'videos')
            await fs.mkdir(uploadDir, { recursive: true })

            const extension = file.name.split('.').pop()
            const newFileName = `${columnId}.${extension}`
            console.log("file name is", newFileName);
            const filePath = path.join(uploadDir, newFileName)
            await fs.writeFile(filePath, buffer)
            if (index !== null && columnId !== null) {
                const resLoadVideosPath = await loadVideosPath(index.toString(), newFileName.toString());
                if (resLoadVideosPath === 204) {
                    return await fetchColumnStatuses();
                    // Setup some pop-up message
                }
            } else {
                throw new Error("Index is null");
            }

        } else {
            throw new Error("Uploaded file is not a valid File object");
        }
    }
    if (request.method === 'POST'){
        if (columnId === null) {
            throw new Error("Column is null");
        }
        return await connect(columnId.toString());
        }
    }

const connect = async (columnId:string) => {
    if (typeof columnId !== 'string') {
        throw new Error("Wrong type columnId");
    }
    const responseStatus =  await connectColumn(columnId);
    if (responseStatus === 204) {
        // Добавляем задержку перед вызовом fetchColumnStatuses
        await new Promise((resolve) => setTimeout(resolve, 35));

        const colStatus = await fetchColumnStatuses();

        // Логируем статус колонки
        colStatus.forEach((col) => {
            col.forEach((column) => {
                if (column.id.toString() === columnId) {
                    console.log(`ID is ${columnId} ==> status is ${column.connected.value}`);
                }
            });
        });

        return colStatus
    }


}

export async function loader() {
    return await fetchColumnStatuses();
}



const styles = {
      buttonWraper: "group-hover:border-gray-300 duration-100 relative border-1 md:border-2 group-active:bg-neutral-500 " +
          "border-cyan-500 rounded-lg w-10 h-15 md:w-20 md:h-25 bg-neutral-800",
      button: "group-hover:bg-gray-300 duration-10 group-active:bg-neutral-500 border-2 border-neutral-800 rounded-lg " +
          "bg-cyan-500 w-full h-1/4 absolute bottom-0"
  }

export function meta({ }: Route.MetaArgs) {
      return [
          { title: "New React Router App" },
          { name: "description", content: "Welcome to React Router!" },
      ];
  }

export default function Home({loaderData, actionData}: {loaderData: any, actionData: any}) {
      const [action, setAction] = useState<ColumnData | undefined>();
      const [edit, setEdit] = useState<boolean>(false);
      const [columnsPredefined, setColumnsPredefined] = useState<ColumnData[]>([]);
      const [columnsCustom, setColumnsCustom] = useState<ColumnData[]>([]);
      const [countLoad, setCountLoad] = useState<number>(0);
      const [columnsPredefinedName, setColumnsPredefinedName] = useState<string[]>([]);
        const [columnsCustomName, setColumnsCustomName] = useState<string[]>([]);


      const updateButtons = (defaultColumnsData : ColumnData[], columnsCustomData: ColumnData[]) => {
          if (defaultColumnsData?.length > 0) {
              const defaultColumns = defaultColumnsData.map((col: any) => col || []);
              setColumnsPredefined(defaultColumns);
          }
          if (columnsCustomData?.length > 0) {
              const defaultColumns = columnsCustomData.map((col: any) => col || []);
              setColumnsCustom(defaultColumns);
          }
      }

      useEffect(() => {
          if (countLoad === 0) {
            updateButtons(loaderData[0], loaderData[1]);
            setCountLoad(1);}
          else {
              if (action) {
                  updateButtons(
                      Array.isArray(action) && Array.isArray(action[0]) ? action[0] : loaderData[0],
                      Array.isArray(action) && Array.isArray(action[1]) ? action[1] : loaderData[1]
                  );
              }

          }


          const predefinedStr = localStorage.getItem("columnsPredefinedName");
          const customStr = localStorage.getItem("columnsCustomName"); // исправлен ключ

          const columnsPredefinedName: string[] = predefinedStr ? JSON.parse(predefinedStr) : [];
          const columnsCustomName: string[] = customStr ? JSON.parse(customStr) : [];


          if(columnsPredefinedName.length === 0 && columnsCustomName.length === 0){
              const columnsPredefinedName: string[] = []
              const columnsCustomName: string[] = []
              loaderData[0].forEach((col: ColumnData) => {
                    columnsPredefinedName.push(col.name.value)
              })
              loaderData[1].forEach((col: ColumnData) => {
                  columnsCustomName.push(col.name.value)
              })
                localStorage.setItem("columnsPredefinedName", JSON.stringify(columnsPredefinedName))
                localStorage.setItem("columnsCustomName", JSON.stringify(columnsCustomName))
                setColumnsCustomName(columnsCustomName)
                setColumnsPredefinedName(columnsPredefinedName)
          }
          else {
              setColumnsCustomName(columnsCustomName)
              setColumnsPredefinedName(columnsPredefinedName)
          }

      }, [action]);


      return (
          <div className={"bg-cyan-500 mx-auto min-h-screen py-2 h-full"}>
              <div className={"page flex flex-col items-center"}>
                  <div className={"flex flex-row gap-2"}>
                      <h1 className={'text-main text-center mb-12'}>Video dashboard</h1>
                      <ButtonMain className={"h-8"} onClick={() => setEdit(!edit)}>{!edit? "Edit": "Live"}</ButtonMain>
                  </div>
                  <div className=" flex flex-row lg:flex-col items-center gap-4">
                      <div className="flex flex-col items-center border-1 md:border-2 border-cyan-500 rounded-lg p-4 gap-2" >
                          <h2 className={'text-xs text-white text-main text-center'}>Predefined </h2>
                          <div className="grid grid-flow-col grid-rows-8 lg:grid-rows-1 lg:gap-2 justify-center">
                              {Array.isArray(columnsPredefined) && columnsPredefined.length > 0 &&
                                  columnsPredefined.map((col, idx) => {
                                      if (idx == 7){
                                          return (
                                              <ButtonVideo className={!edit?"hidden": ""}
                                                           name={col.id} key={col.id}
                                                           clicked={col.connected.value}
                                                           setAction={setAction}
                                                           index={idx}
                                                           colName={columnsPredefinedName[idx].replace("#", String(idx + 1))} >
                                                  <Input className={!edit?"hidden": ""} index={idx + 1}/>

                                              </ButtonVideo>

                                          )
                                      }
                                      else {
                                          return (
                                              <ButtonVideo index={idx} className={!edit?"hidden": ""} name={col.id} key={col.id} clicked={col.connected.value}
                                                           setAction={setAction} children={undefined}
                                                           colName={columnsPredefinedName[idx].replace("#", String(idx + 1))} />
                                          )
                                      }
                                     
                                  })
                              }
                          </div>
                      </div>
                      <div className="flex flex-col items-center border-1 md:border-2 border-cyan-500 rounded-lg p-4 gap-2">
                          <h2 className={'text-xs text-white text-main text-center'}>Custom </h2>
                          <div className="grid grid-flow-col grid-rows-8 lg:grid-rows-1 lg:gap-2 justify-center">
                              {
                                  columnsCustom.map((col, idx) => {
                                      return (
                                          <ButtonVsLoad className={!edit?"hidden": ""} idx={idx} name={col.id} key={col.id} clicked={col.connected.value}
                                                        setAction={setAction}
                                                        colName={columnsCustomName[idx].replace("#", String(idx + 9))}/>
                                      )
                                  })
                              }
                          </div>
                      </div>
                      <div className="hidden lg:block items-center border-1 lg:border-2 border-cyan-500 rounded-lg p-4 gap-2
                      overflow-hidden text-ellipsis">
                          <h2 className={"text-white text-center font-mono font-bold mb-2"}>User Manual for Uploading a New Video</h2>
                          <h3 className={"font-mono text-xs text-white m-1"}>To download a new video, you can use the website:&nbsp;
                              <a className={"underline"} href="https://motionarray.com/browse/stock-video/vj-loops-1/">
                                  motionarray.com</a>
                          </h3>
                            <h3 className={"font-mono text-xs text-white m-1"}>After downloading the video, you need to
                                click on the "Load video" button and select the downloaded file.
                            </h3>
                          <h3 className={"font-mono text-xs text-white m-1"}>
                              Please note that this is a low-resolution screen, so there is no need to upload
                              high-quality videos. Downloading the preview version will be sufficient.
                          </h3>

                      </div>
                  </div>
              </div>
          </div>
      )
  }