//add a ready function

/*
todo

redraw the table in the import phase 

*/

let keys;
let projectid;
let importeddata = "";
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {

    //get the project id
    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
    	$("#csv-file").change(handleFileSelect);
        //console.log(project)
        project = JSON.parse(project)
        document.getElementById('showBody').classList.remove('d-none')

        function handleFileSelect(evt) {
            var file = evt.target.files[0];
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                	console.log(results)
                	alert('import complete')
                }
            });
        }
    }
    /*
        //handle the file upload
        function handleFileSelect(evt) {
            //get the uploaded file
            var file = evt.target.files[0];
            //delete the existing files if they exist
            if (importeddata != "") {
                for (var i = 0; i < importeddata.data.length; ++i) {
                    //console.log(res.data[i].id)
                    let xhrDeleteDone = (res3) => {
                        //console.log('record deleted')
                    }
                    xhrcall(3, `backpage-data-imports/${importeddata.data[i].id}`, "", "json", "", xhrDeleteDone, token)
                }
            }
            //return;

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


                    //update the schema
                    let xhrSchemaDone = (res) => {

                    }

                    let bodyobj = {
                        data: {
                            schema: schemaData,
                        }
                    }
                    var bodyobjectjson = JSON.stringify(bodyobj);
                    //console.log('put schema')
                    xhrcall(4, `backpage-projects/${projectid}/`, bodyobjectjson, "json", "", xhrSchemaDone, token)

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
                                data: data
                            }
                        }

                        let xhrImportDone = (res) => {
                            console.log('post done')
                        }
                        ///string it 
                        var bodyobjectjson = JSON.stringify(bodyobj);
                        //console.log(bodyobjectjson)
                        //send it to strapi
                        xhrcall(0, `backpage-data-imports/`, bodyobjectjson, "json", "", xhrImportDone, token)

                        //check we have some data
                        if (datarow.length != 1) {
                            //add the delete button actions
                            dataresult.push(datarow)
                        }
                    }

                
                    //render the tables
                    //bug here we have to replace the data in the table
                    if (importeddata != "") {
                        //renderTable(importeddata, 0, 4, [0, 0, 0, 1], 'backpage-data-imports')
                        //location.reload();

                    }
                    else
                    {
                      //location.reload();
                      
                    }
                    
                    //note : this should be soft.
                    //location.reload();

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
                importeddata = res;
                console.log(importeddata)
            }
            document.getElementById('uploadfile').classList.remove("d-none")
        }
        xhrcall(1, "backpage-data-imports", "", "json", "", xhrDone, token)
    */

})