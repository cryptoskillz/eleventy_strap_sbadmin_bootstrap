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

            let publishbutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>` 
            let viewbutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> View</a>` 
            let deletebutton = `<a href="javascript:deleteProject(${res.data[i].id})" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //get the created date
            let createdAt = new Date(res.data[i].attributes.createdAt);
            //convert, apis should give a formatted data option!
            createdAt = `${createdAt.getDate()}/${createdAt.getDate()}/${createdAt.getFullYear()}`

            let data = JSON.stringify(res.data[i].attributes.data)
            //add the records
            var rowNode = table
                .row.add([res.data[i].id, createdAt, data , ` ${viewbutton} ${deletebutton} ${publishbutton} `])
                .draw()
                .node();
        }
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
    xhrcall(1, "backpages/?user=1", bodyobj, "json", "", xhrDone, token)

})


let deleteProject = (id) => {
    deleteId = id;
    deleteMethod = "backpage-projects";
    $('#confirmation-modal').modal('toggle')
}