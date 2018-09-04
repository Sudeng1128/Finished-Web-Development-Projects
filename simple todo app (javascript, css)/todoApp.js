$('ul').on('click', 'li', function(){
    // when an li is clicked inside this ul, run this code
    $(this).toggleClass('completed');  
})

$('ul').on('click', 'span', function(event){
    $(this).parent().fadeOut(function() {
        $(this).remove();
    });
    event.stopPropagation();
})

$('input').keypress(function(event) {
    if (event.which === 13) {
        // event.which === 13 means when enter is pressed
        $('ul').append('<li><span><i class="far fa-trash-alt"></i></span> ' + $(this).val() + '</li>');
        $(this).val('');
    }
})

$('.fa-plus').on('click', function(){
    $('input').fadeToggle();
})