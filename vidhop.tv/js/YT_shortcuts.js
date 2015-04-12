window.addEventListener("keydown", moveSomething, false);

function moveSomething(e) {
    switch(e.keyCode) {
        case 32:
            // space bar pressed
            break;
        case 37:
            // left key pressed
            if (selection == 0) {
                selection = vids.length - 1;
            }
            else {
                selection -= 1;
            }
            player.loadVideoById(vids[selection]);
        case 38:
            // up key pressed
            break;
        case 39:
            // right key pressed
            if (selection == vids.length - 1) {
                selection = 0;
            }
            else {
                selection += 1;
            }
            player.loadVideoById(vids[selection]);
        case 40:
            // down key pressed
            break;
    }
}