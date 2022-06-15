var windowWidth,lazyLink,lazyImages,lazyBackground,lazyIframe,lazyScripts,navigator_platform,lazyLoadedJS,src,style,datasrc,urls,analytics,s,x,i,j,flag;function init(){flag&&(flag=0,lazyLoadIframe(),load_all_js())}function isElementInViewport(t){var a=t.getBoundingClientRect();return a.top>=0&&a.left>=0&&a.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&a.right<=(window.innerWidth||document.documentElement.clientWidth)}function lazyLoadLink(){lazyLink.forEach(function(t){t.href=null==t.dataset.href?t.href:t.dataset.href})}function lazyLoadImg(){lazyImages.forEach(function(t){null!=(src=windowWidth<600?null==t.dataset.mobsrc?t.dataset.src:t.dataset.mobsrc:t.dataset.src)&&(t.src=src),t.classList.remove("lazy2")})}function lazyLoadImg2(){lazyImages.forEach(function(t){isElementInViewport(t)&&(null!=(src=windowWidth<600?null==t.dataset.mobsrc?t.dataset.src:t.dataset.mobsrc:t.dataset.src)&&(t.src=src),t.classList.remove("lazy"))})}function lazyLoadBackground(){lazyBackground.forEach(function(t){lazybg=windowWidth<600?null==t.dataset.mobstyle?t.dataset.style:t.dataset.mobstyle:t.dataset.style,null!=lazybg&&(t.style=lazybg),t.classList.remove("lazybg")})}function lazyLoadIframe(){lazyIframe.forEach(function(t){t.src=null==t.dataset.src?t.src:t.dataset.src})}function lazyLoadScripts(){j!=lazyScripts.length&&("lazyload2"==lazyScripts[j].getAttribute("type")?(lazyScripts[j].setAttribute("type","lazyloaded"),void 0!==lazyScripts[j].dataset.src?((s=document.createElement("script")).src=lazyScripts[j].dataset.src,document.body.appendChild(s),s.onload=function(){j++,lazyLoadScripts()}):((s=document.createElement("script")).innerHTML=lazyScripts[j].innerHTML,document.body.appendChild(s),j++,lazyLoadScripts())):(j++,lazyLoadScripts()))}function lazyLoadCss(t){(s=document.createElement("link")).rel="stylesheet",s.href=t,document.getElementsByTagName("head")[0].appendChild(s)}function lazyLoadJS(t){if(lazyLoadedJS)return setTimeout(function(){lazyLoadJS(t)},200),!1;lazyLoadedJS=1,(s=document.createElement("script")).src=t,s.onload=function(){lazyLoadedJS=0},document.body.appendChild(s)}document.addEventListener("DOMContentLoaded",function(){windowWidth=screen.width,lazyLink=document.querySelectorAll("link"),lazyImages=document.querySelectorAll("img.lazy2"),nolazyImages=document.querySelectorAll("img.lazy"),lazyBackground=document.querySelectorAll(".lazybg"),lazyIframe=document.querySelectorAll("iframe"),lazyScripts=document.getElementsByTagName("script"),navigator_platform=navigator.platform,i=0,j=0,flag=1,window.addEventListener("scroll",function(){init()}),window.addEventListener("mousemove",function(){init()}),window.addEventListener("touchstart",function(){init()}),"Linux x86_64"!=navigator_platform&&init(),setTimeout(function(){init()},60000)});

function load_all_js() {
// 	lazyLoadCss();

	
		console.log("Yes-optimization");
		setTimeout(function() {
			const wnw_load = new Event('wnw_load');
			window.dispatchEvent(wnw_load);
		}, 100);

// 		lazyLoadJS("https://cdn.shopify.com/shopifycloud/shopify/assets/storefront/load_feature-d8a6f1446d67009c524ed4e68648800ba9082eb75548ee28e1050331cbe7ba28.js");
// 		lazyLoadJS("https://cdn.shopify.com/shopifycloud/shopify/assets/shopify_pay/storefront-b61f50798075db890698930c4405673937fe89353f7fea7be88b5ce16a9c0af8.js?v=20210208");
// 		lazyLoadJS("https://cdn.shopify.com/shopifycloud/shopify/assets/storefront/features-87e8399988880142f2c62771b9d8f2ff6c290b3ff745dd426eb0dfe0db9d1dae.js");
	
	j=0;
	lazyScripts = document.getElementsByTagName("script");
	lazyLoadScripts();

// 	setInterval(function() {
// 		lazyImages = document.querySelectorAll('img.lazy2');
// 		lazyBackground = document.querySelectorAll('.lazybg');
// 		lazyLoadImg();
// 		lazyLoadBackground();
// 	}, 2000);
}