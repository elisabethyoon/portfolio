var main = main || {};

var $window = $(window),
	$document = $(document),
	$html = $('html'),
	$body = $('body'),
	$header = $('#header'),
	$footer = $('#footer'),
	$wrap = $('#wrap'),
	$gnbWrap = $header.find(".gnb_wrap"),
	$mobileMenuBtn = $header.find(".mobile_menu_btn"),
    lenis,
	mobileFlag = true,
    /* touch기능으로 mobile/tablet 판별하여 css에 root var 추가 <-- coarse 터치기기 : fine 웹 */
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    isTouchDevice = getComputedStyle(document.documentElement).getPropertyValue("--pointer") == "coarse",
    mediaQuery = window.matchMedia("(min-width: 1025px)");
   

main.utils = {
	/**
	 * main.utils.scroll : page scroll plugin
	 **/
	scroll: function () {
		var currentT = 0;

		// scroll 이벤트
		$window.on('load scroll', function (e) {
			e.preventDefault();
			var scrollT = $(this).scrollTop();
			
			// scroll상태 체크
			if (scrollT > currentT) {
				$wrap.attr('data-scroll', 'down');
			} else if (scrollT < currentT) {
				$wrap.attr('data-scroll', 'up');
			}

			if(scrollT > 50){
				if ($wrap.attr('data-scroll') === 'down') {
					// $gnbWrap.trigger("mouseleave");
					$header.addClass('active');

				}else{
					$header.removeClass('active');
					$header.addClass('scroll');
				}
			} else{
				$header.removeClass('active');
				$header.removeClass('scroll');
			}

			currentT = scrollT;
		});


		function breakPoint(mediaQuery) {
			if (mediaQuery.matches) {
				if (!lenis) {
					lenis = new Lenis({
						duration: 1,
						// lerp:0.15,
					});
					lenis.on("scroll", ScrollTrigger.update);
					gsap.ticker.add(function (time) {
						lenis.raf(time * 1000);
					});
					gsap.ticker.lagSmoothing(0);

					// 이너 스크롤 바가 없을 때는 속성 삭제
					$("[data-lenis-prevent]").each(function(idx, target){
						if (!(target.scrollHeight > target.clientHeight)) {
							$(target).removeAttr("data-lenis-prevent")
						}
					});
				}
			}
		}

		breakPoint(mediaQuery);
		mediaQuery.addEventListener("change", breakPoint);
	},
	/**
	 * main.utils.header : header
	 **/
	header: function() {
		let webFlag = true;
		let pcEvent, mEvent;

		$window.on("load resize", function () {
			if(windowWidth > 1024 && !isTouchDevice){
				
				clearTimeout(pcEvent);
				pcEvent = setTimeout(function() {
					if(webFlag){
						// clear
						$gnbWrap.removeClass("active");
						$mobileMenuBtn.removeClass("active").off("click");
					
						webFlag = false;
						mobileFlag = true;
					}
				},100);
			} else{
				clearTimeout(mEvent);
				mEvent = setTimeout(function() {
					if(mobileFlag){
						// clear
						$gnbWrap.removeClass("active").removeAttr('style');
						$gnbWrap.off("mouseleave");
						
						
						// event
						$mobileMenuBtn.on("click", function(){
							var _this = $(this);
							if($(this).hasClass("active")){
								$gnbWrap.removeClass("active");
								main.utils.isMoveStop(false, true);
								setTimeout(function(){
									_this.removeClass("active");
								},300);
							} else{
								_this.addClass("active");
								main.utils.isMoveStop(true, true);
								setTimeout(function(){
									$gnbWrap.addClass("active");
								},100);
							}
						});
												
						mobileFlag = false;
						webFlag = true;
					}
				},100);
			}
		});


		// gnb 클릭 시 해당 섹션 도달
		$(document).on('click','.gnb_list li', function() {
			let idx = $(this).index();
			let moveScrollTop = $('.con').eq(idx).offset().top + 2;
			
			gsap.to($(window),{
				scrollTo: moveScrollTop,
				duration: 0.6,
			});
			$('.gnb_list li').removeClass('active').eq(idx).addClass('active');
			
			$('.mobile_menu_btn').trigger('click');
		});
		

		// 각 섹션 도달 시 gnb 활성화
		$('.con').each(function(idx, el) {
			ScrollTrigger.create({
				trigger: el,
				start: 'top top+=2',
				end: 'bottom top+=2',
				invalidateOnRefresh: true,
				// markers: true,
				onEnter: function() {
					$('.gnb_list li').removeClass('active').eq(idx).addClass('active');
				},
				onEnterBack: function() {
					$('.gnb_list li').removeClass('active').eq(idx).addClass('active');
				}
			});
		})
	},
	/**
     * main.utils.isMoveStop : 스크롤 멈춤, 재생
	 * @param {boolean} boolean - 정지 true, 시작 false
	 * @param {boolean} overflow - overflow 여부
     **/
	isMoveStop: function (boolean, overflow) {
        if (boolean == true) {
            if (lenis) {
                lenis.stop();
            } else{
                $body.addClass("overflow");
			}
            // body overflow: hidden 일 경우
            if (overflow) {
                $body.addClass("overflow");
            }
        } else {
            if (lenis) {
                lenis.start();
            } else{
                $body.removeClass("overflow");
			}
            if (overflow) {
                $body.removeClass("overflow");
            }
        }
    },
	/**
	 * main.utils.introMotion : 진입 모션
	 **/
	introMotion: function() {
        let tl = gsap.timeline({});
		const introFlag = sessionStorage.getItem('introMotionPlayed');

		if (introFlag === 'Y') {
			$('.loading_box').addClass('hide').hide();

			// 뒤로가기 했을 때 로딩 관련 상태 확실히 제거
			$('body').removeClass('scroll-disable');

			// GNB는 바로 보이게
			if(mediaQuery.matches) { // pc
				tl
				.add(() => {
					$(".con01").addClass("active");
				})
				
			} else { // m
				tl
				.add(() => {
					$(".con01").addClass("active");
				})
			}

			return;
		}

		sessionStorage.setItem('introMotionPlayed', 'Y');
		
		// $body.addClass('scroll-disable');
		
        // main visual timeline animation
		gsap.set(".stamp_img", {
			autoAlpha: 0,
			scale: 1.35,
			rotate: -14
		});

		if(mediaQuery.matches) { // pc
			tl
			.to({}, { duration: 0.2 })
			.to(".plane_box", {
				yPercent: -200,
				duration: 1.8,
				ease: "power3.inOut"
			})
			.to({}, { duration: 0.4 })
			.fromTo(".stamp_img", {
				autoAlpha: 0,
				scale: 1.35,
				rotate: -14
			}, {
				autoAlpha: 0.75,
				scale: 1,
				rotate: -14,
				duration: 0.8,
				ease: "back.out(2)"
			}, "+=0.4")
			// .to({}, { duration: 0.1 })
			.to(".sunset_bg", {
				opacity: 1,
				duration: 1.1
			})
			.to('.loading_tit', {
				opacity: 0,
				y: -30,
				duration: 0.5
			}, "-=0.3")
			.add(() => {
				$(".loading_box").addClass("hide_motion");
			}, "-=0.1")
			.to(".loading_box", {
				opacity: 0,
				duration: 0.8,
				delay: 0.4,
				onComplete: function () {
					$(".loading_box").hide();
					// $("body").removeClass("scroll-disable");
					$(".con01").addClass("active");
				}
			});
		} else { // m
			tl
			.to({}, { duration: 0.2 })
			.to(".plane_box", {
				yPercent: -200,
				duration: 1.8,
				ease: "power3.inOut"
			})
			.to({}, { duration: 0.4 })
			.fromTo(".stamp_img", {
				autoAlpha: 0,
				scale: 1.35,
				rotate: -14
			}, {
				autoAlpha: 0.75,
				scale: 1,
				rotate: -14,
				duration: 0.8,
				ease: "back.out(2)"
			}, "+=0.4")
			// .to({}, { duration: 0.1 })
			.to(".sunset_bg", {
				opacity: 1,
				duration: 1.1
			})
			.to('.loading_tit', {
				opacity: 0,
				y: -30,
				duration: 0.5
			}, "-=0.3")
			.add(() => {
				$(".loading_box").addClass("hide_motion");
			}, "-=0.1")
			.to(".loading_box", {
				opacity: 0,
				duration: 0.8,
				delay: 0.4,
				onComplete: function () {
					$(".loading_box").hide();
					// $("body").removeClass("scroll-disable");
					$(".con01").addClass("active");
				}
			});
		}

		
	},
    /**
	 * main.utils.con02 : con02 cloud motion
	 **/
	con02: function(){
		let tl = gsap.timeline();

		function isMobile() {
			return window.innerWidth <= 1024;
		}

		gsap.to('.cloud_box',{
			scrollTrigger:{
				trigger: '.con02',
				start: function() {
					return isMobile() ? "top 30%" : "top 45%"
				},
				once: true,
				invalidateOnRefresh: true,
				// markers: true,
				onEnter:function(){
					$('.cloud_box').addClass('active');
				},
			}
		})
	},
	 /**
	 * main.utils.con04 : con04 slide
	 **/
	con04: function(){
		var swiper = new Swiper(".project_swiper", {
            slidesPerView: 1.2,
			spaceBetween: 20,
			centeredSlides: false,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			  },
			breakpoints: {
				1024: {
					slidesPerView: 2,
				}
			},
			on: {
				init: function () {
					var savedIndex = sessionStorage.getItem("projectSwiperIndex");
		
					if (savedIndex !== null) {
						this.slideTo(Number(savedIndex), 0);
					}
				},
				slideChange: function () {
					sessionStorage.setItem("projectSwiperIndex", this.activeIndex);
				}
			}
        });

		$(".project_swiper .link_txt").on("click", function () {
			sessionStorage.setItem("projectSwiperIndex", swiper.activeIndex);
		});
	},
	/**
	 * main.utils.con05 : con05 video
	 **/
	con05: function(){
		var $videoWrap = $('.video_wrap');

		gsap.to($videoWrap,{
			scrollTrigger:{
				id:"video",
				trigger: '.con05',
				start:"top 60%",
				scrub: true,
				invalidateOnRefresh: true,
				// markers: true,
				onEnter:function(){
					$videoWrap.find('video').get(0).play();
				},
				onLeave:function(){
					$videoWrap.find('video').get(0).pause();
				},
				onLeaveBack:function(){
					$videoWrap.find('video').get(0).pause();
				},
				onEnterBack:function(){
					$videoWrap.find('video').get(0).play();

				}
			}
		})
    },
	/**
     * main.utils.dataMotion - 모션 추가 data
     */
    dataMotion: function () {
        if ($("[data-motion]").length > 0) {
            $('[data-motion]').each((idx, item) => {
                ScrollTrigger.create({
                    id: 'dataMotion_' + idx,
                    trigger: $(item),
                    scrub: 0.5,
					start: "top 75%",
					end: "bottom 75%",
                    // markers:true,
                    invalidateOnRefresh: true,
                    onEnter: function(){
						$(item).addClass('active');
					},
                    // onLeaveBack:() => $(item).removeClass('active'),
                })
            });
        }
    },
	init: function(){
		main.utils.scroll();
		main.utils.header();
		main.utils.introMotion();
		main.utils.con02();
		main.utils.con04();
		main.utils.con05();
		main.utils.dataMotion();
	}
}

$window.on('load resize', function () {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    isTouchDevice = (getComputedStyle(document.documentElement).getPropertyValue("--pointer")) == "coarse";
});

main.utils.init();