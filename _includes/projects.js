/*
todo 

rationalise this to use render table function


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    let xhrDone = (res) => {
        //store it in local storage
        window.localStorage.projects = res;
        //parse the response
        res = JSON.parse(res)
        //console.log(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        let method = "api/projects"
        //loop through the data
        for (var i = 0; i < res.data.length; ++i) {
            //console.log(res.data[i].attributes.template)
            let databutton = `<a href="/project/data/?projectid=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> Data</a>`
            let templatebutton = `<a href="/project/template/?projectid=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-code fa-sm text-white-50"></i> Template</a>`
            let editbutton = `<a href="/project/edit/?name=${res.data[i].name}&projectid=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
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
                .row.add([res.data[i].id, res.data[i].name, res.data[i].createdAt, `${databutton} ${editbutton} ${templatebutton} ${deletebutton} `])
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
    xhrcall(1, "api/projects/", bodyobjectjson, "json", "", xhrDone, token)

})

