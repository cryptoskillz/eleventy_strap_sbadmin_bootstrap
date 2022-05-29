/*
    todo 

    change the error HTTP code
    check if the user has a KV entry and return it
    update the KV with their JWT secret


*/
export async function onRequest(context) {


    const jwt = require('@tsndr/cloudflare-worker-jwt')
    //get this from an env so we can share it. 



    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //console.log(SECRET)
    let secret = env.SECRET
    const KV = context.env.backpage;
    //put a variable in place. 
    KV.put("foo", "bar")
        const key = await KV.get("foo")
    console.log(key)
    
    let valid = 1;

    //get the post data
    //note we know it is application / json i am sending it up as but we could check for all the content types if
    //     we wanted to make it more generic
    let credentials = await request.json();
    console.log(credentials)
    if ((credentials.identifier == undefined) || (credentials.password == undefined))
        valid = 0;


    //get the kv store for this user
    //get a key


    if (valid == 1) {
        //make a JWT token
        const token = await jwt.sign({ password: credentials.password, username: credentials.identifier }, secret)


        // Verifing token
        const isValid = await jwt.verify(token, secret)
        if (isValid == true)
            return new Response(token);
        else {
            //note : change the repsonse to a http error code
            return new Response("invalid login");
        }
    } else
        return new Response("invalid login");

}