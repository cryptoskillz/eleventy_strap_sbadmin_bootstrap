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


export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

let grrr = ""
    try {
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


        //delete the data
        let kv = await KV.list({ prefix: "projects-data" + details.username + "*" + payLoad.id + "*" });
        //delte old records
        if (kv.keys.length > 0) {
            for (var i = 0; i < kv.keys.length; ++i) {
                await KV.delete(kv.keys[i].name);
                //console.log('deleted '+kv.keys[i].name)
            }
        }

        //add new records
        if (payLoad.data.length > 0) {
            for (var i = 1; i < payLoad.data.length; ++i) {
                let id = uuid.v4();
                let projectData = { data: "", id: "" }
                projectData.id = id
                projectData.data = payLoad.data[i]
                let kvname = "projects-data" + details.username + "*" + payLoad.id + "*" + id;
                //check it does not already exist
                await KV.put(kvname, JSON.stringify(projectData));
                //console.log(kvname)

            }
        }


        //update the schema
        let projectData = await KV.get("projects" + details.username + "*" + payLoad.id);
        projectData = JSON.parse(projectData)
        let tmp = payLoad.fields.originalfields.toString();
        let schemaJson = {
            "fields": tmp,
            "originalfields": tmp
        }
        projectData.schemas.fields = tmp
        projectData.schemas.originalfields =tmp
        await KV.put("projects" + details.username + "*" + payLoad.id, JSON.stringify(projectData));
        return new Response(JSON.stringify({ message: `${kv.keys.length} records imported` }), { status: 200 });
    } catch (error) {
        return new Response(error, { status: 200 });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}