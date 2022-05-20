//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res)
        //get the datatable
        var table = $('#dataTable').DataTable();
        //loop through the data
        for (var i = 0; i < res.data.length; ++i) {

            //console.log(res.data[i].attributes.template)
            let databutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> Data</a>`
            let templatebutton = `<a href="/project/template/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-code fa-sm text-white-50"></i> Template</a>`
            let editbutton = `<a href="/project/edit/?name=${res.data[i].attributes.name}&id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let deletebutton = `<a href="javascript:deleteProject(${res.data[i].id})" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //get the created date
            let createdAt = new Date(res.data[i].attributes.createdAt);
            //convert, apis should give a formatted data option!
            createdAt = `${createdAt.getDate()}/${createdAt.getDate()}/${createdAt.getFullYear()}`
            //add the records
            var rowNode = table
                .row.add([res.data[i].id, res.data[i].attributes.name, createdAt, `${databutton} ${editbutton} ${templatebutton} ${deletebutton} `])
                .draw()
                .node();
        }
        table.columns.adjust();
    }
    //build the json
    let bodyobj = {
        user: {
            id: 2
        }

    }
    //string it
    var bodyobjectjson = JSON.stringify(bodyobj);
    //call the create account endpoint
    xhrcall(1, "backpage-projects/?user=1", bodyobj, "json", "", xhrDone, token)

})


let deleteProject = (id) => {
    deleteId = id;
    deleteMethod = "backpage-projects";
    $('#confirmation-modal').modal('toggle')
}