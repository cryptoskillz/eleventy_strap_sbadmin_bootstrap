//add a ready function

/*
todo 

check if there is data and if so show it and give them the option to replace it
render the table
*/

let keys;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let deleteImportData = (id) => {
    alert('belete id')
}

whenDocumentReady(isReady = () => {

    let xhrDone2 = (res) => {

    }

    //get the project id
    let urlParam = getUrlParamater('projectid')
    if (urlParam != '') {
        document.getElementById('showBody').classList.remove('d-none')
        projectid = urlParam;
    } else
        showAlert('Project not found', 2);

    //handle the file upload
    function handleFileSelect(evt) {
        //get the uploaded file
        var file = evt.target.files[0];
        //parse it with papa
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                //hide the upload file
                document.getElementById("uploadfile").classList.add("d-none");
                //show the table div
                document.getElementById("csvtable").classList.remove("d-none")
                //console.log(results);
                //set some arrays to hold the data
                let dataresult = []
                let columns = []
                let data = {}
                //loop through and get all the fields
                for (var p in results.meta.fields) {
                    //create a json object for datatables
                    colJson = { title: results.meta.fields[p] }
                    //add it it the columns object
                    columns.push(colJson)
                    //add it to the data array for sending to the database
                    data[results.meta.fields[p]] = "";
                }
                //create and add the json object for datatables
                colJson = { title: "actions" }
                columns.push(colJson)
                //loop through the data
                for (var i = 0; i < results.data.length; i++) {
                    //get the data row
                    let datarow = []
                    //loop through the data elements
                    for (var z in results.data[i]) {
                        //store the data
                        data[z] = results.data[i][z]
                        //store the row in the array to put in datatables
                        datarow.push(results.data[i][z])
                    }
                    //build the XHR object
                    let bodyobj = {
                        user: 1,
                        data: {
                            backpage_project: projectid,
                            data: data
                        }
                    }
                    ///string it 
                    var bodyobjectjson = JSON.stringify(bodyobj);
                    //send it to strapi
                    xhrcall(0, `backpage-data-imports/`, bodyobjectjson, "json", "", xhrDone2, token)

                    //check we have some data
                    if (datarow.length != 1) {
                        /*
                         let deletebutton = `<a href="javascript:deleteImportData(${results.data[i].id})" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
    */ //we will add delete functionaliy later
                        let deletebutton = ""
                        //add the delete button actions
                        datarow.push([deletebutton])
                        dataresult.push(datarow)
                    }
                }
                //render the tables
                table = $('#dataTable').DataTable({
                    data: dataresult,
                    rowId: 'id',
                    columns: columns,

                });
            }
        });

    }
    $("#csv-file").change(handleFileSelect);

    let xhrDone = (res) => {
        res = JSON.parse(res)
        if (res.meta.pagination.total == 0) {
            showAlert(`No data imported for this project import data <a href="/project/data/import/data/?projectid=${projectid}">here</a>`, 1, 0)
            document.getElementById('importeddatatable').classList.add("d-none")
            document.getElementById('uploadfiletext').innerHTML = "First row must contain headers"
        } else {
            document.getElementById('uploadfiletext').innerHTML = "First row must contain headers.  If you import again the existing data will be overwritten."
            //todo : render the table
        }
        document.getElementById('uploadfile').classList.remove("d-none")
        document.getElementById('csvtables').classList.remove("d-none")
    }
    xhrcall(1, "backpage-data-imports", "", "json", "", xhrDone, token)


})