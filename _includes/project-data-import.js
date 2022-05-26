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
        document.getElementById('showBody').classList.remove('d-none');
        projectid = urlParam;
    } else
        showAlert('Project not found', 2);

})