console.log("Script is loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    let move_speed = 4, gravity = 0.5;
    let bird = document.querySelector('.bird');
    let img = document.getElementById('bird-1');
    let sound_point = new Audio('sounds effect/point.mp3');
    let sound_die = new Audio('sounds effect/die.mp3');
    let sound_flap = new Audio('sounds effect/flap.mp3');
    let background_music = new Audio('sounds effect/music.mp3'); // Load the background music

    // Set volume for sounds
    sound_die.volume = 0.5; // Adjust the volume as needed
    background_music.loop = true; // Loop the background music

    let background = document.querySelector('.background').getBoundingClientRect();

    let score_val = document.querySelector('.score_val');
    let message = document.querySelector('.message');
    let score_title = document.querySelector('.score_title');

    let game_state = 'Start';
    img.style.display = 'none';
    message.classList.add('messageStyle');

    let bird_dy = 0;

    function restartGame() {
        console.log('Restarting game...');
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        bird_dy = 0;
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.classList.remove('messageStyle');
        play();
        background_music.play(); // Play background music when game starts
    }

    document.addEventListener('keydown', (e) => {
        console.log('Keydown event detected:', e.code);

        if ((e.code === 'Enter' || e.code === 'Space') && game_state !== 'Play') {
            console.log('Enter key pressed. Starting game...');
            restartGame();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (game_state === 'Play' && (e.code === 'ArrowUp' || e.code === 'Space')) {
            console.log('Up arrow or space pressed. Bird jumps.');
            img.src = 'images/Bird-2.png';
            bird_dy = -8.6; // Increased jump
            sound_flap.play(); // Play the flapping sound
        }
    });

    document.addEventListener('keyup', (e) => {
        if (game_state === 'Play' && (e.code === 'ArrowUp' || e.code === 'Space')) {
            console.log('Up arrow or space released. Bird image reset.');
            img.src = 'images/Bird.png';
        }
    });

    function play() {
        console.log('Game state: Play');

        function move() {
            if (game_state !== 'Play') return;

            let pipe_sprite = document.querySelectorAll('.pipe_sprite');
            let game_over = false; // Flag to check if game is over

            pipe_sprite.forEach((element) => {
                let pipe_sprite_props = element.getBoundingClientRect();
                let bird_props = bird.getBoundingClientRect();

                if (pipe_sprite_props.right <= 0) {
                    element.remove();
                } else {
                    if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top) {
                        game_state = 'End';
                        game_over = true;
                        message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                        message.classList.add('messageStyle');
                        message.style.left = '50%';
                        message.style.transform = 'translateX(-50%)';
                        img.style.display = 'none';
                        sound_die.play();
                        background_music.pause(); // Pause background music when game is over
                        console.log('Collision detected. Game over.');
                        return;
                    } else {
                        if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score === '1') {
                            score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                            sound_point.play();
                        }
                        element.style.left = pipe_sprite_props.left - move_speed + 'px';
                    }
                }
            });

            if (!game_over) {
                requestAnimationFrame(move);
            }
        }

        requestAnimationFrame(move);

        function apply_gravity() {
            if (game_state !== 'Play') return;
            bird_dy += gravity;
            let bird_props = bird.getBoundingClientRect();
            console.log('Applying gravity. bird_dy:', bird_dy);

            if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
                game_state = 'End';
                message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                message.classList.add('messageStyle');
                message.style.left = '50%';
                message.style.transform = 'translateX(-50%)';
                img.style.display = 'none';
                sound_die.play();
                background_music.pause(); // Pause background music when game is over
                console.log('Bird out of bounds. Game over.');
                return;
            }

            bird.style.top = bird_props.top + bird_dy + 'px';
            requestAnimationFrame(apply_gravity);
        }

        requestAnimationFrame(apply_gravity);

        let pipe_separation = 0;
        let pipe_gap = 35;

        function create_pipe() {
            if (game_state !== 'Play') return;

            if (pipe_separation > 115) {
                pipe_separation = 0;

                let pipe_posi = Math.floor(Math.random() * 43) + 8;
                let pipe_sprite_inv = document.createElement('div');
                pipe_sprite_inv.className = 'pipe_sprite';
                pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
                pipe_sprite_inv.style.left = '100vw';

                document.body.appendChild(pipe_sprite_inv);
                let pipe_sprite = document.createElement('div');
                pipe_sprite.className = 'pipe_sprite';
                pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
                pipe_sprite.style.left = '100vw';
                pipe_sprite.increase_score = '1';

                document.body.appendChild(pipe_sprite);
                console.log('Pipe created.');
            }
            pipe_separation++;
            requestAnimationFrame(create_pipe);
        }

        requestAnimationFrame(create_pipe);
    }
});
