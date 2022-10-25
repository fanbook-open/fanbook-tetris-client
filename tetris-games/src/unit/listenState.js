

const listenState = {
    stack: {},
    on: (type, cb) => {
        if(!listenState.stack[type]) {
            listenState.stack[type] = [];
        }
        listenState.stack[type].push(cb)
    },
    emit: (type, ...params)=>{
        if(listenState.stack[type] && listenState.stack[type].length > 0) {
            listenState.stack[type].map(cb=> cb(...params));
        }
    },
    remove: (type, cb) =>{
        if(listenState.stack[type] && listenState.stack[type].length > 0) {
            const index = listenState.stack[type].findIndex(fn => fn === cb)
            if (index !== undefined) {
                listenState.stack[type].splice(index, 1)
            }
        }
    }  
}

export default listenState;
