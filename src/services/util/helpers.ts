interface anyObj{
    [key: string]: any
}
export function createConfigArgsList(obj:anyObj): anyObj[]{
    let argsList: anyObj[] = [];
    for(const key of Object.keys(obj)){
        if(obj[key]){
            argsList.push(
                {key: obj[key]}
            )
        }
    }

    return argsList
}