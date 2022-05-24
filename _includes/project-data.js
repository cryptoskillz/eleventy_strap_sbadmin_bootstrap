//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    //get the  template id
    let urlParam = getUrlParamater('id')

    //done function
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res)

        //set the results and cols arrys
        let results = []
        let cols = [];

        //loop through the data
        for (var i = 0; i < res.data.length; ++i) {

            let editbutton = `<a href="/project/data/edit/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let publishbutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>`
            let viewbutton = `<a href="/project/data/?id=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> View</a>`
            let deletebutton = `<a href="javascript:deleteProject(${res.data[i].id})" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //get the data
            let obj = res.data[i].attributes.data;
            //add another attr to the end for the table actions
            obj.action = `${editbutton} ${viewbutton} ${deletebutton}`
            //add it to the results array
            results.push(obj)
        }

        //get the hets fro  the results array
        var keys = Object.keys(results[0]);
        //loop through  the keys
        for (var i = 0; i < keys.length; ++i) {
            //build a the daa
            let json = `{\"data\" : \"${keys[i]}\"}`
            json = JSON.parse(json)
            cols.push(json)
        }

        //create the datatable
        var table = $('#projectdatatable').DataTable({
            "data": results,
            "columns": cols,

        });
        //fix the headers
        /*
        note : this is kind of hacky, you should be able to do it by using title and data with datatables. It is good enough for now I will fix it later.
        */
        for (var i = 0; i < keys.length; ++i) {
            $(table.column(i).header()).text(keys[i]);
            //to fix : footer does not alter for some reason
            $(table.column(i).footer()).text(keys[i]);
        }
    }
    //build the json
    let bodyobj = {
        user: {
            id: 2
        }

    }

    if (urlParam != "") {
        //string it
        document.getElementById("showBody").classList.remove('d-none')
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the create account endpoint
        xhrcall(1, "backpages/?user=1", bodyobj, "json", "", xhrDone, token)
    } else {
        //no project id so show an error.
        let error = document.getElementById('accountsAlert');
        error.innerHTML = "project not found"
        error.classList.remove('d-none');
    }


})

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            let href = `/project/template/view/?id=${urlParam}`
            window.location.href = href
            break;
        case "2":
            window.location.href = "/projects/"
            break;
        case "3":
            window.location.href = `/projects/`
            break;
        default:
            // code block
    }

})


//delete a project.
let deleteProject = (id) => {
    deleteId = id;
    deleteMethod = "backpage-projects";
    $('#confirmation-modal').modal('toggle')
}