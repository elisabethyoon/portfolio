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
	 * main.utils.introMotion : 진입 모션
	 **/
	introMotion: function() {
        let tl = gsap.timeline({});
		// const introFlag = sessionStorage.getItem('introMotionPlayed');

		// if (introFlag === 'Y') {
		// 	$('.loading_box').addClass('hide').hide();

		// 	// 뒤로가기 했을 때 로딩 관련 상태 확실히 제거
		// 	$('body').removeClass('scroll-disable');

		// 	// GNB는 바로 보이게
		// 	if(mediaQuery.matches) { // pc
		// 		tl
		// 		.add(() => {
		// 			$('.gnb_list').addClass('gnbShow');
		// 		}, '+=0.5')
		// 		.to('.gnb_list li', {
		// 			y: 0,
		// 			opacity: 1,
		// 			duration: 0.6,
		// 			ease: 'Power1.easeOut',
		// 			delay: 0.8
		// 		})
		// 		.add(() => {
		// 			$('.kv_tit').addClass('active');
		// 		})
		// 	} else { // m
		// 		tl
		// 		.add(() => {
		// 			$('.gnb_list').addClass('gnbShow');
		// 		})
		// 		.to('.gnb_list li', {
		// 			y: 0,
		// 			opacity: 1,
		// 			duration: 0.6,
		// 			ease: 'Power1.easeOut',
		// 			delay: 0.8
		// 		}, '<')
		// 		.add(() => {
		// 			$('.kv_tit').addClass('active');
		// 		}, '-=1')
		// 	}

		// 	return;
		// }

		// sessionStorage.setItem('introMotionPlayed', 'Y');
		
		// $body.addClass('scroll-disable');
		

        // main visual timeline animation
		if(mediaQuery.matches) { // pc
			tl
			.to({}, { duration: 0.35 })
			
			
		} else { // m
			tl
			.to({}, { duration: 0.35 })
			
		}
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
						$wrap.removeClass("gnb_open");
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
						$wrap.removeClass("gnb_open all_menu_open");
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
									$wrap.removeClass("gnb_open");
								},300);
							} else{
								_this.addClass("active");
								$wrap.addClass("gnb_open");
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
	 * main.utils.cont01 : cont01 cloud motion
	 **/
	cont01: function(){
		let tl = gsap.timeline();

		gsap.to('.cloud_box',{
			scrollTrigger:{
				trigger: '.con02',
				start:"top 45%",
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
	 * main.utils.cont03 : cont03 motion
	 **/
	cont03: function(){
        var swiper = new Swiper(".project_swiper", {
            slidesPerView: 2,
			spaceBetween: 20,
			centeredSlides: false,
			scrollbar: {
				el: ".swiper-scrollbar",
				hide: false,
				draggable: true,
				snapOnRelease: false,
			},
        });

		var $videoWrap = $('.video_wrap');

		gsap.to($videoWrap,{
			scrollTrigger:{
				id:"video",
				trigger: '.cont04',
				start:"top 70%",
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
	init: function(){
		main.utils.scroll();
		main.utils.introMotion();
		main.utils.header();
		// main.utils.titleEffect();
		// main.utils.sec02();
		// main.utils.sec03();
		// main.utils.sec04();
		main.utils.cont01();
		main.utils.cont03();
	}
}

$window.on('load resize', function () {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    isTouchDevice = (getComputedStyle(document.documentElement).getPropertyValue("--pointer")) == "coarse";
});

main.utils.init();