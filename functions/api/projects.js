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
    return new Response(JSON.stringify(projectsData), { status: 200 });
}