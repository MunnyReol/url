$(document).ready(function() {
  GitIO.init();
  var currentYear = (new Date).getFullYear();
  $("#year").text( currentYear );
/*
  var _gauges = _gauges || [];
  (function() {
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'gauges-tracker';
    t.setAttribute('data-site-id', '4f919d1df5a1f504b3000026');
    t.src = '//secure.gaug.es/track.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  })();
*/
});

var GitIO = {
  url: 'http://git.io',
  clipboard: '',

  init: function() {
    GitIO.initBrowserFallbacks();
    GitIO.initClipboard();
    GitIO.observeFormSubmissions();
    GitIO.observeRestarts();
  },

  initBrowserFallbacks: function() {
    if (!Modernizr.input.placeholder) {
      $('input[placeholder]').each(function(input) {
        $(this).defaultValue($(this).attr('placeholder'), 'active', 'inactive');
      });
    }
  },

  initClipboard: function() {
    ZeroClipboard.config({ forceHandCursor: true, moviePath: '/flash/ZeroClipboard.swf' });
    GitIO.clipboard = new ZeroClipboard($('#copy-button'));

    GitIO.clipboard.on('load', function (client) {

      GitIO.clipboard.on('mouseover', function (client) {
        $('#copy-button').addClass('hover');
      });

      GitIO.clipboard.on( 'datarequested', function(client) {
        GitIO.clipboard.setText($('#output-url').val());
        $('#copy-button').addClass('active');
        $('#copied-msg').show();
      });

      GitIO.clipboard.on( 'complete', function(client, args) {
        $('#copy-button').removeClass('active');
      });
    })
  },

  observeFormSubmissions: function() {
    $('form').submit(function(e) {
      var form = $(e.target)
      e.preventDefault();

      $.ajax(
        { type: form.attr('method')
        , url: form.attr('action')
        , data:
          { url: $('#input-url').val()
          }
        , success: function(data) {
            var outputURL = GitIO.url + "/" + data;
            $('#output-url').val(outputURL).select();
            $('#input-url').removeClass('error');
            $('.arrow_box').hide();
            $('#bar').addClass('flipped');
          }
        , error: function(xhr, ajaxOptions, thrownError) {
            $('#error').text(xhr.responseText)
            $('#input-url').addClass('error');
            $('.arrow_box').show();
          }
        }
      )
    });
  },

  observeRestarts: function() {
    $('a#restart').click(function(e) {
      e.preventDefault();
      $('#input-url').val('').focus();
      $('#output-url').val('');
      $('#copied-msg').hide();
      $('#bar').removeClass('flipped');
    });
  }
};
