/*
    todo:

    add put

    rationalise the code base
        bearer function
        KV find
        KV put
        KV add
        KV delete
        cotent type

*/

let projectId;
let payLoad;
let contentType;
const jwt = require('@tsndr/cloudflare-worker-jwt')
var uuid = require('uuid');


let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    //console.log(details)
    return (details)
}



export async function onRequestPut(context) {
    const jwt = require('@tsndr/cloudflare-worker-jwt')
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    contentType = request.headers.get('content-type');
    //console.log(contentType)
    if (contentType != null) {
        payLoad = await request.json();
        console.log(payLoad)
                let details = await decodeJwt(request.headers, env.SECRET)

        //let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.backpage;
        let projectData = await KV.get("projects" + details.username + "*" + payLoad.id);
        projectData = JSON.parse(projectData)
        if (projectData.name != undefined)
            projectData.name = payLoad.name;
         if (projectData.template != undefined)
            projectData.template = payLoad.template;        
        if (projectData.templatename != undefined)
            projectData.templatename = payLoad.templatename;       
        
        await KV.put("projects" + details.username + "*" + payLoad.id, JSON.stringify(projectData));

    }

    return new Response({ message: "put" }, { status: 200 });

}

export async function onRequestDelete(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    //return new Response({message:"delete"}, { status: 200 });
    contentType = request.headers.get('content-type');
    //console.log(contentType)
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
        //console.log(payLoad)
        let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.backpage;
        await KV.delete("projects" + details.username + "*" + payLoad.id);
        return new Response(JSON.stringify({ message: "item deleted" }), { status: 200 });
    }
}
export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    let payLoad;
    let projectName = "";
    const contentType = request.headers.get('content-type')
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    //check if it exists
    let exists = await KV.get("projects" + details.username + "|" + payLoad.name);
    if (exists != null)
        return new Response(JSON.stringify({ error: "Item exists" }), { status: 400 });
    else {
        //alternate key method
        //let projects = await KV.list({ prefix: "projects" + details.username + "*" });
        //console.log(projects.keys.length)
        //let projectsData = {data: []}
        //let id = projects.keys.length+1

        let id = uuid.v4();
        let projectData = { id: id, name: payLoad.name, createdAt: "21/12/2022",templatename:"",template:"" }
        await KV.put("projects" + details.username + "*" + id, JSON.stringify(projectData));
        return new Response(JSON.stringify({ message: "Item added" }), { status: 200 });

    }
}

export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    let details = await decodeJwt(request.headers, env.SECRET)
    //set up the KV
    const KV = context.env.backpage;
    //get the projects based on the name
    let projects = await KV.list({ prefix: "projects" + details.username + "*" });
    console.log(projects)
    let projectsData = { data: [] }
    if (projects.keys.length > 0) {
        for (var i = 0; i < projects.keys.length; ++i) {
            let tmp = projects.keys[i].name.split('*');
            //console.log("projects" + details.username + "|" + tmp[1])
            let pData = await KV.get("projects" + details.username + "*" + tmp[1]);
            //console.log(pData)
            //debug for easy clean up
            //await KV.delete("projects-" + details.username+"*"+tmp[2]);
            projectsData.data.push(JSON.parse(pData))
        }
    }
    return new Response(JSON.stringify(projectsData), { status: 200 });
}