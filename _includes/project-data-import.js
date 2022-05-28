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

        //console.log(res);

        if (res.meta.pagination.total == 0) {
            showAlert(`No data imported for this project import data <a href="/project/data/import/data/?projectid=${projectid}">here</a>`, 1, 0)
            document.getElementById('importeddatatable').classList.add("d-none")
        } else {
            document.getElementById('showBody').classList.remove('d-none');
            renderTable(res,4,[1])
        }
    }
    //call the create account endpoint
    xhrcall(1, "backpage-data-imports", "", "json", "", xhrDone, token)

})