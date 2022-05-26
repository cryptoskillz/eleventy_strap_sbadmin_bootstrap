//add a ready function

let keys;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


let deleteImportData = (id) => {
    alert('belete id')
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')



    function handleFileSelect(evt) {
        var file = evt.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {

                document.getElementById("uploadfile").classList.add("d-none")
                document.getElementById("csvtable").classList.remove("d-none")
                //console.log(results);
                let dataresult = []
                let columns = []
                for (var p in results.meta.fields) {
                    colJson = { title: results.meta.fields[p] }
                    columns.push(colJson)
                }
                colJson = { title: "actions" }
                columns.push(colJson)

                for (var i = 0; i < results.data.length; i++) {
                    //console.log(results.data[i])
                    let datarow = []
                    for (var z in results.data[i]) {
                        datarow.push(results.data[i][z])
                    }

                    if (datarow.length != 1)
                    {
                        /*
                         let deletebutton = `<a href="javascript:deleteImportData(${results.data[i].id})" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
    */
    let deletebutton = ""
                        datarow.push([deletebutton])
                        dataresult.push(datarow)
                    }
                }
                table = $('#dataTable').DataTable({
                    data: dataresult,
                    rowId: 'id',
                    columns: columns,

                });
            }
        });

    }

    $("#csv-file").change(handleFileSelect);


})