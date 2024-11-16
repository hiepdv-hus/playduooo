const a = {
    "code": "BE0000",
    "message": "success",
    "data": {
        "ce685a75-0006-5723-8da8-25d42d153ecb": {
            "id": "ce685a75-0006-5723-8da8-25d42d153ecb",
            "title": "PUBG",
            "description": "PUBG",
            "genre": "genre01",
            "thumbnail": "img/games/pubg.jpeg"
        },
        "f0660f10-fecc-5321-b4f3-e5b9ae9029ca": {
            "id": "f0660f10-fecc-5321-b4f3-e5b9ae9029ca",
            "title": "LMHT",
            "description": "LMHT",
            "genre": "genre02",
            "thumbnail": "img/games/lmht.png"
        }
    },
    "links": null,
    "relationships": null,
    "timestamp": "2024-10-29 10:24:14"
}


Object.keys(a.data).map(i => console.log(a.data[i]))