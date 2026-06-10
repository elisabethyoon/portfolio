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

		// 인트로 모션 한번만
		// const introFlag = sessionStorage.getItem('introMotionPlayed');

		// if (introFlag === 'Y') {
		// 	$('.loading_box').addClass('hide').hide();

		// 	// 뒤로가기 했을 때 로딩 관련 상태 확실히 제거
		// 	main.utils.isMoveStop(false, true);

		// 	// GNB는 바로 보이게
		// 	if(mediaQuery.matches) { // pc
		// 		tl
		// 		.add(() => {
		// 			$(".con01").addClass("active");
		// 		})
				
		// 	} else { // m
		// 		tl
		// 		.add(() => {
		// 			$(".con01").addClass("active");
		// 		})
		// 	}

		// 	return;
		// }

		// sessionStorage.setItem('introMotionPlayed', 'Y');
		
		main.utils.isMoveStop(true, true);
		
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
					main.utils.isMoveStop(false, true);
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
					main.utils.isMoveStop(false, true);
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

		$(".project_swiper .swiper-slide").on("click", function () {
			sessionStorage.setItem("projectSwiperIndex", swiper.activeIndex);
		});


		let projectImgSrc = '../../images/project/subpage-image';

		let popupDataList = [
			{
				idx: 0,
				content: [
					{
						title: '대구대학교 70주년 행사관',
						projectImg: `${projectImgSrc}12_1.png`,
						projectLink: 'https://70th.daegu.ac.kr/anniversary',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2025년 12월 ~ 2026년 4월',
									'- 행사관 오픈 : 2026년 2월 25일',
									'- 기념관 오픈 : 2026년 4월 28일'
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 대구대학교 70주년을 맞이해 기념행사관 홈페이지 신규 런칭',
									'- 고객사의 요청에 따라 다수의 인터랙티브 모션 적용',
									'- 지속적인 요구사항과 수정 요청에 유연하게 대응하며, 기획 의도에 부합하는 모션 및 기능 구현 완수',
									'- 행사관/기념관 각기 다른 url로 설계되었으나 기념관 오픈 전 고객사 요구로 메인페이지가 하나로 합쳐짐'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / lenis.js 스크롤 트리거형 인터랙션 및 애니메이션 적용',
									'- 성능 저하 없이 자연스러운 사용자 경험 제공'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 10페이지 내외',
									'- 수행인력 : 2명',
									'- 기여도 : 50%',
									'* 메인페이지 / 개교 70주년 / DU 영상관 작업'
								]
							},
						],
					},
					{
						title: '대구대학교 70주년 기념관',
						projectImg: `${projectImgSrc}12_2.png`,
						projectLink: 'https://70th.daegu.ac.kr/anniversary',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2025년 12월 ~ 2026년 4월',
									'- 행사관 오픈 : 2026년 2월 25일',
									'- 기념관 오픈 : 2026년 4월 28일'
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 대구대학교 70주년을 맞이해 기념행사관 홈페이지 신규 런칭',
									'- 고객사의 요청에 따라 다수의 인터랙티브 모션 적용',
									'- 지속적인 요구사항과 수정 요청에 유연하게 대응하며, 기획 의도에 부합하는 모션 및 기능 구현 완수',
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / lenis.js 스크롤 트리거형 인터랙션 및 애니메이션 적용',
									'- 성능 저하 없이 자연스러운 사용자 경험 제공'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 10페이지 내외',
									'- 수행인력 : 2명',
									'- 기여도 : 50%',
									' * 설립자 스토리 / 대구대학교 발자취 / DU 아카이브 작업'
								]
							},
						],
					},
				],
			},
			{
				idx: 1,
				content: [
					{
						title: '대상웰라이프 - 국문/영문/중문',
						projectImg: `${projectImgSrc}11.png`,
						projectLink: 'https://daesangwellife.com/kr/index',
						info: {
							text: [
								'* 수상 경력',
								'웹어워드 코리아 2025 UI/UX 이노베이션 대상',
								'2025 GDWEB Design Awards Bronze Prize 식품'
							]
						},
						desc: [
							{
								label: '기간',
								text: [
									'2025년 1월 ~ 2025년 5월',
									'오픈 : 2025년 6월 1일'
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 연매출 3,000억 규모의 건강식품 전문 브랜드 홈페이지 리뉴얼',
									'- 고객사의 요청에 따라 메인 페이지에 다수의 인터랙티브 모션 적용',
									'- 지속적인 요구사항과 수정 요청에 유연하게 대응하며, 기획 의도에 부합하는 모션 및 기능 구현 완수',
									'- 브랜드 강조를 위한 시각적 임팩트 확보, 최종 결과물에 대한 고객사 만족도 매우 높음'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / lenis.js 스크롤 트리거형 인터랙션 및 애니메이션 적용',
									'- 성능 저하 없이 자연스러운 사용자 경험 제공'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 30페이지 내외',
									'- 수행인력 : 3명',
									'- 기여도 : 20%',
									'* 메인 페이지 / 웰라이프 솔루션 작업 (병행 프로젝트 PL 역할 수행으로 참여율 제한)'
								]
							},
						],
					},
				],
			},
			{
				idx: 2,
				content: [
					{
						title: '삼양 CI 가이드',
						projectImg: `${projectImgSrc}10.png`,
						projectLink: 'https://ci.samyang.com/',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2024년 12월 ~ 2025년 3월',
									'오픈 : 2025년 3월 14일'
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 기업 아이덴티티(CI)를 임직원 및 고객에게 효율적으로 전달하기 위한 사이트 구축',
									'- 활용도 높은 CI 템플릿 양식 제공으로 사용 편의성 강화',
									'- 퍼블리싱 PL로 참여, 전체 퍼블리싱 일정·품질 총괄 및 프로젝트 리딩'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / lenis.js 애니메이션, 모션, 페이지 스크롤 등'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 20페이지 내외',
									'- 수행인력 : 2명',
									'- 기여도 : 90%',
									'* 메인 페이지 / 기업 공통 양식 제외 전체 작업'
								]
							},
						],
					},
				],
			},
			{
				idx: 3,
				content: [
					{
						title: '삼양홀딩스 외 12개 계열사 사이트 리뉴얼 - 국문/영문/중문',
						projectImg: `${projectImgSrc}9.png`,
						projectLink: 'https://www.samyang.co.kr/kr/',
						info: {
							text: [
								'* 수상 경력',
								'웹어워드 코리아 2024 대기업 종합분야 최우수상 수상작'
							]
						},
						desc: [
							{
								label: '기간',
								text: [
									'2024년 8월 ~ 2024년 9월',
									'오픈 : 2024년 10월 1일'
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 기업CI 변경으로 인한 13개 전 계열사 CI 리뉴얼 작업 (언어: 국,영,중문)',
									'- 모든 공통 컴포넌트 및 컬러, 쉐잎 등 전체 변경',
									'- 기존 레이아웃은 크게 변하지 않았으나 각 계열사 메인페이지, 회사소개 페이지 등 굵직한 페이지 새로 작업'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / lenis.js 애니메이션, 모션, 페이지 스크롤 등'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 각 계열사 당 3~60페이지 (13개 계열사)',
									'- 수행인력 : 3명',
									'- 기여도 : 35%',
									'* 각 계열사 메인페이지 작업 / 메인 제외 페이지는 나눠서 작업'
								]
							},
						],
					},
				],
			},
			{
				idx: 4,
				content: [
					{
						title: 'Hanatour - 국문/영문/중문/일문',
						projectImg: `${projectImgSrc}8.jpg`,
						projectLink: 'https://www.hanatourcompany.com/kr/index',
						info: {
							text: [
								'* 수상 경력',
								'웹어워드 코리아 2024 기업브랜드 혁신 대상 수상작',
								'2024 앤어워드(AND Award) 수상'
							]
						},
						desc: [
							{
								label: '기간',
								text: [
									'2024년 5월 ~ 2024년 8월',
									'- 1차 오픈 : 2024년 7월 10일',
									'- 2차 오픈 : 2024년 8월 29일',
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 국·영·중·일 4개 언어 버전의 통합 웹사이트 구축 프로젝트 참여',
									'- 메인 페이지 퍼블리싱 담당, UX를 고려한 구조 및 인터랙션 구현',
									'- 사용자 접근성과 콘텐츠 전달력 향상에 집중하여 브랜드 아이덴티티 강화',
									'- 해당 프로젝트로 2024 웹어워드코리아 기업브랜드 혁신 대상 수상',
									'- 2024 앤어워드(AND Award) 수상으로 디자인·기술 우수성 인정'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / draggable.js / tilt.js / chart.js / lenis.js (애니메이션, 모션, 드래그, 페이지 스크롤 등)'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 5~60페이지',
									'- 수행인력 : 3명',
									'- 기여도 : 35%',
									'* 메인페이지 / Ci / 여행서비스 / b2b비즈니스 / INVESTORS / 하나인 생활 / 직원 인터뷰  등 작업'
								]
							},
						],
					},
				],
			},
			{
				idx: 5,
				content: [
					{
						title: '삼익THK - 국문/영문',
						projectImg: `${projectImgSrc}7.png`,
						projectLink: 'https://www.samickthk.co.kr/kr/index',
						info: {
							text: [
								'* 수상 경력',
								'웹어워드 코리아 2024 중견기업-제조분야 최우수상 수상작'
							]
						},
						desc: [
							{
								label: '기간',
								text: [
									'2024년 1월 ~ 2024년 4월',
									'오픈 : 2024년 5월 10일',
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- B2B 제조기업의 브랜드 이미지 제고를 위한 웹사이트 리뉴얼 참여 (국,영문)',
									'- 고객 요청에 따라 제조업 특성과는 이례적으로 다수의 스크롤 기반 인터랙티브 모션 적용',
									'- 일정이 촉박한 상황에서도 기획 의도와 사용성 균형을 맞춘 구조 변경 및 모션 조정 완수',
									'- 웹어워드코리아 2024 중견기업 제조 분야 최우수상 수상, 디자인·기술적 완성도 인정'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / draggable.js / tilt.js / fullpage.js / chart.js / lenis.js (애니메이션, 모션, 드래그, 페이지 스크롤 등)'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 2~30페이지',
									'- 수행인력 : 4명',
									'- 기여도 : 25%',
									'* 메인페이지 / 네트워크 / 모션 사업 intro / IR / 사보 페이지 등 작업'
								]
							},
						],
					},
				],
			},
			{
				idx: 6,
				content: [
					{
						title: 'BGF 에코머티리얼즈 - 국문/영문/중문',
						projectImg: `${projectImgSrc}6.png`,
						projectLink: 'https://www.bgfecomaterials.com/kr/index',
						info: {
							text: [
								'* 수상 경력',
								'웹어워드 코리아 2024 금속/화학업분야 최우수상 수상작'
							]
						},
						desc: [
							{
								label: '기간',
								text: [
									'2023년 7월 ~ 2023년 12월',
									'오픈 : 2023년 12월 12일',
								]
							},
							{
								label: '프로젝트 성과',
								text: [
									'- 국·영·중문 3개 언어 대응, 총 50~60페이지 규모의 다국어 웹사이트 구축',
									'- 2인 투입 구성으로 제한된 인력에도 불구하고 일정 지연 없이 안정적으로 완료',
									'- BGF 브랜드 아이덴티티에 맞춘 구조 및 비주얼 요소 적용',
									'- 웹어워드코리아 2024 금속/화학업 분야 최우수상 수상, 디자인 및 기술 완성도 입증'
								]
							},
							{
								label: 'skill 및 라이브러리',
								text: [
									'- HTML5 / scss / javascript / jquery / gsap / scrollTrigger / smoothScroll.js (애니메이션, 모션, 페이지 스크롤 등)'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 5~60페이지',
									'- 수행인력 : 2명',
									'- 기여도 : 40%',
									'* 회사소개 / 사업영역 / R&D / 솔루션별 / 제품 특성 / 제품 물성표 / IR / 직무소개 작업'
								]
							},
						],
					},
				],
			},
			{
				idx: 7,
				content: [
					{
						title: '보관서비스 프로젝트',
						projectImg: `${projectImgSrc}5_1.png`,
						projectLink: '',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2021년 11월 ~ 2021년 12월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 1인가구 및 거주 공간 효율확대성을 위해 옷장 보관서비스 출범',
									'- 기능별 / UI 컴포넌트별 마크업, 기능별 로직 컴포넌트 작업, api 호출 등 작업'
								]
							},
							{
								label: 'skill',
								text: [
									'- ReactNative / redux-thunk / Axios / styled-component / javascript'
								]
							},
							{
								label: 'Flatform',
								text: ['ReactNative']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 모바일 앱 6페이지',
									'- 수행인력 : 2명',
									'- 기여도 : 80%',
								]
							},
						],
					},
					{
						title: '서비스 피드백 프로젝트',
						projectImg: `${projectImgSrc}5_2.png`,
						projectLink: '',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2021년 07월 ~ 2021년 10월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 세탁물에 문제가 생겼을 때 고객센터로의 인입량을 줄이기 위해 서비스 피드백 프로세스 출범',
									'- 기능별 / UI 컴포넌트별 마크업, 기능별 로직 컴포넌트 작업, api 호출 등 작업'
								]
							},
							{
								label: 'skill',
								text: [
									'- ReactNative / redux-thunk / Axios / styled-component / javascript'
								]
							},
							{
								label: 'Flatform',
								text: ['ReactNative']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 모바일 앱 3-40페이지',
									'- 수행인력 : 3명',
									'- 기여도 : 30%',
								]
							},
						],
					},
				],
			},
			{
				idx: 8,
				content: [
					{
						title: '위매치다이사 리뉴얼',
						projectImg: `${projectImgSrc}4_1.png`,
						projectLink: 'https://da24.wematch.com',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2018년 8월 ~ 2018년 11월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 서비스명 변경 "다이사" -> (현)"위매치다이사"',
									'- 브랜드명 변경으로 인해 전체 서비스 리뉴얼 진행',
									'- 전 페이지 마크업 / 스크립트 개발',
								]
							},
							{
								label: 'skill',
								text: [
									'- HTML5 / css3 / javascript / jquery'
								]
							},
							{
								label: 'Flatform',
								text: ['PC / Mobile']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 모바일 4~50페이지 / PC 4~50페이지',
									'- 수행인력 : 3명',
									'- 기여도 : MO - 100% / PC - 60%',
								]
							},
						],
					},
					{
						title: '위매치다이사 원룸 리뉴얼',
						projectImg: `${projectImgSrc}4_2.png`,
						projectLink: '',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2020년 7월 ~ 2020년 10월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 기존 마크업 업무에서 프론트엔드로 전향하고자 프로젝트에 자발적으로 투입함',
									'- 기존 접수 프로세스 보다 더 간편하게 접수 할 수 있는 서비스로 리뉴얼 진행',
									'- component 작업 / api호출 등 서브작업 위주'
								]
							},
							{
								label: 'skill',
								text: [
									'- React / Axios / styed-component / javascript'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 수행인력 : 2명',
									'- 기여도 : 20%',
								]
							},
							{
								label: '',
								text: [
									'* 운영 종료된 프로젝트입니다.',
								]
							},
						],
					},
					{
						title: '위매치다이사 파트너',
						projectImg: `${projectImgSrc}4_3.png`,
						projectLink: '',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									' 2019년 4월 ~ 2019년 12월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 사장님들이 사용하는 파트너 서비스 리뉴얼 작업 진행',
									'- 순차적으로 페이지 리뉴얼 마크업',
									'- 레거시 중복코드 통합작업 및 공통이미지 sprite 작업개선',
									'- javascript/jquery 스크립트 개발',
								]
							},
							{
								label: 'skill',
								text: [
									'- HTML5 / css3 / javascript / jquery'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 기여도 : 70%',
								]
							},
						],
					},
				],
			},
			{
				idx: 9,
				content: [
					{
						title: '마켓디자이너스 리뉴얼',
						projectImg: `${projectImgSrc}3_1.png`,
						projectLink: 'https://marketdesigners.com/',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2019년 7월 ~ 2019년 10월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 기존 마크업 업무에서 Vue 언어로 신규 도입 후 첫 프로젝트 진행',
									'- component작업 / api호출 등 서브작업 위주',
								]
							},
							{
								label: 'skill',
								text: [
									'- Vue / Vue Router / Nuxt / SCSS / Axios / javascript'
								]
							},
							{
								label: 'Flatform',
								text: ['반응형']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 9페이지',
									'- 수행인력 : 2명',
									'- 기여도 : 40%',
								]
							},
						],
					},
					{
						title: '마켓디자이너스',
						projectImg: `${projectImgSrc}3_2.png`,
						projectLink: 'https://marketdesigners.com/',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2017년 11월 ~ 2017년 12월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 서비스 리뉴얼',
									'- 전 페이지 마크업',
									'- 모바일 신규 오픈 / 피씨 부분 리뉴얼',
									'- javascript/jquery 스크립트 개발',
								]
							},
							{
								label: 'skill',
								text: [
									'- HTML5 / css3 / javascript / jquery'
								]
							},
							{
								label: 'Flatform',
								text: ['PC / Mobile']
							},
							{
								label: '기여도',
								text: [
									'- 규모 : 모바일 8페이지 / 피씨 리뉴얼명',
									'- 수행인력 : 1명',
									'- 기여도 : 100%',
								]
							},
						],
					},
				],
			},
			{
				idx: 10,
				content: [
					{
						title: '위매치부동산 리뉴얼',
						projectImg: `${projectImgSrc}2.png`,
						projectLink: '',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2020년 4월 ~ 2020년 6월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 서비스명 변경 "위매치부동산" -> (현)"오즈의 집"',
									'- 위매치 서비스 디자인 통합으로 인해 리뉴얼 작업 진행',
									'- 순차적으로 페이지 리뉴얼 마크업 작업',
									'- javascript/jquery 스크립트 개발',
								]
							},
							{
								label: 'skill',
								text: [
									'- HTML5 / css3 / javascript / jquery'
								]
							},
							{
								label: 'Flatform',
								text: ['PC / Mobile']
							},
							{
								label: '기여도',
								text: [
									'- 수행인력 : 2명',
									'- 기여도 : 50%',
								]
							},
							{
								label: '',
								text: [
									'* 운영 종료된 프로젝트입니다.',
								]
							},
						],
					},
				],
			},
			{
				idx: 11,
				content: [
					{
						title: '위매치머니 리뉴얼',
						projectImg: `${projectImgSrc}1.png`,
						projectLink: 'https://www.toppingmoney.com',
						info: null,
						desc: [
							{
								label: '기간',
								text: [
									'2018년 1월 ~ 2018년 6월',
								]
							},
							{
								label: '작업내용',
								text: [
									'- 서비스명 변경 "더 모기지" -> "위매치머니" -> (현)"토핑머니"',
									'- 위매치 서비스 디자인 통합으로 인해 리뉴얼 작업 진행',
									'- 이후 위매치머니, 토핑머니는 디자인프레임만 변경됨',
									'- javascript/jquery 스크립트 개발',
								]
							},
							{
								label: 'skill',
								text: [
									'- HTML5 / css3 / javascript / jquery'
								]
							},
							{
								label: 'Flatform',
								text: ['PC / Mobile']
							},
							{
								label: '기여도',
								text: [
									'- 수행인력 : 1명',
									'- 기여도 : 100% (pc/mobile)',
								]
							},
						],
					},
				],
			},
		]

		// 프로젝트 팝업 열기
		$document.on('click', '.project_swiper .swiper-slide', function() {
			let idx = $(this).index();

			main.utils.isMoveStop(true, true);
			$('.popup_wrap').addClass('active');
			
			renderPopup(idx);
			
			setTimeout(() => {
				$('.popup_wrap .content_wrap').addClass('active');
			}, 600);
		})

		// 프로젝트 팝업 닫기 버튼
		$document.on('click', '.popup_wrap .btn_close', function(e){
			main.utils.isMoveStop(false, true);

			$('.popup_wrap').removeClass('active');
			$('.popup_wrap .content_wrap').removeClass('active');

		})


		function renderPopup(idx) {
			$('.popup_wrap .popup_inner').scrollTop(0);
		
			const project = popupDataList.find(item => item.idx === idx);
		
			if (!project) return;
		
			const html = project.content.map((elem, index) => {
				const descHtml = elem.desc.map(desc => {
					return `
						<div class="desc_box">
							<h4>${desc.label}</h4>
							<p class="sub_txt">${desc.text.join('<br>')}</p>
						</div>
					`;
				}).join('');
		
				return `
					<div class="content_wrap">
						<div class="con con01">
							<div class="txt_box">
								<h3>PROJECT</h3>
								<p class="sub_tit">${elem.title}</p>
							</div>
							<img src="${elem.projectImg}" alt="">
						</div>
		
						<div class="con con02">
							<h3>DESCRIPTION</h3>
		
							${elem.projectLink ? `
								<a href="${elem.projectLink}" target="_blank" class="link_btn">
									홈페이지 바로가기<span class="icon_link"></span>
								</a>
							` : ''}
		
							${elem.info ? `
								<div class="info_box">
									${elem.info.text.map(txt => `<p>${txt}</p>`).join('')}
								</div>
							` : ''}
		
							${descHtml}
						</div>
					</div>
				`;
			}).join('');
		
			$('.popup_item').html(html);
		}
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
	/**
     * main.utils.debuggerGuide
	*/
	 debuggerGuide: function () {
        document.addEventListener("keyup", function (e) {
            var keyCode = e.keyCode;
            // F9
            if (e.key === "F9") {
                var $debugger = $("#gridGuide");
                $debugger.toggleClass("is-active");
            }
        });
    },
	init: function(){
		main.utils.scroll();
		main.utils.header();
		main.utils.introMotion();
		main.utils.con02();
		main.utils.con04();
		main.utils.con05();
		main.utils.dataMotion();
		main.utils.debuggerGuide();
	}
}

$window.on('load resize', function () {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    isTouchDevice = (getComputedStyle(document.documentElement).getPropertyValue("--pointer")) == "coarse";
});

main.utils.init();