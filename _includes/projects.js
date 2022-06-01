/*
todo 

update the field rendering in  render  table

*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let loadURL = (theUrl,theId,blank=0) => {
    //note this does not loop through the projects only store data from the first fix bug
    let backpages = window.localStorage.projects;
    backpages = JSON.parse(backpages)
    console.log(backpages)
    for (var i = 0; i < backpages.data.length; ++i) {
        if (backpages.data[i].id == theId) {
            window.localStorage.project = JSON.stringify(backpages.data[i]);
            
            if (blank == 1)
                window.open(theUrl,"_blank")
            else
                window.location.href = theUrl;
            
        }
    }
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    let xhrDone = (res,local=0) => {
        //store it in local storage
        if (local == 0)
        {
            window.localStorage.projects = res;
            res = JSON.parse(res)
        }
        //console.log(res)
        //parse the response
        //console.log(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        let method = "api/projects"
        //loop through the data
        for (var i = 0; i < res.data.length; ++i) {
            //console.log(res.data[i].attributes.template)
            //theProject = res.data[i]
            let databutton = `<a href="javascript:loadURL('/project/data/','${res.data[i].id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> Data</a>`
          //  let templatebutton = `<a href="javascript:loadURL('/project/template/')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
   // <i class="fas fa-code fa-sm text-white-50"></i> Template</a>`
            let editbutton = `<a href="javascript:loadURL('/project/edit/','${res.data[i].id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let deletebutton = `<a href="javascript:deleteTableItem('${res.data[i].id}','${res.data[i].id}','${method}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //get the created date
            /*
            let createdAt = new Date(res.data[i].createdAt);
            //convert, apis should give a formatted data option!
            createdAt = `${createdAt.getDate()}/${createdAt.getDate()}/${createdAt.getFullYear()}`
            */
            //add the records
            var rowNode = table
                .row.add([res.data[i].id, res.data[i].name, res.data[i].createdAt, `${databutton} ${editbutton} ${deletebutton} `])
                .draw()
                .node().id = res.data[i].id;
        }
        table.columns.adjust();
    }
    //build the json
    let bodyobj = {
            email : user.email,
            token : token
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    //call the create account endpoint
    let projects = window.localStorage.projects    
    if (projects == undefined)
        xhrcall(1, "api/projects/", bodyobjectjson, "json", "", xhrDone, token)
    else {
        //console.log(project)
        projects = JSON.parse(projects)
        xhrDone(projects,1);
    }

})

