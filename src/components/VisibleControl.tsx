
export const visibleByCls = (id: string, cls: string) => {
    const tar = document.getElementsByClassName(id)
    if (tar.length) {
        for(const i of tar){
            if(i)
                i.className = `${id} ${cls}`
        }

        // tar.className = 'hidden'
    }
}

export const hideByCls = (id: string) => {
    const tar = document.getElementsByClassName(id)
    if (tar.length) {
        for(const i of tar){
            if(i)
                i.className = `hidden ${id}`
        }

    }
}
