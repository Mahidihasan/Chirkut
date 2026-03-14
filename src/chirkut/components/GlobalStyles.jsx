import { C } from "../constants";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Caveat:wght@500;700&family=Kalam:wght@400;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body {
        background:
          radial-gradient(circle at 20% 8%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 45%),
          radial-gradient(circle at 80% 0%, rgba(232,221,205,0.4) 0%, rgba(232,221,205,0) 42%),
          ${C.bg};
        font-family: "IBM Plex Sans", system-ui, sans-serif;
        color: ${C.accent};
        overflow-x: hidden;
      }
      :root {
        --paper-texture:
          repeating-linear-gradient(35deg, rgba(90,70,50,0.03) 0 1px, rgba(0,0,0,0) 1px 4px),
          repeating-linear-gradient(0deg, rgba(120,96,70,0.02) 0 1px, rgba(0,0,0,0) 1px 3px),
          radial-gradient(circle at 20% 18%, rgba(120,90,60,0.05) 0 2px, rgba(0,0,0,0) 3px),
          radial-gradient(circle at 72% 68%, rgba(120,90,60,0.04) 0 1px, rgba(0,0,0,0) 3px);
        --paper-lighting:
          radial-gradient(circle at 50% 12%, rgba(255,248,234,0.26) 0%, rgba(255,248,234,0) 60%),
          radial-gradient(circle at 50% 86%, rgba(93,63,37,0.1) 0%, rgba(93,63,37,0) 58%);
      }
      .home-lock { height: 100dvh; overflow: hidden; }

      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes drift { 0%{transform:translateX(0) translateY(0) rotate(0deg);opacity:0} 100%{transform:translateX(var(--dx,30px)) translateY(-120vh) rotate(var(--r,15deg));opacity:0} }
      @keyframes sway { 0%,100%{transform:rotate(-1deg)} 50%{transform:rotate(1deg)} }
      @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes reveal { from{opacity:0;transform:translateY(16px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      @keyframes notifyPulse { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.16);opacity:.75} 100%{transform:scale(1);opacity:1} }
      @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-1%,-1%)} 30%{transform:translate(1%,2%)} 50%{transform:translate(-1%,1%)} }
      @keyframes stain { from{opacity:0;transform:scale(.7)} to{opacity:.18;transform:scale(1)} }
      @keyframes flapLift {
        0% { transform: perspective(720px) rotateX(0deg); }
        100% { transform: perspective(720px) rotateX(-164deg); }
      }
      @keyframes letterRise {
        0% { transform: translate(-50%, 30px) scale(0.94); opacity: 0; }
        100% { transform: translate(-50%, -30px) scale(1); opacity: 1; }
      }
      @keyframes letterReveal {
        0% { transform: translateY(18px) scale(0.97); opacity: 0; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes envFlapOpen {
        0% { transform: translateY(0) scaleY(1); opacity: 1; }
        65% { transform: translateY(-40px) scaleY(0.5); opacity: 0.92; }
        100% { transform: translateY(-74px) scaleY(0.08); opacity: 0; }
      }
      @keyframes envLetterPull {
        0% { transform: translate(-50%, 54px) scale(0.9); opacity: 0.1; }
        55% { transform: translate(-50%, -12px) scale(0.98); opacity: 0.95; }
        100% { transform: translate(-50%, -42px) scale(1); opacity: 1; }
      }
      @keyframes boyBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1.8px)} }
      @keyframes armWave { 0%,100%{transform:rotate(-7deg)} 50%{transform:rotate(7deg)} }
      @keyframes eyeBlink { 0%,45%,100%{opacity:1} 47%,49%{opacity:0.2} }
      @keyframes catBreath { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(.6px) scaleY(1.02)} }
      @keyframes tailSwish { 0%,100%{transform:rotate(6deg)} 50%{transform:rotate(-10deg)} }
      @keyframes earTwitch { 0%,88%,100%{transform:rotate(0deg)} 91%{transform:rotate(-6deg)} 94%{transform:rotate(3deg)} }
      @keyframes whiskerTwitch { 0%,92%,100%{transform:translateX(0)} 94%{transform:translateX(0.7px)} }
      @keyframes wordFadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }

      .paper-btn {
        background:${C.primary}; color:${C.paper}; border:none; padding:11px 22px;
        font-family:"IBM Plex Sans",system-ui,sans-serif; font-size:15px; font-weight:600;
        border-radius:7px; cursor:pointer; transition:all .2s; letter-spacing:.2px;
      }
      .paper-btn:hover { background:${C.accent}; transform:translateY(-1px); }
      .ghost-btn {
        background:transparent; border:1.5px solid ${C.primary}; color:${C.primary};
        padding:10px 20px; font-family:"IBM Plex Sans",system-ui,sans-serif; font-size:14px;
        font-weight:600; border-radius:7px; cursor:pointer; transition:all .2s;
      }
      .ghost-btn:hover { background:${C.primary}; color:${C.paper}; }

      .modal-share-btn,
      .modal-close-btn {
        border: none;
        border-radius: 12px;
        padding: 12px 20px;
        font-family: "IBM Plex Sans", system-ui, sans-serif;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.01em;
        cursor: pointer;
        transition: transform .18s ease, box-shadow .22s ease, background .22s ease, color .22s ease, border-color .22s ease;
      }

      .modal-share-btn {
        color: #fffaf3;
        background: linear-gradient(135deg, #8a5a3a 0%, #6f442c 100%);
        box-shadow: 0 8px 18px rgba(67,38,22,0.34), inset 0 1px 0 rgba(255,255,255,0.18);
      }

      .modal-share-btn:hover {
        transform: translateY(-1px);
        background: linear-gradient(135deg, #986341 0%, #7e4c31 100%);
        box-shadow: 0 12px 22px rgba(67,38,22,0.4), inset 0 1px 0 rgba(255,255,255,0.22);
      }

      .modal-close-btn {
        color: #5e432f;
        background: rgba(255,251,246,0.9);
        border: 1px solid rgba(165,126,93,0.72);
        box-shadow: 0 6px 14px rgba(71,43,25,0.16), inset 0 1px 0 rgba(255,255,255,0.72);
        backdrop-filter: blur(2px);
      }

      .modal-close-btn:hover {
        transform: translateY(-1px);
        background: #fffaf3;
        border-color: rgba(144,106,75,0.9);
        box-shadow: 0 10px 18px rgba(71,43,25,0.22), inset 0 1px 0 rgba(255,255,255,0.84);
      }

      .modal-share-btn:focus-visible,
      .modal-close-btn:focus-visible {
        outline: 3px solid rgba(199,149,104,0.45);
        outline-offset: 2px;
      }

      .input-field {
        width:100%; background:${C.paper}; border:1.5px solid ${C.kraft}; border-radius:6px;
        padding:12px 14px; font-family:"IBM Plex Sans",system-ui,sans-serif; font-size:14px;
        color:${C.accent}; outline:none; transition:border-color .2s; resize:none;
      }
      .input-field:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(107,79,59,0.12); }

      .scroll-row {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scroll-row::-webkit-scrollbar { display: none; }

      .envelope-card { cursor:pointer; transition:transform .22s ease, filter .22s ease; }
      .envelope-card:hover { transform:translateY(-5px); filter: drop-shadow(0 8px 14px rgba(107,79,59,0.14)); }
      .chip-scroll-hidden::-webkit-scrollbar { display: none; }

      .env-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.4rem 1rem 1.2rem;
      }

      .env-scene {
        position: relative;
        width: min(320px, 82vw);
        height: calc(min(320px, 82vw) * 0.625);
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .env-letter {
        --rule-gap: 24px;
        --left-guide: 28px;
        position: absolute;
        width: 88%;
        left: 6%;
        top: 10%;
        height: 90%;
        background: var(--lt-bg, #FFFDF8);
        border: 1px solid var(--lt-border, rgba(198,159,122,0.3));
        border-radius: 5px 5px 4px 4px;
        padding: 14px 24px 14px 36px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.13);
        z-index: 2;
        transform: translateY(0);
        transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        overflow: hidden;
      }

      .env-letter::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          180deg, transparent, transparent var(--rule-gap),
          var(--lt-rule, rgba(160,130,100,0.1)) var(--rule-gap), var(--lt-rule, rgba(160,130,100,0.1)) calc(var(--rule-gap) + 1px)
        ), var(--lt-texture, none);
        pointer-events: none;
      }

      .env-letter::after {
        content: '';
        position: absolute;
        left: var(--left-guide);
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--lt-guide, rgba(210,100,100,0.2));
        pointer-events: none;
      }

      .letter-content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.4s ease 0.5s, transform 0.4s ease 0.5s;
      }

      .letter-content p {
        margin: 0;
        font-size: 14px;
        line-height: var(--rule-gap);
        color: var(--lt-ink, #4A3728);
        font-family: var(--lt-font, 'Kalam', 'Caveat', cursive);
      }

      .letter-content .greeting {
        font-size: clamp(13px, 3.8vw, 16px);
        font-style: italic;
        margin-bottom: 12px;
        color: var(--lt-sign, #7a5840);
      }

      .letter-content .body {
        margin: 0;
        font-size: clamp(14px, 3.3vw, 17px);
        line-height: var(--rule-gap);
        overflow-wrap: normal;
        word-break: normal;
        hyphens: none;
        display: -webkit-box;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: calc(var(--rule-gap) * 7);
      }

      .letter-content .sign {
        margin-top: auto;
        padding-top: 10px;
        text-align: right;
        font-style: italic;
        color: var(--lt-sign, #7a5840);
        font-size: 12px;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      .env-base {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, #d7b78f 0%, #c7a077 100%),
          var(--paper-texture);
        border-radius: 11px;
        border: 1px solid rgba(162,120,83,0.5);
        box-shadow: 0 8px 22px rgba(50,32,18,0.16), 0 2px 6px rgba(0,0,0,0.06);
        overflow: hidden;
        z-index: 3;
      }

      .env-base::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--paper-lighting);
        pointer-events: none;
      }

      .env-address {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .env-joint {
        position: absolute;
        bottom: 0;
        height: 1px;
        transform-origin: 0 0;
        pointer-events: none;
        z-index: 4;
        opacity: 0.62;
      }

      .env-joint::before,
      .env-joint::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 1px;
        border-radius: 999px;
      }

      .env-joint::before {
        width: 100%;
        background: rgba(127,90,60,0.3);
      }

      .env-joint::after {
        width: 100%;
        transform: translateY(-0.6px);
        background: rgba(255,246,232,0.24);
      }

      .env-joint-left {
        left: 0;
        width: 58%;
        transform: rotate(-35deg);
      }

      .env-joint-right {
        right: 0;
        width: 58%;
        transform: rotate(35deg);
        transform-origin: 100% 0;
      }

      .env-flap {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 58%;
        background:
          linear-gradient(180deg,#c99764 0%,#b68455 100%),
          var(--paper-texture);
        clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
        transform-origin: top center;
        transform: rotateX(0deg);
        z-index: 5;
        backface-visibility: hidden;
        border-radius: 11px 11px 0 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .env-flap::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: rgba(255,255,255,0.25);
      }

      .env-wax {
        position: absolute;
        left: 50%;
        top: 44%;
        width: 26px;
        height: 24px;
        transform: translate(-50%, -50%) rotate(-6deg);
        border-radius: 55% 47% 54% 46% / 46% 55% 45% 54%;
        background:
          radial-gradient(circle at 34% 24%, rgba(255,205,170,0.58) 0%, rgba(255,205,170,0.2) 24%, rgba(0,0,0,0) 27%),
          radial-gradient(circle at 56% 58%, #a92419 0%, #8d1f14 52%, #6f160f 100%);
        box-shadow:
          0 2px 5px rgba(64,27,16,0.35),
          0 5px 8px rgba(78,35,22,0.34),
          inset 0 -3px 4px rgba(49,15,9,0.28),
          inset 0 1px 2px rgba(255,191,155,0.24);
        z-index: 6;
        pointer-events: none;
        transition: opacity 0.22s ease;
        display: grid;
        place-items: center;
      }

      .env-wax::before {
        content: '';
        width: 72%;
        height: 72%;
        border-radius: 50%;
        border: 1px solid rgba(118,18,12,0.34);
        box-shadow: inset 0 1px 1px rgba(255,208,181,0.2);
      }

      .env-wax::after {
        content: none;
      }

      .env-wax-icon {
        width: 9px;
        height: 9px;
        position: relative;
        z-index: 1;
      }

      .env-scene.open .env-flap {
        transform: rotateX(-180deg);
        z-index: 1;
      }

      .env-scene.open .env-base {
        overflow: visible;
      }

      .env-scene.open .env-letter {
        transform: translateY(-52%);
        z-index: 4;
      }

      .env-scene.open .letter-content {
        opacity: 1;
        transform: translateY(0);
      }

      .env-scene.open .env-wax,
      .env-scene:not(.unread) .env-wax {
        opacity: 0;
      }

      .env-scene.open .env-joint {
        opacity: 0;
      }

      .env-scene:not(.open):hover .env-flap {
        transform: rotateX(-14deg);
        transition: transform 0.3s ease;
      }

      .env-label {
        margin-top: 20px;
        font-size: 13px;
        color: #7a5840;
        opacity: 0.8;
        text-align: center;
      }

    `}</style>
  );
}
