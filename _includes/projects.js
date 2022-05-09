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
            //get the created date
            let createdAt =  new Date(res.data[i].attributes.createdAt);
            //convert, apis should give a formatted data option!
            createdAt = `${createdAt.getDate()}/${createdAt.getDate()}/${createdAt.getFullYear()}`
            //add the records
            var rowNode = table
                .row.add([res.data[i].id,res.data[i].attributes.name, createdAt, 'Edit'])
                .draw()
                .node();
        }
    }
    //call the create account endpoint
    xhrcall(1, "backpage-projects/", "", "json", "", xhrDone, token)

})