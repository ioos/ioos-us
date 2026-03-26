$(function() {
  var CATALOG_URL = "https://data.ioos.us/dataset?q=";

  headerScroll = function () {
    var scroll = $(this).scrollTop();
      if (scroll > 50) {
        $('header > div > a').css('visibility', 'hidden');
        $('header').css('position', 'fixed');
        if ($('body').width() > 768) {
            $('header').css('top', '-50px');
            $('#grid-container, #main-container.comt-projects').css('margin-top', '200px');
        }
      } else {
        $('header > div > a').css('visibility', 'visible');
          $('header').css({'position':'static','top':'0'});
          if ($('body').width() > 768)
      $('#grid-container, #main-container.comt-projects').css('margin-top', '25px');
      }
  };
  $(document).scroll(headerScroll);
  window.onresize = function (e) {
    if ($('body').width() > 768 && $('header').css('top') === undefined) {
      headerScroll();
    }
  };
  $('[data-toggle="tooltip"]').tooltip();
  $('.collapse')
    .collapse('hide')
    .on('show.bs.collapse', function() {
      $('#search-data-button').addClass('open');
      setTimeout(function() {
        $('#search-input-collapse input').focus();
      }, 50);
    })
  .on('hide.bs.collapse', function() {
    $('#search-data-button').removeClass('open');
    setTimeout(function() {
      $('#search-data-button').blur();
    }, 50);
  });
  function searchCatalog () {
    var query = $('input').val().trim();
    if (query !== "") {
      window.open(CATALOG_URL + query, "_self");
    }
  }
  $('#search-input-collapse input').on('keyup', function(e) {
    if (e.which === 13) {
      searchCatalog();
    }
  });
  $('#search-input-collapse button').on('click', searchCatalog);
  $('#feedback').on('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    $('#feedbackForm textarea, #feedbackForm input:not([type="submit"])').val('');
    $('#feedbackForm').modal({show:true});
  });
  $('#feedbackForm [id]').on('focus', function(e) {
    if ($(e.currentTarget).parent().hasClass('has-error'))
      $(e.currentTarget).parent().removeClass('has-error').find('span').css('visibility', 'hidden');
  });
  $('#feedbackForm').on('shown.bs.modal', function() {
    $('#feedbackForm textarea').focus();
  });

  $('#feedbackForm input[type="submit"]').on('click', function (e) {
    var valid = true;
    $('#feedbackForm [id]').each(function (i, v) {
      if ($(v).val() === '') {
        $(v).parent().addClass('has-error').find('span').css('visibility', 'visible');
        valid = false;
      }
      else
        if ($(v).attr('id') === 'feedback-email' && !validateEmail($(v).val())) {
          $(v).parent().addClass('has-error').find('span').css('visibility', 'visible');
          valid = false;
        }
    });
    if (valid)
      $.ajax({
        url   : 'https://oceansMap2.asascience.com/?SiteID=1&Name=' + $('#feedback-name').val() + '&Email=' + $('#feedback-email').val() + '&Comment=' + $('#feedback-comment').val(),
        type  : 'POST',
        success: function (data) {
          alert('Feedback Submitted');
          $('#feedbackForm').modal('hide');
        },
        error: function (error) {
          alert('An Error has Occurred');
        }
      });

    $(e.currentTarget).blur();
  });
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  headerScroll();
});
