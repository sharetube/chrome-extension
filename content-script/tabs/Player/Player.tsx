import {
    Ad,
    Load,
    LoadManager,
    Mode,
    Modes,
    Mute,
    ObserveElementClasslist,
    Player,
    SendPlayerStateManager,
} from '@player/player';
import {AdminProvider} from '@shared/Context/Admin/Admin';
import log from '@shared/lib/log';
import waitForElement from '@shared/lib/waitForElement';
import Panel from '@widgets/Panel/Panel';
import Search from '@widgets/Search/Search';
import ReactDOM from 'react-dom';

// window.addEventListener(
//     "keydown",
//     function (event) {
//         switch (event.key) {
//             case "ArrowUp":
//             case "ArrowDown":
//             case "ArrowLeft":
//             case "ArrowRight":
//             // Focus adding video input
//             case "/":
//             // Player mode
//             case "i":
//             case "f":
//             case "t":
//             // Mute
//             case "m":
//             // Play functional
//             case "k":
//             case "Spacebar":
//             case " ":
//             // Subtitles
//             case "c":
//                 // Comment
//                 null;
//                 break;
//             default:
//                 event.stopImmediatePropagation();
//         }
//     },
//     true,
// );

waitForElement('.html5-video-player').then(elem => {
    waitForElement('video.video-stream.html5-main-video').then(p => {
        const player = p as HTMLVideoElement;
        const PlayerInstance = Player.getInstance();
        PlayerInstance.player = player;

        const oe = new ObserveElementClasslist(elem as HTMLVideoElement);

        const m = Mode.getInstance();

        const ad = Ad.getInstance();
        const l = new Load(player);

        oe.addObserver(ad);
        oe.addObserver(m);

        class gg {
            modeUpdate(data: Modes) {
                log('Mode', data);
            }
        }
        const zz = new gg();
        m.addObserver(zz);

        const lm = LoadManager.getInstance();

        ad.addObserver(lm);
        l.addObserver(lm);

        class y {
            update(data: boolean) {
                log('Loading', data);
            }
        }

        const yn = new y();

        lm.addObserver(yn);
        log(m.mode);

        const gh = new SendPlayerStateManager(PlayerInstance);
        const gz = new Mute(player);

        class tt {
            update(data: boolean) {
                log('Mute', data);
            }
        }

        const jj = new tt();

        gz.addObserver(jj);
        gz.initNotifyObservers();
    });
});

//Remove autoplay button from player
waitForElement('.ytp-autonav-toggle-button-container').then(elem => {
    elem!.parentElement!.remove();
});

// Remove next button from player
waitForElement('.ytp-next-button.ytp-button')
    .then(elem => {
        elem!.remove();
    })
    .catch(error => log('Failed to remove next button', error));

// Because clip button must be removed
waitForElement('#flexible-item-buttons')
    .then(elem => {
        elem?.remove();
    })
    .catch(error => log('Failed to remove clip button', error));

// Remove clip button
waitForElement('yt-button-shape#button-shape')
    .then(elem => {
        elem?.remove();
    })
    .catch(error => log('Failed to shape button', error));

// Render main panel
waitForElement('#secondary-inner')
    .then(elem => {
        Object.assign(elem!.style, {transform: 'scale(0)', zIndex: '-1'});
        const container = document.createElement('div');
        elem?.parentElement?.prepend(container);
        ReactDOM.render(
            <AdminProvider>
                <Panel />
            </AdminProvider>,
            container,
        );
    })
    .catch(error => log('Failed to render main panel', error));

// Render search
waitForElement('#center')
    .then(elem =>
        ReactDOM.render(
            <AdminProvider>
                <Search />
            </AdminProvider>,
            elem,
        ),
    )
    .catch(error => log('Failed to render input', error));

// Remove voice search button
waitForElement('#voice-search-button')
    .then(elem => elem?.remove())
    .catch(error => log('Failed to remove voice search button', error));
