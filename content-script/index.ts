import './app/styles/global.css';
import './tabs/All/All.tsx';

chrome.runtime.sendMessage({action: 'isPrimaryTab'}, responce => {
    if (responce.isPrimary) {
        import('./tabs/Player/Player.tsx');
    }
});
