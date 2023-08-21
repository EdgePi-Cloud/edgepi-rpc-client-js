interface anyObj{
    [key: string]: any
}
export function createConfigArgsList(obj:anyObj): anyObj[]{
    console.log(obj)
    let argsList: anyObj[] = [];
    for(const key of Object.keys(obj)){
        console.log(key, obj[key])
        if(obj[key] != undefined){
            const arg = {} as anyObj;
            arg[key] = obj[key];
            argsList.push(
               arg
            )
        }
    }
    console.debug(argsList)
    return argsList
}