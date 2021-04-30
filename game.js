var version = '0.0.1';

init();

function init() {
    background_canvas = document.getElementById('background_canvas');
    background_ctx = main_canvas.getContext('2d');
    main_canvas = document.getElementById('main_canvas');
    main_ctx = main_canvas.getContext('2d');
    main_ctx.fillStyle = 'red';
    main_ctx.fillRect(10,10,50,50,);
}

function mouse(e) {
    var x = e.pageX;
    var y = e.pageY;
}