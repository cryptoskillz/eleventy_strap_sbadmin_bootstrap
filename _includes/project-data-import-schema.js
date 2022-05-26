let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let urlParam = getUrlParamater('projectid');
    if (urlParam != '')
    {    
        document.getElementById('showBody').classList.remove('d-none');
        projectid = urlParam;
    }
    else
        showAlert('Project not found',2);

})