/*
    todo:



    notes:


    naming convertion for KV stores.

    project-data<username>*<projectid>*<dataid>

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
        //await KV.delete("projects" + details.username + "*" + payLoad.id);
        return new Response(JSON.stringify({ message: "item deleted" }), { status: 200 });
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

    const { searchParams } = new URL(request.url)
    let projectid = searchParams.get('projectid')

    let details = await decodeJwt(request.headers, env.SECRET)
    //set up the KV
    const KV = context.env.backpage;
    //get the projects based on the name
    let kv = await KV.list({ prefix: "projects-data" + details.username + "*"+projectid+"*" });

    let projectsData = { data: [] }
    if (kv.keys.length > 0) {
        for (var i = 0; i < kv.keys.length; ++i) {
            let tmp = kv.keys[i].name.split('*');
            //console.log(kv.keys[i])
            //console.log("projects-data" + details.username + "*" + tmp[1]+"*"+tmp[2])
            let pData = await KV.get("projects-data" + details.username + "*" + tmp[1]+"*"+tmp[2]);
            //debug for easy clean up
            //await KV.delete("projects-" + details.username+"*"+tmp[2]);
            projectsData.data.push(JSON.parse(pData))
        }
    }
    return new Response(JSON.stringify(projectsData), { status: 200 });

}