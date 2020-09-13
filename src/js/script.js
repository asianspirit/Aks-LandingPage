
$(function () {

    // using function for countdown 
    var show = true;
    var countbox = "#counter";
    $(window).on("scroll load resize", function () {

        if (!show) return false;

        var w_top = $(window).scrollTop();
        var e_top = $(countbox).offset().top;

        var w_height = $(window).height();
        var d_height = $(document).height();

        var e_height = $(countbox).outerHeight();

        if (w_top + 400 >= e_top || w_height + w_top == d_height || e_height + e_top < w_height) {
            $(".timer").spincrement({
                thousandSeparator: "",
                from: 1,
                duration: 4000
            });
            show = false;
        }
    });




    //   // using plagin for lazy-scroll on page 
    var scroll = new SmoothScroll('a[href*="#"]', {
        speed: 2000,
        speedAsDuration: true
    });


    //     // create function for btnTop 
    var $btnTop = $(".btn-top");
    $(window).on("scroll load", function () {
        if ($(window).scrollTop() >= 50) {
            $btnTop.fadeIn();
        }
        else {
            $btnTop.fadeOut();
        }
    });

    $btnTop.on("click", function () {
        $("html,body").animate({ scrollTop: 0 }, 900);

    });





    //     //    create function for humberger-menu  
    $('.drawer-list__item-link').on('click', function () {
        $('input.hamburger').prop('checked', false);

    });
    //     //    end function for humberger-menu  



    //     // using slick slider for header 
    $('.header-slider__inner').slick({
        dots: false,
        arrows: false,
        fade: true,
        autoplay: 5000,
    });


    //     // using slick-slider for comments section 
    $('.comments__inner').slick({
        dots: true,
        arrows: false,
        slidesToShow: 2,
        centerMode: true,
        centerPadding: '80px',
        autoplay: 5000,
        responsive: [
            {
                breakpoint: 1120,
                settings: {
                    arrows: false,
                    dots: false,
                    centerMode: false,
                    centerPadding: '80px',
                }
            },
            {
                breakpoint: 960,
                settings: {
                    arrows: false,
                    dots: false,
                    centerMode: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                    variableWidth: false
                }
            },
        ]
    });

    //     // using slick-slider for choosing section 
    $('.choosing__slider-wrapper').slick({
        dots: true,
        arrows: true,
        fade: false,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    arrows: false,
                    dots: true,
                }
            },

        ]
    });

    //     // using tabs for choosing section 
    $('.choosing__inner .tab').on('click', function (event) {
        var id = $(this).attr('data-id');
        $('.choosing__inner').find('.tab-item').removeClass('active-tab').hide();
        $('.choosing__inner .tabs').find('.tab').removeClass('active');
        $(this).addClass('active');
        $('#' + id).addClass('active-tab').fadeIn();
        $('.choosing__slider-wrapper').slick("refresh");
        return false;

    });

    //     // using tabs for questions section 
    $('.questions__inner-box .questions__tab').on('click', function (event) {
        var id = $(this).attr('data-id');
        $('.questions__inner-box').find('.questions__tab-item').removeClass('questions__active-tab').hide();
        $('.questions__inner-box .questions__tabs').find('.questions__tab').removeClass('questions__active');
        $(this).addClass('questions__active');
        $('#' + id).addClass('questions__active-tab').fadeIn();
        return false;
    });





    $('.questions__tab-box').on('click', function () {
        $(this).find('.questions__tab-text').slideToggle();

    });

    $('.questions__tab-box').on('click', function () {
        $(this).find('.questions__tab-title').toggleClass('active');

    });


    new WOW().init();



});


