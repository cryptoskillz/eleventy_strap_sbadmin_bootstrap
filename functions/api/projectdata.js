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
    //get the bearer token
    let bearer = req.get('authorization');
    //check they sent a bearer token
    if (bearer == null) {
        //send blank
        return ("")
    } else {
        //check if its a bearer token
        try {
            let details = await jwt.decode(bearer, secret)
            return (details)
        } catch (error) {
            console.log(error)
            return("")
        }

    }
}

export async function onRequestPut(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let token = await decodeJwt(request.headers, env.SECRET);
    //check its valid
    if (token == "") {
        return new Response(JSON.stringify({ error: "not authorised to update records" }), { status: 400 });
    } else {
        //get the content type
        const contentType = request.headers.get('content-type')
        //set a data array
        let theData;
        //set a query values var
        let theQueryValues = "updatedAt = CURRENT_TIMESTAMP";
        //set a query where
        let theQueryWhere = "";
        //check we have a content type
        if (contentType != null) {
            //get the data
            theData = await request.json();
            //loop through the data
            for (var i = 0; i < theData.data.length; ++i) {
                //build the update query
                let theQuery = `UPDATE projectData SET `
                //loop through the field values
                for (const key in theData.data[i]) {
                    //set the data
                    const tdata = theData.data[i];
                    //check it is not an id or table 
                    if ((key != "table") && (key != "id")) {
                        //build the fields
                        theQueryValues = theQueryValues + `,fieldValue = '${tdata[key]}' `
                    }
                    //check for ad id and add a put.
                    if (key == "id")
                        theQueryWhere = ` where id = '${tdata[key]}'`

                }
                //build the query
                theQuery = theQuery + theQueryValues + ` ${theQueryWhere}`;
                //return it
                const info = await context.env.DB.prepare(theQuery).run();
            }
            //return
            return new Response(JSON.stringify({ message: `The record has been updated` }), { status: 200 });
        }
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
        //make a data object
        let finData = {};
        //set the results object
        let results = []
        //get the search params
        const { searchParams } = new URL(request.url);
        //get the project id
        let projectId = searchParams.get('projectid');
        console.log(projectId)
        //get the project dataId 
        const projectDataId = searchParams.get('projectDataId');
        if (projectId != null) {
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

            //store the schema
            finData.schema = queryResults.results;
            //store the results. 
            finData.data = results;
        } else {
            //return the one project
            const queryData = context.env.DB.prepare(`SELECT projectData.id,projectData.projectDataId,projectData.schemaId,projectSchema.isUsed,projectSchema.fieldName,projectData.fieldValue from projectData LEFT JOIN projectSchema ON projectData.schemaId = projectSchema.id where projectData.projectDataId = '${projectDataId}' `);
            //get the results
            const queryDataResults = await queryData.all();
            //put them into our array
            //results.push(queryDataResults.results);
            finData.data = queryDataResults.results;
        }
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