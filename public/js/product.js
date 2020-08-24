$('#id').on('click', function() {
    var count = $("#popo").find($("input")).length + 1
    if (count < 8) {
        var highlight = '<input type="text" name="highlights[]" placeholder="Highlight '+count+'">'
        $('#popo').append(highlight)
    } else {
        alert('Max limit reached!')
    }
})

$('#add-spec-title').on('click', function() {
    var specTitle = $('.spec-title').val()
    var divId = specTitle.split(' ').join('')
    var inputHtml = '<input type="text" name="specifications['+specTitle+'][]" placeholder="Title - Details">'

    if($("#" + divId).length == 0) {
        var html = '<div class="col-4">'
        html += '<div id="'+divId+'" class="jumbotron">'
        html += '<h4>'+ specTitle +'</h4>'
        html += inputHtml
        html += '</div></div>'
        $('#popo').prepend(html)
    } else {
        $("#" + divId).append(inputHtml)
    }
})