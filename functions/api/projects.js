/*
    todo:

    add put
    delete project

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


let testIt = () => {
    console.log('it works')
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

    return new Response({ message: "put" }, { status: 200 });

}

export async function onRequestDelete(context) {
    testIt()
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
        let bearer = request.headers.get('authorization')
        bearer = bearer.replace("Bearer ", "");
        //console.log(bearer)
        const details = await jwt.decode(bearer, env.SECRET)
        //console.log(projectId);
        const KV = context.env.backpage;

        let projects = await KV.get("projects" + details.username);
        //projects = null
        if (projects == null) {
            //console.log('in')
            return new Response(JSON.stringify({ error: "no projects" }), { status: 200 });
        } else {
            //see if it exists;   
            projects = JSON.parse(projects);
            let deleteIt = 1;
            if (projects.data.length > 0) {
                for (var i = 0; i < projects.data.length; ++i) {

                    if (projects.data[i].id == payLoad.id) {
                        console.log('found it')
                        deleteIt = 0;
                    }
                }
                if (deleteIt == 1) {
                    console.log('delete it')
                    return new Response(JSON.stringify({ message: "deleted" }), { status: 200 });
                } else {
                    return new Response(JSON.stringify({ error: "project not found" }), { status: 200 });
                }
            }
        }

        //return new Response(JSON.stringify({ error: "no id set" }), { status: 200 });
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
        projectName = payLoad.name;
        //console.log(projectName)
    }
    //decode jwt
    let bearer = request.headers.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    //console.log(bearer)
    const details = await jwt.decode(bearer, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    let projects = await KV.get("projects" + details.username);
    //projects = null
    if (projects == null) {
        let projectData = JSON.stringify({ data: [{ name: projectName, id: 1, createdAt: "21/1/2020", template: "<html></html>", templatename: "" }] })
        await KV.put("projects" + details.username, projectData);

    } else {
        //see if it exists;   

        projects = JSON.parse(projects);
        let addIt = 1;
        if (projects.data.length > 0) {
            for (var i = 0; i < projects.data.length; ++i) {

                if (projects.data[i].name == projectName) {
                    return new Response(JSON.stringify({ "error": "Project already exists" }), { status: 400 });
                    addIt = 0;
                }
            }
            if (addIt == 1) {
                projects.data.push({ name: projectName, id: projects.data.length + 1, createdAt: "21/1/2020", template: "<html></html>", templatename: "" })
                let tmpJson = JSON.stringify(projects);
                await KV.put("projects" + details.username, tmpJson)
            }
        }

    }
    return new Response(JSON.stringify(projects), { status: 200 });

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
    let bearer = request.headers.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    const details = await jwt.decode(bearer, env.SECRET)
    //set up the KV
    const KV = context.env.backpage;
    //check for projects
    let projects = await KV.get("projects" + details.username);
    let projectsData;
    if (projects == null)
        projectsData = { data: [] }
    else
        projectsData = projects;
    return new Response(projectsData, { status: 200 });
}