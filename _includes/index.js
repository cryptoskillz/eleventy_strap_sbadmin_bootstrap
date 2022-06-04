//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    projects = getCacheProjects()
    if (projects == false)
        document.getElementById("backpageprojects").innerHTML = 0;

    else
        document.getElementById("backpageprojects").innerHTML = projects.data.length;

});