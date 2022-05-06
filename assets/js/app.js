let redirectUrl = ""; // hold the redcirect URL


//TODO: replace this with plain js
(function($) {
    "use strict"; // Start of use strict


 
    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };

        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });

})(jQuery); // End of use strict

//this fucntion validates an email address.
let validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


let checkLogin = () => {
    //check if it is not a login page
    if ((window.location.pathname == "/create-account/") || (window.location.pathname == "/login/") || (window.location.pathname == "/forgot-password/"))
    {
        //window.location = '/'
    }
    else
    {
        //get the user object
        let tmpUser = window.localStorage.user
        //check it exists
        if (tmpUser != undefined)
        {
            //decode the json
            user = JSON.parse(window.localStorage.user);
            //check the user is logged in some one could spoof this so we could do a valid jwt check here 
            //but i prefer to do it when we ping the api for the data for this user. 
            if (user.loggedin != 1)
            {
                window.location = '/login'
            }
            else
            {
                
                document.getElementById('user-account-header').innerHTML = user.email
            }
        }
        else
        {
             window.location = '/login'   
        }
        
    }
}




//this function makes the XHR calls.
let xhrcall = (type = 1, method, bodyObj = "", setHeader = "", redirectUrl = "", callback = '') => {
    //debug
    //console.log(apiUrl)
    //console.log(bodyObj)
    //console.log(method)
    //console.log(callback)

    /*
      Note if we are not using strai and have a custom URL we can change it here like wise if we want to use 2 we can check the method to select the correct base url
    */
    let url = apiUrl + method;
    //store the type
    let xhrtype = '';
    switch (type) {
        case 0:
            xhrtype = 'POST';
            break;
        case 1:
            xhrtype = 'GET';
            break;
        case 2:
            xhrtype = 'PATCH';
            break;
        case 3:
            xhrtype = 'DELETE';
            break;
        case 4:
            xhrtype = 'PUT';
            break;
        default:
            xhrtype = 'GET';
            break;
    }

    //set the new http request
    let xhr = new XMLHttpRequest();
    xhr.open(xhrtype, url);

    //set the header if required
    //note (chris) this may have to be a switch
    if (setHeader == "json")
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //send the body object if one was passed
    if (bodyObj !== '') {
        xhr.send(bodyObj);
    } else {
        xhr.send();
    }
    //result
    //todo (chris) make this eval back to a done function
    xhr.onload = function() {
        //check if its an error
        if (xhr.status == 400) {
            //process the response
            let res = xhr.response;

            res = JSON.parse(res)

            //get the message
            //we just display the error returned from strapi but you can do what you want  hre
            let alert = document.getElementById('accountsAlert')
            alert.innerHTML = res.error.message
            alert.classList.remove('d-none')

        }
        //check if it was ok.
        if (xhr.status == 200) {
            let alert = document.getElementById('accountsAlert')
            alert.innerHTML = ""
            alert.classList.add('d-none')
            //check if a redirecr url as passed.
            if (redirectUrl != "") {
                window.location = redirectUrl
            } else {
                eval(callback(xhr));
            }

        }

    }
};


 checkLogin()

