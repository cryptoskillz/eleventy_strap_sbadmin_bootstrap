
let dataArray = [];
let buildDataArray = (theData,theId="") => {
    //console.log("theData");
    let id;
    if (theId == "")
        id = uuid.v4();
    else
        id = theId
    //console.log(theData);
    let projectData = { id: id, data: theData, createdAt: "21/12/2022"}
    //console.log(projectData)
    dataArray.push(projectData)
    return(projectData)
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
    const KV = context.env.backpage;

    //get the paramaters
    const { searchParams } = new URL(request.url)
    let projectid = searchParams.get('projectid')
    let secretid = searchParams.get('secretid')

    //get the secret id
    let user =await KV.get("username" + secretid);
    user = JSON.parse(user);
    //tocheck if username matches

    //get the project
    let project = await KV.get("projects" + user.username + "*" + projectid);
    project = JSON.parse(project)

    //get the projects list
    let projectdatalist = await KV.list({ prefix: "projects-data" + user.username + "*" + projectid + "*" });
       if (projectdatalist.keys.length > 0) {
            for (var i = 0; i < projectdatalist.keys.length; ++i) {
                //build the data object
                let tmp = projectdatalist.keys[i].name.split('*');
                let projectdata = await KV.get("projects-data" + user.username + "*" + projectid + "*" + tmp[2]);
                //parse it
                projectdata = JSON.parse(projectdata)
                //store it
                let pData2 = buildDataArray(projectdata.data,projectdata.id)
            }
            //console.log(dataArray)
        }

    //merge it with the template
    //check we have template / name and schema (fields set)

    //return  it
    return new Response(JSON.stringify({ message: "ok" ,data:JSON.stringify(dataArray)}), { status: 200 });



}