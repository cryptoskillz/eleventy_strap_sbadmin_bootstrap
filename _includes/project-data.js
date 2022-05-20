//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res)
        let results = []
        let cols = [];

   
        for (var i = 0; i < res.data.length; ++i) {

             let publishbutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>` 
            let viewbutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> View</a>` 
            let deletebutton = `<a href="javascript:deleteProject(${res.data[i].id})" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //console.log(res.data[i].attributes.data)
            //let obj = JSON.parse(res.data[i].attributes.data);
            let obj = res.data[i].attributes.data;
            obj.action = `${publishbutton} ${viewbutton} ${deletebutton}`
            results.push(obj)
        }

        var keys = Object.keys(results[0]);

        for (var i = 0; i < keys.length; ++i) {
            //console.log(keys[i])
            let json = `{\"data\" : \"${keys[i]}\"}`
            json = JSON.parse(json)
            cols.push(json)
        }

        

            //console.log(cols)
        var table = $('#projectdatatable').DataTable({
            "data": results,
            "columns": cols,

        });
        for (var i = 0; i < keys.length; ++i) {
            $(table.column(i).header()).text(keys[i]);
            //to fix
            $(table.column(i).footer()).text(keys[i]);
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