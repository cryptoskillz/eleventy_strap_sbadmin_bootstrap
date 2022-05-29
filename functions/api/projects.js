/*
    todo:
    update the KV with their JWT secret
    trap the gets / puts etc
*/
export async function onRequest(context) {
    const jwt = require('@tsndr/cloudflare-worker-jwt')
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const contentType = request.headers.get('content-type')
    console.log(contentType)
    let credentials;
    //check we have a content type
    if (contentType != null) {
        //get the login credentials
        credentials = await request.json();
        console.log(credentials);
    }
    
    //get email and jwttoken

    //check for projects

    //return projects
    let projects = {data:[{name:"project 1",id:1,createdAt:"21/1/2020",template:"<html></html>",templatename:""},{name:"project 2",id:2,createdAt:"21/1/2020",template:"<html></html>",templatename:""}]}
    //console.log(projects)
    return new Response(JSON.stringify(projects), { status: 200 });

}