(function ($) {
    $.fn.mslider = function (options) {
        var settings = $.extend({
            slideDelay: 3000,
            showControls: true,
            freezeOnBlur: false,
            freezeOnClick: false,
            freezeOnHover: false
        }, options);

        var playing = true;
        var slider = $(this);
        var sliderWrapper = $(this).wrapInner('<div class="mSlider-wrapper" />').children().first();
        var slides = sliderWrapper.find('.mSlider-slide');

        if (settings.showControls) {
            var slideControlPrev = $('<div class="mSlider-control-prev" />').appendTo(slider);
            var slideControlNext = $('<div class="mSlider-control-next" />').appendTo(slider);
            slideControlPrev.css('top', slides.outerHeight() / 2 - slideControlPrev.outerHeight() / 2);
            slideControlNext.css('top', slides.outerHeight() / 2 - slideControlNext.outerHeight() / 2);
        }

        var sliderWrapperWidth = 0;
        slider.correctWidth = function () {
            sliderWrapperWidth = 0;
            slides.each(function (indexInArray, value) {
                $(value).outerWidth($(value).outerWidth());
                sliderWrapperWidth += $(value).outerWidth();
            });

            sliderWrapper.height(slides.outerHeight(true));
            sliderWrapper.width(sliderWrapperWidth);
        };

        slider.reset = function () {
            slider.correctWidth();
            slides.each(function (indexInArray, value) {
                $(this).finish().css('left', indexInArray * $(value).outerWidth(true));
            });
        };

        slider.nextSlide = function () {
            slides.each(function (indexInArray, value) {
                var slideWidth = $(value).outerWidth(true);
                var leftOffset = parseFloat($(value).css('left'));
                if (leftOffset <= -slideWidth) {
                    $(value).css('left', sliderWrapperWidth - slideWidth);
                }

                $(value).animate({left: '-=' + slideWidth}, 'slow');
            });
        };

        slider.prevSlide = function () {
            slides.each(function (indexInArray, value) {
                var slideWidth = $(value).outerWidth(true);
                var leftOffset = parseFloat($(value).css('left'));
                if (leftOffset >= sliderWrapperWidth) {
                    $(value).css('left', -slideWidth);
                }

                $(value).animate({left: '+=' + slideWidth}, 'slow');
            });
        };

        slider.reset();

        function slideIntervalFunction() {
            if (playing == true) {
                slider.nextSlide();
            }
        }

        var slideInterval = setInterval(slideIntervalFunction, settings.slideDelay);

        sliderWrapper.click(function () {
            if (settings.freezeOnClick) {
                playing = !playing;
            }
        });

        sliderWrapper.mouseover(function () {
            if (settings.freezeOnHover) {
                playing = false;
            }
        });

        sliderWrapper.mouseout(function () {
            if (settings.freezeOnHover) {
                playing = true;
            }
        });

        slideControlPrev.click(function () {
            clearInterval(slideInterval);
            slider.prevSlide();
            slideInterval = setInterval(slideIntervalFunction, settings.slideDelay);
        });

        slideControlNext.click(function () {
            clearInterval(slideInterval);
            slider.nextSlide();
            slideInterval = setInterval(slideIntervalFunction, settings.slideDelay);
        });

        $(window).blur(function () {
            if (settings.freezeOnBlur) {
                playing = false;
            }
        });

        $(window).focus(function () {
            if (settings.freezeOnBlur) {
                playing = true;
            }
        });

        $(window).resize(function () {
            sliderWrapper.css('width', '');
            slides.css('width', '');

            slider.reset();
        });

        return slider;
    };
}(jQuery));