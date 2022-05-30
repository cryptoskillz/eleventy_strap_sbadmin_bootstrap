/*
    todo:

    move to get request

*/
export async function onRequestPost(context) {
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
        console.log('in')
        let projectData = JSON.stringify({ data: [{ name: projectName, id: 1, createdAt: "21/1/2020", template: "<html></html>", templatename: "" }] })
        await KV.put("projects" + details.username, projectData);

    } else {
        //see if it exists;   

        projects = JSON.parse(projects);
        //console.log(projects.data.length)
        //console.log(projects.data)
        let addIt = 1;
        if (projects.data.length > 0) {
            for (var i = 0; i < projects.data.length; ++i) {

                if (projects.data[i].name == projectName) {
                    console.log(projects.data[i].name)
                    console.log(projectName)
                    return new Response(JSON.stringify({ "error": "Project already exists" }), { status: 400 });
                    addIt = 0;
                }
            }
            if (addIt == 1)
            {
                projects.data.push({ name: projectName, id: projects.data.length+1, createdAt: "21/1/2020", template: "<html></html>", templatename: "" })
                let tmpJson = JSON.stringify(projects);
                await KV.put("projects" + details.username, tmpJson)
            }
        }

    }
    return new Response(JSON.stringify(projects), { status: 200 });

}

export async function onRequestGet(context) {
    const jwt = require('@tsndr/cloudflare-worker-jwt')
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
    //console.log(bearer)
    const details = await jwt.decode(bearer, env.SECRET)
    //console.log(details)

    //set up the KV
    const KV = context.env.backpage;

    //check for projects
    let projects = await KV.get("projects" + details.username);

    let projectsData;
    if (projects == null)
        projectsData = { data: [] }
    else
        projectsData = projects;

    //return projects
    //let projects = { data: [{ name: "project 1", id: 1, createdAt: "21/1/2020", template: "<html></html>", templatename: "" }, { name: "project 2", id: 2, createdAt: "21/1/2020", template: "<html></html>", templatename: "" }] }
    //console.log(projects)
    return new Response(projectsData, { status: 200 });
}