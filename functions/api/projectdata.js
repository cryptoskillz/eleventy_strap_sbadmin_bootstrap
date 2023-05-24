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

let dataArray = [];
let buildDataArray = (theData, theId = "") => {
    let id;
    if (theId == "")
        id = uuid.v4();
    else
        id = theId
    let projectData = { id: id, data: theData, createdAt: "21/12/2022" }
    dataArray.push(projectData)
    return (projectData)
}


let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
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
    let payLoad;
    let projectName = "";
    const contentType = request.headers.get('content-type')
    if (contentType != null) {
        payLoad = await request.json();

    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    let kvname = "projects-data" + details.username + "*" + payLoad.projectid + "*" + payLoad.dataid;

    let projectData = { data: "", id: "" }
    projectData.id = payLoad.dataid
    projectData.data = payLoad.data
    projectData = JSON.stringify(projectData)
    //await KV.delete(kvname);
    await KV.put(kvname, projectData);
    return new Response(JSON.stringify({ message: "Item updated", data: projectData }), { status: 200 });


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
        payLoad = await request.json();

    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    let id = uuid.v4();
    let projectData = { data: "", id: "" }
    projectData.id = id
    projectData.data = payLoad.data
    let kvname = "projects-data" + details.username + "*" + payLoad.projectid + "*" + id;
    //check it does not already exist
    projectData = JSON.stringify(projectData)
    //await KV.delete(kvname);
    await KV.put(kvname, projectData);
    return new Response(JSON.stringify({ message: "Item added", data: projectData }), { status: 200 });


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

    contentType = request.headers.get('content-type');
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
        let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.backpage;
        //console.log("projects-data" + details.username + "*" + payLoad.projectid + "*" + payLoad.dataid)
        await KV.delete("projects-data" + details.username + "*" + payLoad.projectid + "*" + payLoad.dataid);
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
    try {
        //set the results object
        let results = []
        //get the search params
        const { searchParams } = new URL(request.url);
        //get the project id
        let projectId = searchParams.get('projectid');
        //get the schema
        const query = context.env.DB.prepare(`SELECT id,isUsed,fieldName from projectSchema where projectId = '${projectId}'`);
        const queryResults = await query.all();
        //get the projects and group by id
        const query2 = context.env.DB.prepare(`SELECT projectData.projectDataId from projectData where projectData.projectId = '${projectId}' group by projectDataId `);
        //get the results
        const queryResults2 = await query2.all();
        //loop through the projectdata results
        for (var i = 0; i < queryResults2.results.length; ++i) {
            //get the id
            let projectDataId = queryResults2.results[i].projectDataId;
            //get the data
            const query3 = context.env.DB.prepare(`SELECT projectData.id,projectData.projectDataId,projectData.schemaId,projectSchema.isUsed,projectSchema.fieldName,projectData.fieldValue from projectData LEFT JOIN projectSchema ON projectData.schemaId = projectSchema.id where projectData.projectDataId = '${projectDataId}' `);
            //get the results
            const queryResults3 = await query3.all();
            //put them into our array
            results.push(queryResults3.results);
            //debugs
            //console.log(queryResults3.results)
        }
        //make a data object
        let finData = {};
        //store the schema
        finData.schema = queryResults.results;
        //store the results. 
        finData.data = results;
        //debug
        //console.log(queryResults)
        //console.log(queryResults2)
        //console.log(finData);
        return new Response(JSON.stringify(finData), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}