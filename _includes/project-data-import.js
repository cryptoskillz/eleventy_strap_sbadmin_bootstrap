let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            window.location.href = `/project/data/import/data/?projectid=${projectid}`
            break;
        case "2":
            window.location.href = `/project/data/import/schema/?projectid=${projectid}`
            break;
        case "3":
            goBack()
            break;
        default:
            // code block
    }
    this.value = 0;

})


whenDocumentReady(isReady = () => {
    let urlParam = getUrlParamater('projectid')
    if (urlParam != '') {
        projectid = urlParam;
    } else
        showAlert('Project not found', 2);

    //get the imported data


    let xhrDone = (res) => {
                res = JSON.parse(res)

        console.log(res);

        if (res.meta.pagination.total == 0)
        {
            showAlert(`No data imported for this project import data <a href="/project/data/import/data/?projectid=${projectid}">here</a>`,1,0)
            document.getElementById('importeddatatable').classList.add("d-none")
        }
        else
        {
            document.getElementById('showBody').classList.remove('d-none');
        }
/*
        const query = qs.stringify({
  filters: {
    username: {
      $eq: 'John',
    },
  },
}, {
  encodeValuesOnly: true,
});
*/

        /*
        //parse the response
        res = JSON.parse(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        //loop through the data
        for (var i = 0; i < res.data.length; ++i) {

            //console.log(res.data[i].attributes.template)
            let databutton = `<a href="/project/data/?projectid=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> Data</a>`
            let templatebutton = `<a href="/project/template/?projectid=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-code fa-sm text-white-50"></i> Template</a>`
            let editbutton = `<a href="/project/edit/?name=${res.data[i].attributes.name}&projectid=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
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
                .node().id = res.data[i].id;
        }
        table.columns.adjust();
        */
    }
    //call the create account endpoint
    xhrcall(1, "backpage-data-imports", "", "json", "", xhrDone, token)

})