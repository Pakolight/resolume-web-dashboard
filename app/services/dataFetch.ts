import Transport from "../services/Transport";

export interface ColumnData {
    id: number;
    name: {
        valuetype: "ParamString";
        id: number;
        value: string;
    };
    colorid: {
        id: number;
        valuetype: "ParamChoice";
        value: string;
        index: number;
        options: any[];
    };
    connected: {
        valuetype: "ParamBoolean";
        value: boolean;
        id: number;
    };
}



const server: string = import.meta.env.VITE_SERVER;
const BASE_DIR: string = import.meta.env.VITE_BASE_DIR;

// ✅ Создаём экземпляр Transport для WebSocket соединения
const transport = new Transport(server.split(":")[0], Number(server.split(":")[1]));

async function fetchColumnStatus(columnNumber: number) {
    const url = `http://${server}/api/v1/composition/columns/${columnNumber}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'accept': 'application/json' },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Ошибка при обновлении текста:", response.status, errorText);
        throw new Error('Ошибка при отправке данных');
    }

    const data: ColumnData = await response.json();
    return data;
}

export async function getColumnStatus(columnsToCheck: number[]) {
    const requests: Promise<ColumnData>[] = [];
    for (const column of columnsToCheck) {
        requests.push(fetchColumnStatus(column));
    }
    const results = await Promise.all(requests);
    return results;
}

export async function connectColumn(columnToConnectById: string) {
    const url = `http://${server}/api/v1/composition/columns/by-id/${columnToConnectById}/connect`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Ошибка при подключении колонки');
    }

    return response.status;
}

export async function loadVideosPath(clipIndex: string, fileName: string) {
    const url = `http://${server}/api/v1/composition/layers/3/clips/${Number(clipIndex) + 9}/open`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: `file:///${BASE_DIR}/videoserver/public/videos/${fileName}`,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.status;
}

export async function undo() {
    const url = `http://${server}/api/v1/composition/action`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: "undo",
    });

    return response.status;
}

function setParamById(id: string, value: string) {
    transport.send_message({
        action: 'set',
        parameter: `/parameter/by-id/${id}`,
        value: value,
    });
}
export async function updateText(clipIndex: string, newText: string) {
    const url = `http://${server}/api/v1/composition/layers/1/clips/${clipIndex}`
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    const clipData= await response.json();
    const TextBlockId = clipData.video.effects.map((effect: { name: string; params: { Text: { id: any; }; }; }) =>{
        if (effect.name === "TextBlock"){
            return effect.params.Text.id;
        }
    })[1]
    console.log("This is text block id" ,TextBlockId)

    setParamById(TextBlockId, newText);

}

export async function updateCulmnName(clipIndex: string, newText: string) {
    // const url = `http://${server}/api/v1/composition/columns/1739882963681${clipIndex}`
    // const response = await fetch(url, {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' },
    // })
    // const clipData= await response.json();
    // const TextBlockId = clipData.video.effects.map((effect: { name: string; params: { Text: { id: any; }; }; }) =>{
    //     if (effect.name === "TextBlock"){
    //         return effect.params.Text.id;
    //     }
    // })[1]
    // console.log("This is text block id" ,TextBlockId)

    setParamById("1739882963681", "New Name");

}

