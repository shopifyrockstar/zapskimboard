/*-----------------------------------------------------------------------------/
/ Custom Theme JS
/-----------------------------------------------------------------------------*/

// Insert any custom theme js here...
$(document).ready(function(){
  var target_hover_id, hover_id;
  var current_image_order;
  $(".collection-additional-info-wrapper .size-tag").click(function(){
    $(this).closest(".custom-class").find(".variant__image").siblings().removeClass("show-manual");
    $(this).closest(".custom-class").find(".size-tag").siblings().removeClass("clicked");
    $(this).closest(".collection-additional-size-wrapper").find(".size-wrapper").each(function(){
    	$(this).find(".size-tag").removeClass("clicked");
    })
    $(this).addClass("clicked");
  	var target_id = $(this).data("id");
    $(this).closest(".custom-class").find("#" + target_id).addClass("show-manual");
  })
  
  $(".product-top-2021").mouseenter(function() {
    
//     $(this).find(".variant__image").each(function(){
//     	console.log($(this).data("id"));
//       if( $(this).hasClass("show-manual") ){
//         $(this).removeClass("show-manual");
//       	target_hover_id = $(this).data("id");
// //         console.log ( "target id is" + target_hover_id);        
//       }
//     })
    
//     $(this).find(".product-image").each(function(){
//       hover_id = $(this).data("id");
//       if ( hover_id == target_hover_id ){
//       	current_image_order = $(this).data("order");
// //         console.log ( "current image order is " + current_image_order);        
//       }
//     })
    
//     $(this).find(".product-image").eq( current_image_order ).addClass("show-manual");
//     $(this).find(".initial-image").addClass("show-manual");
//     if ( $(".product-image").hasClass("show-manual") ){
//       target_hover_id = ( $(this).data("order") ) / 2;
//     }else{
      target_hover_id = ( $(this).find(".show-manual").data("order") ) * 2;	
//     }    
    console.log(target_hover_id);
    $(this).find(".product-image").removeClass("show-manual");
    $(this).find(".variant__image").removeClass("show-manual");
    $(this).find("#" + target_hover_id ).addClass("show-manual");
    
  });
  
  
  $(".product-top-2021-core").mouseenter(function() {
      target_hover_id = ( $(this).find(".show-manual").data("order") ) / 2;	
    console.log(target_hover_id);
    $(this).find(".product-image").removeClass("show-manual");
    $(this).find(".variant__image").removeClass("show-manual");
    $(this).find("#" + target_hover_id ).addClass("show-manual");
    
  });
  
  $(".product-top-2021").mouseleave(function() {
//     $(this).find(".product-image").eq( current_image_order ).removeClass("show-manual");
//     $(this).find(".initial-image").removeClass("show-manual");
    target_hover_id = ( $(".product-image.show-manual").data("order") ) / 2;
    console.log(target_hover_id);
    $(this).find(".product-image").removeClass("show-manual");
    $(this).find(".variant__image").removeClass("show-manual");
    $(this).find('.variant__image[data-order="' + target_hover_id + '"]').addClass("show-manual");
    
  });
  
   $(".product-top-2021-core").mouseleave(function() {
    target_hover_id = ( $(".product-image.show-manual").data("order") ) * 2;
    console.log(target_hover_id);
    $(this).find(".product-image").removeClass("show-manual");
    $(this).find(".variant__image").removeClass("show-manual");
    $(this).find('.variant__image[data-order="' + target_hover_id + '"]').addClass("show-manual");
    
  });
  
  
  
 //custom dropdown js
  $(".dropdown-link").on("click", ".init", function() {
    $(this).closest("ul").children('li:not(.init)').toggle();
  });

  var allOptions = $(".dropdown-link").children('li:not(.init)');
  $(".dropdown-link").on("click", "li:not(.init)", function() {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    var target_location;
    var current_location = $(this).find(".country-value").data("value");
    if ( current_location.indexOf('window.location') > -1){
      target_location = $(this).find(".country-value").data("value").split(`window.location='`)[1];
      target_location = target_location.split(`'`)[0];    
    }else{
    	target_location = current_location;
    }  
    window.location = target_location;
  });
//   end custom dropdown js
  
  
  $(".shopify-section-header #top .secondary-nav .search__form-submit").click(function(e){
    e.preventDefault();
  })
  $(document).click(function(evt){
    var obj = $(".shopify-section-header #top .secondary-nav .search__form-submit i");
    var self_obj = $(".shopify-section-header #top .secondary-nav .search__form-input");    
    if (obj.is(evt.target) || self_obj.is(evt.target) ) {
      $(".shopify-section-header #top .secondary-nav .search__form-input").addClass("show-visible");
    } else {
      $(".shopify-section-header #top .secondary-nav .search__form-input").removeClass("show-visible");
    }
  })
  $('.shopify-section-header #top .secondary-nav .search__form-input').keypress(function(event) {
    if ( event.which == 13 ) {
      console.log("clicked enter");
      $(".shopify-section-header #top .secondary-nav .search__form-input").addClass("show-visible");
      $(this).closest("form").submit();
    }
  });
  
  
  //   changing country flag
  var current_domain = window.location.hostname;
  console.log(current_domain);
  $("#country-group li").each(function(index){
    if( current_domain == 'www.zapskimboards.com' ){
      if ( $(".country-title").hasClass("hidden") ){
        $(".country-title").removeClass("hidden");
      }
      return false;
    }
  	var item_domain = $(this).find(".country-value").data("value");
    var values = item_domain.split('//');
    var last = values[1];
    if ( last == current_domain ){
      if ( $(".country-title").hasClass("hidden") ){
        $(".country-title").removeClass("hidden");
      }      
      var country_class_whole = $(this).find(".country-flag").attr('class');
      $(".dropdown-title.country-title span:first-child").removeClass().addClass( country_class_whole );
      var country_name = $(this).find(".country-list-locale-name").text();
      $(".dropdown-title.country-title .country-list-locale-name").html(country_name);
      return false;
      
    }
    
  })
  
})

