export async function onRequest(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const jwt = require('@tsndr/cloudflare-worker-jwt')
    //get this from an env so we can share it. 
    let secret = "974this is the stupid secret that no will ever be able to guess344342!"
    //get the url paramaters
    //note : We should move this to a post. 
    let loginparams = (new URL(request.url)).searchParams;
    //get the login details
    let username = loginparams.get("username")
    let password = loginparams.get("password")
    //make a JWT token
    const token = await jwt.sign({ password: password, username: username }, secret)

    // Verifing token
    const isValid = await jwt.verify(token, secret)
    if (isValid == true)
        return new Response(token);
    else
    {
        //note : change the repsonse to a http error code
        return new Response("invalid login");
    }
   
}