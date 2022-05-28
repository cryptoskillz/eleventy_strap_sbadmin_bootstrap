//add a ready function

/*
todo 

look at import 500 error

*/

let keys;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {

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
        //delete the existing files
        let xhrDataGetDone = (res) => {
            res = JSON.parse(res);
            console.log(res);

            let xhrDeleteDone = (res3) => {
                console.log('record deleted')
            }
            //console.log(res2)
            for (var i = 0; i < res.data.length; ++i) {
                //console.log(res2.data[i].id)
                xhrcall(3, `backpage-data-imports/${res.data[i].id}`, "", "json", "", xhrDeleteDone, token)
            }
        }
        //get the data
        xhrcall(1, `backpage-data-imports/`, "", "json", "", xhrDataGetDone, token)
      
        //parse it with papa
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                //show the table div
                document.getElementById("csvtable").classList.remove("d-none")
                document.getElementById('uploadfiletext').innerHTML = "First row must contain headers.  If you import again the existing data will be overwritten."
                //console.log(results);
                //set some arrays to hold the data
                let dataresult = []
                let columns = []
                let data = {}
                let schemafields = "";
                let schemaData = {};
                //let tmp2 = { fields: inpValue, originalfields: ofields }

                //loop through and get all the fields
                for (var p in results.meta.fields) {
                    //create a json object for datatables
                    colJson = { title: results.meta.fields[p] }
                    //add it it the columns object
                    columns.push(colJson)
                    if (schemafields == "")
                        schemafields = results.meta.fields[p];
                    else
                        schemafields = schemafields + "," + results.meta.fields[p];
                    //add it to the data array for sending to the database
                    data[results.meta.fields[p]] = "";
                }
                schemaData = { fields: schemafields, originalfields: schemafields }
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

                    let xhrImportDone = (res) => {

                    }
                    ///string it 
                    var bodyobjectjson = JSON.stringify(bodyobj);
                    //send it to strapi
                    xhrcall(0, `backpage-data-imports/`, bodyobjectjson, "json", "", xhrImportDone, token)

                    //check we have some data
                    if (datarow.length != 1) {
                        //add the delete button actions
                        dataresult.push(datarow)
                    }
                }

                //now update the schema 
                //console.log(tmp2)

                let xhrSchemaDone = (res) => {

                }

                let bodyobj = {
                    data: {
                        schema: schemaData,
                    }
                }
                var bodyobjectjson = JSON.stringify(bodyobj);
                xhrcall(4, `backpage-projects/${projectid}/`, bodyobjectjson, "json", "", xhrSchemaDone, token)


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
            document.getElementById('uploadfiletext').innerHTML = "First row must contain headers"
        } else {
            document.getElementById('uploadfiletext').innerHTML = "First row must contain headers.  If you import again the existing data will be overwritten."
            //todo : render the table
            renderTable(res, 0, 4, [0, 0, 0, 1], 'backpage-data-imports')
            document.getElementById('csvtable').classList.remove("d-none")
        }
        document.getElementById('uploadfile').classList.remove("d-none")
    }
    xhrcall(1, "backpage-data-imports", "", "json", "", xhrDone, token)


})