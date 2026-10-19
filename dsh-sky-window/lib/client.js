window.__ModuleLoader__.load({
  id: 'dsh-sky-window',
  factory(require) {
    'use strict';
    const React = require('react');
    const h = React.createElement;
    const UI_CSS = "/* Native selectors below are checked against the 0.1.1-rc.2 and 0.2.1-rc.2 web layouts; token APIs own colors. */\n.sw-ui .sw-look-copy{bottom:20%;pointer-events:none}\n.sw-ui .sw-look-copy h2{font-size:clamp(20px,2vw,27px);font-weight:350;letter-spacing:.08em;line-height:1.8;margin:0;animation:sw-quiet-phrase 12s ease both}\n@keyframes sw-quiet-phrase{0%{opacity:0;transform:translateY(4px)}20%,65%{opacity:.8;transform:translateY(0)}100%{opacity:.42;transform:translateY(0)}}\n.sw-ui .sw-look-actions{position:absolute;left:30px;right:30px;bottom:25px;justify-content:space-between;align-items:center;gap:20px}\n.sw-ui .sw-sky-action{display:inline-flex;align-items:center;justify-content:center;min-width:0;background:transparent;border:0;border-radius:8px;box-shadow:none;color:var(--sw-look-ink);padding:9px 6px;font-size:12px;font-weight:400;opacity:.72}\n.sw-ui .sw-look-actions button{min-width:0;padding:9px 6px;font-size:12px}\n.sw-ui .sw-sky-action:hover,.sw-ui .sw-sky-action:focus-visible{opacity:1}\n.sw-ui .sw-day-play{width:38px;height:38px}\n.sw-ui .sw-settings-icon{width:38px;height:38px;padding:9px;opacity:.52}\n.sw-ui .sw-settings-icon:hover,.sw-ui .sw-settings-icon:focus-visible{background:#ffffff24;backdrop-filter:blur(8px)}\n.sw-ui .sw-return-now,.sw-settings .sw-return-now{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);border:1px solid var(--dsw-alias-brand-primary);border-radius:12px;padding:11px 18px;font-size:13px;font-weight:600;line-height:1.4;box-shadow:0 3px 12px #153b411f;white-space:nowrap;opacity:1}\n.sw-return-now:before{content:'↺';margin-right:6px}\n.sw-ui .sw-preview{padding:6px 6px 6px 14px}\n.sw-ui .sw-preview .sw-return-now{padding:10px 14px}\n.sw-ui .sw-dock .sw-pill,.sw-ui .sw-preview{color:var(--sw-look-ink);background:var(--sw-glass-fill);border-color:var(--sw-glass-border);box-shadow:0 5px 18px var(--sw-glass-shadow);backdrop-filter:saturate(.82) blur(18px)}\n.sw-ui .sw-dock .sw-muted{color:var(--sw-look-ink);opacity:.7}.sw-ui .sw-dock-divider{background:var(--sw-glass-border)}\n.sw-ui .sw-preview button{color:var(--sw-look-ink)}\n.sw-ui .sw-preview .sw-return-now{color:var(--sw-look-ink);background:var(--sw-glass-accent);border:1px solid var(--sw-glass-border);border-radius:15px;box-shadow:none}\n.sw-ui button:disabled,.sw-settings button:disabled{cursor:default;opacity:.6}\n@media(max-width:700px){.sw-ui .sw-look-actions{left:22px;right:22px;bottom:20px}.sw-ui .sw-preview.sw-over-look{top:96px}}\n@media(max-height:420px){.sw-ui .sw-look-copy{bottom:16%}.sw-ui .sw-look-actions{bottom:10px}}\n@media(prefers-reduced-motion:reduce){.sw-ui .sw-look-copy h2{animation:none;opacity:.8}}\nbody[data-sky-window=\"on\"]{isolation:isolate}\nbody[data-sky-window=\"on\"] .pI_x6G_frame,body[data-sky-window=\"on\"] .wSkVaW_root{background:transparent}\nbody[data-sky-window=\"on\"] [data-composer-seat]{background:transparent}\n.sw-ui{font:13px/1.65 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;color:var(--dsw-alias-label-primary);pointer-events:none!important}\n/* DSH shows composerHero only on its new-session landing page. Keep chat statistics unobscured. */\nbody:not(:has([class*=\"_composerHero\"])) .sw-ui .sw-dock,\nbody:not(:has([class*=\"_composerHero\"])) .sw-ui .sw-popover:not(.sw-over-look){display:none}\n/* Soften scenery behind long chats while keeping the sky visible at the sides. */\nbody[data-sky-window=\"on\"]:not(:has([class*=\"_composerHero\"])) [class*=\"_scroll\"]:has(> [class*=\"_column\"] [class*=\"_flowItem\"]){\n  background:linear-gradient(90deg,transparent 0%,color-mix(in srgb,var(--dsw-alias-bg-base) 72%,transparent) 15%,color-mix(in srgb,var(--dsw-alias-bg-base) 72%,transparent) 85%,transparent 100%)\n}\n.sw-ui *,.sw-settings *{box-sizing:border-box}.sw-ui button,.sw-settings button,.sw-ui input,.sw-ui select,.sw-settings input,.sw-settings select{font:inherit}.sw-ui button,.sw-settings button{cursor:pointer;color:inherit}.sw-ui button:focus-visible,.sw-settings button:focus-visible,.sw-ui input:focus-visible,.sw-ui select:focus-visible,.sw-settings input:focus-visible,.sw-settings select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:3px}.sw-ui [hidden],.sw-settings [hidden]{display:none!important}\n.sw-dock{position:fixed;right:22px;bottom:18px;display:flex;align-items:center;gap:7px;pointer-events:auto;z-index:25}.sw-pill,.sw-button{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);border-radius:24px;padding:8px 13px;box-shadow:0 3px 14px #142b3d0b;backdrop-filter:blur(18px);font-size:11px;display:inline-flex;align-items:center;justify-content:center;gap:7px}.sw-pill .sw-sun-dot{background:#dfb572;box-shadow:0 0 9px #e3b57066;width:7px;height:7px;border-radius:100%}.sw-muted{color:var(--dsw-alias-label-secondary)}.sw-dock-divider{width:1px;height:12px;background:var(--dsw-alias-border-l2);margin:0 3px}.sw-dock-time{font-variant-numeric:tabular-nums}.sw-icon{min-width:31px;padding:7px 9px}.sw-button:hover,.sw-pill:hover{filter:brightness(.97)}\n.sw-popover{position:fixed;right:18px;bottom:67px;width:370px;max-width:calc(100vw - 36px);max-height:calc(100dvh - 100px);overflow:auto;pointer-events:auto;z-index:35;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:20px;box-shadow:0 20px 90px #1026372b;padding:23px}.sw-popover-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}.sw-popover-head h2{font-size:20px;line-height:1.4;font-weight:500;margin:0}.sw-close{border:0;background:transparent;font-size:22px;line-height:1;padding:5px 8px;border-radius:8px}.sw-settings{font:13px/1.65 \"Segoe UI\",\"Microsoft YaHei\",sans-serif;color:var(--dsw-alias-label-primary);max-width:620px}.sw-settings h2{font-size:20px;font-weight:550;margin:0 0 9px}.sw-description{font-size:12px;color:var(--dsw-alias-label-secondary);margin:0 0 18px;line-height:1.8}.sw-section{padding:18px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}.sw-section:last-child{border-bottom:0;padding-bottom:0}.sw-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.sw-row label,.sw-label{display:block;font-size:12px;font-weight:550}.sw-help{font-size:10px;line-height:1.7;color:var(--dsw-alias-label-secondary);margin:8px 0 0}.sw-time{font-size:21px;font-variant-numeric:tabular-nums;letter-spacing:-.5px}.sw-checkbox{accent-color:var(--dsw-alias-brand-primary);width:17px;height:17px;cursor:pointer}.sw-control-row{display:flex;gap:7px;margin-top:11px}.sw-settings select,.sw-settings input[type=date]{min-width:0;color:inherit;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 10px;font-size:12px}.sw-settings select{flex:1}.sw-settings input[type=range]{width:100%;accent-color:var(--dsw-alias-brand-primary);cursor:pointer;margin:18px 0 5px}.sw-range-labels{display:flex;justify-content:space-between;font-size:9px;color:var(--dsw-alias-label-secondary)}.sw-small{font-size:11px;padding:7px 10px;border-radius:8px;white-space:nowrap;box-shadow:none}.sw-presets{display:flex;gap:6px;margin-top:13px}.sw-presets button{flex:1;min-width:0}.sw-times{display:flex;justify-content:space-between;gap:18px;margin-top:18px}.sw-times>div{font-size:10px;color:var(--dsw-alias-label-secondary)}.sw-times strong{display:block;font-size:17px;font-weight:500;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;margin:3px 0}.sw-live{width:100%;margin-top:13px}.sw-note{margin:17px 0 0;font-size:10px;line-height:1.8;color:var(--dsw-alias-label-secondary)}.sw-alert{font-size:11px;padding:8px 10px;background:var(--dsw-alias-bg-layer-2);border-radius:9px;margin:12px 0 0;line-height:1.7}.sw-preview{position:fixed;top:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:11px;pointer-events:auto;z-index:40;font-size:10px;padding:7px 11px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:30px;box-shadow:0 3px 14px #1026370b}.sw-preview button{background:transparent;border:0;font-size:10px;padding:0;color:var(--dsw-alias-label-secondary);white-space:nowrap}\n.sw-immersive{position:fixed;inset:0;z-index:45;pointer-events:auto;overflow:hidden;outline:none;background:var(--sw-look-background,#d3e5e4)}.sw-immersive-scene{position:absolute;inset:0}.sw-look-copy{position:absolute;left:20px;right:20px;bottom:11%;text-align:center;color:var(--sw-look-ink,#263f49)}.sw-look-kicker{font-size:10px;letter-spacing:.14em;opacity:.75}.sw-look-copy h2{font-size:clamp(25px,3.5vw,39px);font-weight:400;letter-spacing:-1px;margin:17px 0 12px;line-height:1.45}.sw-look-copy p{font-size:12px;margin:0 0 24px;opacity:.8}.sw-look-actions{display:flex;justify-content:center;gap:9px}.sw-look-actions button{min-width:125px;padding:10px 19px}.sw-look-settings{position:absolute;right:23px;top:22px;z-index:1;pointer-events:auto}.sw-popover.sw-over-look{z-index:55}.sw-preview.sw-over-look{z-index:56}.sw-status{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:12px;line-height:1.7}.sw-look-small{opacity:.8;font-size:11px;margin-top:17px}\n@media(max-width:700px){.sw-dock{right:12px;bottom:10px;gap:5px}.sw-pill{font-size:10px;padding:7px 10px}.sw-dock-city{display:none}.sw-popover{right:12px;bottom:55px;max-width:calc(100vw - 24px);padding:20px}.sw-preview{top:8px;font-size:9px;max-width:calc(100vw - 20px);gap:8px}.sw-look-copy{bottom:15%}.sw-look-copy h2{font-size:29px}.sw-look-copy p{font-size:11px}.sw-look-settings{top:14px;right:15px}}@media(max-height:560px){.sw-look-copy{bottom:5%}.sw-look-copy h2{font-size:24px;margin:9px 0}.sw-look-copy p{margin-bottom:12px}.sw-look-kicker{display:none}.sw-look-actions button{padding:7px 15px}.sw-look-small{margin-top:9px}.sw-popover{max-height:calc(100dvh - 80px)}}\n";
    const SCENE_HTML = "<div class=\"scene\" aria-hidden=\"true\">\n  <div class=\"sky-gradient\"></div><div class=\"horizon-glow\"></div><div class=\"stars\"></div>\n  <svg class=\"landscape far\" viewBox=\"0 0 1440 420\" preserveAspectRatio=\"none\"><path d=\"M0 170C100 120 200 163 310 125S475 105 590 160 770 100 915 144 1130 95 1255 120 1380 156 1440 130V420H0Z\"/></svg>\n  <svg class=\"landscape mid\" viewBox=\"0 0 1440 420\" preserveAspectRatio=\"none\"><path d=\"M0 192C135 152 205 183 345 214S510 134 670 178 858 235 1020 182 1240 170 1440 210V420H0Z\"/></svg>\n  <svg class=\"landscape near\" viewBox=\"0 0 1440 420\" preserveAspectRatio=\"none\"><path d=\"M0 277C155 205 330 287 485 285S742 223 919 285 1220 245 1440 254V420H0Z\"/></svg>\n  <div class=\"stage\"><svg class=\"orbit\" viewBox=\"0 0 1000 400\">\n    <defs>\n      <radialGradient id=\"skyHalo\"><stop stop-color=\"#fff4b7\" stop-opacity=\".7\"/><stop offset=\".4\" stop-color=\"#ffdb9c\" stop-opacity=\".2\"/><stop offset=\"1\" stop-color=\"#ffdb9c\" stop-opacity=\"0\"/></radialGradient>\n      <radialGradient id=\"skySun\"><stop stop-color=\"#fff4c8\"/><stop offset=\"1\" stop-color=\"#ffd47e\"/></radialGradient>\n      <clipPath id=\"skyHorizon\"><rect width=\"1000\" height=\"315\"/></clipPath>\n      <mask id=\"skyMoon\"><rect width=\"90\" height=\"90\" fill=\"white\"/><circle cx=\"57\" cy=\"27\" r=\"24\" fill=\"black\"/></mask>\n    </defs>\n    <g class=\"orbit-details\"><path class=\"track\" d=\"M150 315A350 252 0 0 1 850 315\"/><path class=\"progress\" d=\"M150 315A350 252 0 0 1 850 315\" pathLength=\"1\"/><path class=\"horizon\" d=\"M105 315H895\"/><circle class=\"endpoint\" cx=\"150\" cy=\"315\" r=\"3\"/><circle class=\"endpoint\" cx=\"850\" cy=\"315\" r=\"3\"/>\n      <text x=\"150\" y=\"345\" text-anchor=\"middle\" class=\"rise time\"></text><text x=\"150\" y=\"365\" text-anchor=\"middle\" class=\"caption\">日出</text>\n      <text x=\"850\" y=\"345\" text-anchor=\"middle\" class=\"set time\"></text><text x=\"850\" y=\"365\" text-anchor=\"middle\" class=\"caption\">日落</text>\n      <text x=\"500\" y=\"342\" text-anchor=\"middle\" class=\"center-caption caption\">半圆 · 日出到日落</text>\n    </g>\n    <g clip-path=\"url(#skyHorizon)\"><g class=\"sun\"><circle r=\"76\" fill=\"url(#skyHalo)\"/><g class=\"rays\"><path d=\"M0-34v-6M0 34v6M-34 0h-6M34 0h6M-24-24l-4-4M24 24l4 4M-24 24l-4 4M24-24l4-4\"/></g><circle class=\"sun-body\" r=\"21\" fill=\"url(#skySun)\"/><ellipse cx=\"-6\" cy=\"-7\" rx=\"10\" ry=\"6\" fill=\"#fff9de\" opacity=\".35\"/></g></g>\n    <g class=\"moon\" transform=\"translate(746 55)\"><circle cx=\"45\" cy=\"45\" r=\"37\" fill=\"#d7e2fd\" opacity=\".045\"/><g mask=\"url(#skyMoon)\"><circle cx=\"40\" cy=\"40\" r=\"23\" fill=\"#f3edcf\"/><circle cx=\"32\" cy=\"45\" r=\"4\" fill=\"#d7d1b4\" opacity=\".38\"/><circle cx=\"40\" cy=\"54\" r=\"2\" fill=\"#d7d1b4\" opacity=\".3\"/></g></g>\n    <g class=\"cloud a\"><path class=\"cloud-shadow\" d=\"M124 173c-18 0-26-8-24-18 2-10 12-14 24-12 2-20 17-30 33-22 7-19 31-19 40-3 17-4 30 7 30 20 22-3 35 6 34 17-1 14-18 18-35 18Z\"/><path class=\"cloud-top\" d=\"M111 151c2-7 8-10 20-8 2-21 17-25 29-16 9-18 28-17 36-2 17-6 30 5 29 16 18-1 25 4 26 10Z\"/></g>\n    <g class=\"cloud b\"><path class=\"cloud-shadow\" d=\"M625 209c-26 0-35-12-29-25 4-8 14-12 26-11 6-23 24-31 41-17 12-15 35-13 42 6 25-2 42 12 37 24 22-3 36 3 36 12 0 10-16 11-34 11Z\"/><path class=\"cloud-top\" d=\"M606 184c4-6 13-7 24-6 3-20 18-29 34-15 11-12 29-10 35 7 22-3 32 4 32 14Z\"/></g>\n    <g class=\"cloud c\"><path class=\"cloud-shadow\" d=\"M370 278c-22 0-31-7-30-16 1-12 16-17 29-14 8-20 31-24 44-9 20-3 34 5 35 17 23-2 36 6 34 13-2 9-17 9-34 9Z\"/><path class=\"cloud-top\" d=\"M351 258c3-7 11-9 22-7 6-15 25-18 36-6 17-2 28 4 29 12Z\"/></g>\n    <g class=\"whale-flight\" aria-hidden=\"true\"><g class=\"whale-bob\">\n      <g class=\"whale-shape\" transform=\"translate(615 175) scale(1.4)\"><path class=\"sky-whale\" d=\"M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z\" fill-rule=\"nonzero\"/></g>\n    </g></g>\n  </svg></div>\n  <div class=\"veil\"></div>\n</div>\n";
    const SCENE_CSS = ":host{display:block;position:absolute;inset:0;pointer-events:none;--sky-top:#9bc6d9;--sky-mid:#d3e5e4;--sky-low:#eee7ca;--cloud:#dcebe5;--cloud-top:#fffdf0;--hill-far:#a5beb7;--hill-mid:#8aafa2;--hill-near:#78a393;--scene-ink:#48616a;--intensity:.75;--nightness:0;--stars:0;--moon-visibility:0;--sun-visibility:1;--warmth:.3;--light-x:50%;font:13px \"Segoe UI\",\"Microsoft YaHei\",sans-serif}\n*{box-sizing:border-box}.scene{position:absolute;inset:0;overflow:hidden;background:var(--sky-mid)}.sky-gradient{position:absolute;inset:0;background:linear-gradient(180deg,var(--sky-top),var(--sky-mid) 53%,var(--sky-low) 91%);opacity:var(--intensity)}.horizon-glow{position:absolute;inset:0;opacity:var(--warmth);background:radial-gradient(ellipse at var(--light-x) 54%,#ffd5a0,transparent 62%);mix-blend-mode:screen}.landscape{position:absolute;bottom:0;width:100%;height:43%;opacity:calc(var(--intensity)*.6);pointer-events:none}.far{fill:var(--hill-far);height:50%;opacity:calc(var(--intensity)*.44)}.mid{fill:var(--hill-mid);height:44%;opacity:calc(var(--intensity)*.48)}.near{fill:var(--hill-near);height:38%;opacity:calc(var(--intensity)*.4)}.stars{position:absolute;inset:0 0 35%;opacity:var(--stars);transition:opacity 1s}.star{position:absolute;background:#f3f5ff;border-radius:100%;box-shadow:0 0 5px #edf3ff35;opacity:var(--star-opacity)}.star:nth-child(7n){animation:twinkle 9s ease-in-out infinite alternate;animation-delay:var(--delay)}@keyframes twinkle{to{opacity:.18}}\n.stage{position:absolute;top:46px;left:var(--sw-sidebar,240px);right:0;margin:auto;width:min(calc(100% - var(--sw-sidebar,240px)),1100px);opacity:.93}.orbit{display:block;width:100%;height:auto;overflow:visible}.orbit-details{opacity:.24}.track,.progress{fill:none;stroke:var(--scene-ink);stroke-width:1;stroke-dasharray:3 7;opacity:.35}.progress{stroke-width:1.5;stroke-dasharray:0 1}.horizon{fill:none;stroke:var(--scene-ink);stroke-width:.6;opacity:.35}.endpoint{fill:var(--scene-ink);opacity:.4}.time{fill:var(--scene-ink);font-size:12px;font-family:inherit;font-weight:500;font-variant-numeric:tabular-nums}.caption{fill:var(--scene-ink);font-size:10px;font-family:inherit}.center-caption{opacity:0}.sun{opacity:var(--sun-visibility);transition:transform 15s linear,opacity 1s}.sun-body{filter:drop-shadow(0 3px 8px #cda56c26)}.rays{stroke:#ffe6ad;stroke-width:2.8;stroke-linecap:round;opacity:.7}.moon{opacity:var(--moon-visibility);transition:opacity 1s;filter:drop-shadow(0 0 12px #f6edb91a)}.cloud{opacity:calc(.65 - var(--nightness)*.35);animation:cloud-a 100s ease-in-out infinite alternate;will-change:transform}.a{animation-delay:-22s}.b{animation-name:cloud-b;animation-duration:130s;animation-delay:-45s}.c{animation-name:cloud-c;animation-duration:115s;animation-delay:-30s;opacity:calc(.45 - var(--nightness)*.2)}.cloud-shadow{fill:var(--cloud)}.cloud-top{fill:var(--cloud-top);opacity:.6}@keyframes cloud-a{from{transform:translateX(-30px)}to{transform:translateX(240px)}}@keyframes cloud-b{from{transform:translateX(35px)}to{transform:translateX(-220px)}}@keyframes cloud-c{from{transform:translateX(-80px)}to{transform:translateX(150px)}}.veil{position:absolute;inset:0;pointer-events:none;background:var(--reading-veil,transparent);opacity:.11}\n:host([data-expanded]) .stage{top:7%;left:0;width:min(100%,1120px,calc(200dvh - 440px))}:host([data-expanded]) .orbit-details{opacity:.88}:host([data-expanded]) .center-caption{opacity:.7}:host([data-expanded]) .veil{opacity:0}:host([data-preview]) .sun{transition:transform .14s linear,opacity .2s}:host([data-playing]) .sun{transition:transform .09s linear,opacity .1s}:host([data-paused]) .star,:host([data-paused]) .cloud{animation-play-state:paused}:host([data-polar]) .track,:host([data-polar]) .progress,:host([data-polar]) .endpoint,:host([data-polar]) .time,:host([data-polar]) .caption:not(.center-caption){display:none}\n@media(max-width:720px){.stage{left:0;width:110%;top:80px}:host([data-expanded]) .stage{width:115%;top:14%}}@media(max-height:560px){:host([data-expanded]) .stage{top:2%;width:min(100%,580px)}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}\n\n/* A small cloud-shaped easter egg shares the sky's coordinates and colors. */\n.whale-flight{pointer-events:none;opacity:calc(.28 - var(--nightness)*.14);animation:whale-drift 110s ease-in-out infinite alternate;animation-delay:-32s;will-change:transform}\n.whale-bob{animation:whale-float 46s ease-in-out infinite;animation-delay:-7s;will-change:transform}\n.sky-whale{fill:var(--cloud-top);stroke:none;pointer-events:none}\n@keyframes whale-drift{from{transform:translateX(-90px)}to{transform:translateX(90px)}}\n@keyframes whale-float{0%,100%{transform:translateY(-4px)}50%{transform:translateY(4px)}}\n:host([data-paused]) .whale-flight,:host([data-paused]) .whale-bob{animation-play-state:paused}\n@media(max-width:720px){.whale-shape{transform:translate(600px,160px) scale(2)}}\n@media(prefers-reduced-motion:reduce){.whale-flight,.whale-bob{animation:none!important;will-change:auto}}\n:host(:not([data-expanded])) .time,:host(:not([data-expanded])) .caption{display:none}\n";
    // Embed the tested solar engine in private scope; no CDN or global override.
    const solar = (() => {
      const globalThis = {};
      /* SkySolar — dependency-free, approximate solar times and positions.
 * NOAA/Meeus equations: https://gml.noaa.gov/grad/solcalc/calcdetails.html
 * Sunrise/sunset use a geometric altitude of -0.833 degrees (standard
 * refraction and solar radius). Terrain and local weather are not modelled.
 */
(function (root) {
  'use strict';

  const RAD = Math.PI / 180;
  const DAY = 86400000;
  const MINUTE = 60000;
  const formatters = new Map();
  const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

  function timestamp(parts) {
    const result = new Date(0);
    result.setUTCFullYear(parts.year, parts.month - 1, parts.day);
    result.setUTCHours(parts.hour || 0, parts.minute || 0, parts.second || 0, 0);
    return result.getTime();
  }

  function getZonedDateParts(date, timeZone) {
    if (!formatters.has(timeZone)) {
      formatters.set(timeZone, new Intl.DateTimeFormat('en-GB', {
        timeZone, calendar: 'gregory', numberingSystem: 'latn',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      }));
    }
    const result = {};
    for (const item of formatters.get(timeZone).formatToParts(date)) {
      if (item.type !== 'literal') result[item.type] = Number(item.value);
    }
    return result;
  }

  function dateAtMinutes(parts, minutes, timeZone) {
    if (!Number.isFinite(minutes)) throw new RangeError('Minutes must be finite');
    const wallTime = timestamp({ year: parts.year, month: parts.month, day: parts.day }) + minutes * MINUTE;
    const offsets = new Set();
    // Probe both sides of timezone transitions, including a skipped date.
    for (const hours of [-36, -12, 0, 12, 36]) {
      const probe = wallTime + hours * 3600000;
      offsets.add(timestamp(getZonedDateParts(new Date(probe), timeZone)) - Math.floor(probe / 1000) * 1000);
    }
    const candidates = Array.from(offsets, offset => {
      const instant = wallTime - offset;
      const actualWall = timestamp(getZonedDateParts(new Date(instant), timeZone)) + mod(instant, 1000);
      return { instant, difference: actualWall - wallTime };
    });
    // Like Temporal's "compatible" policy: first instance of a repeated time;
    // move forward through the gap when the requested local time is missing.
    const matches = candidates.filter(item => Math.abs(item.difference) < 1);
    if (matches.length) return new Date(Math.min(...matches.map(item => item.instant)));
    const later = candidates.filter(item => item.difference >= 0)
      .sort((a, b) => a.difference - b.difference || a.instant - b.instant);
    return new Date((later[0] || candidates[0]).instant);
  }

  function solarCoordinates(milliseconds) {
    const julian = milliseconds / DAY + 2440587.5;
    const t = (julian - 2451545) / 36525;
    const longitude = mod(280.46646 + t * (36000.76983 + 0.0003032 * t), 360);
    const anomaly = (357.52911 + t * (35999.05029 - 0.0001537 * t)) * RAD;
    const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    const center = Math.sin(anomaly) * (1.914602 - t * (0.004817 + 0.000014 * t))
      + Math.sin(2 * anomaly) * (0.019993 - 0.000101 * t) + Math.sin(3 * anomaly) * 0.000289;
    const omega = (125.04 - 1934.136 * t) * RAD;
    const apparentLongitude = (longitude + center - 0.00569 - 0.00478 * Math.sin(omega)) * RAD;
    const meanObliquity = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
    const obliquity = (meanObliquity + 0.00256 * Math.cos(omega)) * RAD;
    const declination = Math.asin(Math.sin(obliquity) * Math.sin(apparentLongitude));
    const y = Math.tan(obliquity / 2) ** 2;
    const l = longitude * RAD;
    const equation = 4 / RAD * (y * Math.sin(2 * l) - 2 * eccentricity * Math.sin(anomaly)
      + 4 * eccentricity * y * Math.sin(anomaly) * Math.cos(2 * l)
      - 0.5 * y * y * Math.sin(4 * l) - 1.25 * eccentricity * eccentricity * Math.sin(2 * anomaly));
    return { declination, equation };
  }

  function getSunPosition(date, latitude, longitude) {
    const milliseconds = date.getTime();
    const coordinates = solarCoordinates(milliseconds);
    const trueSolarMinutes = mod(mod(milliseconds, DAY) / MINUTE + coordinates.equation + 4 * longitude, 1440);
    const hourAngle = (trueSolarMinutes / 4 - 180) * RAD;
    const phi = latitude * RAD;
    const declination = coordinates.declination;
    const altitude = Math.asin(clamp(Math.sin(phi) * Math.sin(declination)
      + Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle), -1, 1)) / RAD;
    const azimuth = mod(Math.atan2(Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(phi) - Math.tan(declination) * Math.cos(phi)) / RAD + 180, 360);
    // Geometric altitude; azimuth is clockwise from geographic north.
    return { altitude, azimuth };
  }

  function getSunTimes(parts, latitude, longitude, timeZone) {
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90
      || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      throw new RangeError('Invalid latitude or longitude');
    }
    const dayParts = { year: parts.year, month: parts.month, day: parts.day };
    const start = dateAtMinutes(dayParts, 0, timeZone).getTime();
    const end = dateAtMinutes(dayParts, 1440, timeZone).getTime();
    let noon = dateAtMinutes(dayParts, 720, timeZone).getTime();
    // Refine the instant at which the solar clock reads 720 minutes.
    for (let i = 0; i < 4; i++) {
      const solarMinutes = mod(noon, DAY) / MINUTE + solarCoordinates(noon).equation + 4 * longitude;
      noon -= (mod(solarMinutes, 1440) - 720) * MINUTE;
    }
    const localMinutes = instant => {
      const local = getZonedDateParts(new Date(instant), timeZone);
      return local.hour * 60 + local.minute + local.second / 60 + mod(instant, 1000) / MINUTE;
    };
    const elevation = instant => getSunPosition(new Date(instant), latitude, longitude).altitude + 0.833;
    const samples = [start, end];
    for (let instant = start + 10 * MINUTE; instant < end; instant += 10 * MINUTE) samples.push(instant);
    // Include the extrema so very brief daylight/twilight near the poles is
    // represented even when it falls between the regular ten-minute samples.
    for (const instant of [noon - DAY / 2, noon, noon + DAY / 2]) {
      if (instant > start && instant < end) samples.push(instant);
    }
    samples.sort((a, b) => a - b);
    let sunrise = null;
    let sunset = null;
    let previous = elevation(samples[0]);
    for (let i = 1; i < samples.length; i++) {
      const value = elevation(samples[i]);
      if ((previous <= 0 && value > 0) || (previous > 0 && value <= 0)) {
        let low = samples[i - 1];
        let high = samples[i];
        const rising = value > previous;
        while (high - low > 100) {
          const middle = (low + high) / 2;
          if ((elevation(middle) > 0) === rising) high = middle;
          else low = middle;
        }
        const crossing = (low + high) / 2;
        if (crossing < end) {
          if (rising) sunrise = localMinutes(crossing);
          else sunset = localMinutes(crossing);
        }
      }
      previous = value;
    }
    const polar = sunrise === null && sunset === null
      ? (elevation((start + end) / 2) > 0 ? 'day' : 'night') : null;
    return { sunrise, sunset, noon: localMinutes(noon), polar };
  }

  function formatTime(minutes) {
    if (!Number.isFinite(minutes)) return '—';
    const rounded = mod(Math.round(minutes), 1440);
    return String(Math.floor(rounded / 60)).padStart(2, '0') + ':' + String(rounded % 60).padStart(2, '0');
  }

  const api = Object.freeze({ getZonedDateParts, getSunTimes, getSunPosition, dateAtMinutes, formatTime });
  root.SkySolar = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);

      return globalThis.SkySolar;
    })();
    const CITIES = {
      shanghai:{name:'上海',latitude:31.2304,longitude:121.4737,timeZone:'Asia/Shanghai'},
      beijing:{name:'北京',latitude:39.9042,longitude:116.4074,timeZone:'Asia/Shanghai'},
      chengdu:{name:'成都',latitude:30.5728,longitude:104.0668,timeZone:'Asia/Shanghai'},
      shenzhen:{name:'深圳',latitude:22.5431,longitude:114.0579,timeZone:'Asia/Shanghai'},
      tokyo:{name:'东京',latitude:35.6762,longitude:139.6503,timeZone:'Asia/Tokyo'},
      london:{name:'伦敦',latitude:51.5072,longitude:-.1276,timeZone:'Europe/London'},
      newyork:{name:'纽约',latitude:40.7128,longitude:-74.006,timeZone:'America/New_York'},
      sydney:{name:'悉尼',latitude:-33.8688,longitude:151.2093,timeZone:'Australia/Sydney'}
    };
    const AM = [
      [-18,'17263e','35435b','636d81','506176','64768a','3f5863','315159','294b50'],
      [-10,'454d75','8989a5','d4afb2','9291aa','c5b8c1','8b929c','71878c','5f7b7e'],
      [-3,'9695b4','dcbbc0','f8d7b4','d4bdc4','ffe5d0','a5b5ad','8da8a1','7f9d95'],
      [4,'a8bfce','e3d4ce','f5dfbd','e0d5d1','fff4dc','b3c3af','91b2a1','7aa697'],
      [14,'9bc6d9','d3e5e4','eee7ca','dcebe5','fffdf0','a5beb7','8aafa2','78a393'],
      [35,'8abbd4','c5e1e7','e8e6d1','dfede9','fffef3','a4beba','8bb0a8','79a59c']
    ];
    const PM = [
      [-18,'17263e','35435b','636d81','506176','64768a','3f5863','315159','294b50'],
      [-10,'4a4c70','8d819b','d8a4ad','91829b','c6a5b0','8b8a96','717d88','607681'],
      [-3,'8f849e','d8acb4','f1bf9f','c9a5b3','f5cbb9','b0a9a4','929e97','7d948a'],
      [4,'a2b5c8','e2c6c2','f5d4a8','e0c3bf','ffe3c5','b5b7a7','a1ad94','889f87'],
      [14,'9bc6d9','d3e5e4','eee7ca','dcebe5','fffdf0','a5beb7','8aafa2','78a393'],
      [35,'8abbd4','c5e1e7','e8e6d1','dfede9','fffef3','a4beba','8bb0a8','79a59c']
    ];
    const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
    const smooth = (a,b,n) => { const x=clamp((n-a)/(b-a));return x*x*(3-2*x); };
    const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16));
    const mix = (a,b,n) => a.map((x,i)=>x+(b[i]-x)*clamp(n));
    const css = color => `rgb(${color.map(Math.round).join(', ')})`;
    const rgba = (color,alpha) => `rgba(${color.map(Math.round).join(', ')}, ${alpha})`;
    const key = parts => `${parts.year}-${String(parts.month).padStart(2,'0')}-${String(parts.day).padStart(2,'0')}`;
    const isCity = value => Object.hasOwn(CITIES,value);
    function dayLength(times) {
      if(times.polar==='day')return '极昼';
      if(times.polar==='night')return '极夜';
      if(times.sunrise===null||times.sunset===null||times.sunset<=times.sunrise)return '—';
      const minutes=Math.round(times.sunset-times.sunrise);
      return `${Math.floor(minutes/60)}小时${minutes%60}分`;
    }
    const lum = color => color.map(n=>{const x=n/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
    const contrast = (a,b) => {const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    function readable(ink,background) {
      if(contrast(ink,background)>=4.6)return ink;
      const target=contrast([0,0,0],background)>contrast([255,255,255],background)?[0,0,0]:[255,255,255];
      let a=0,b=1;for(let i=0;i<14;i++){const t=(a+b)/2;if(contrast(mix(ink,target,t),background)<4.6)a=t;else b=t;}
      return mix(ink,target,b);
    }
    function palette(context) {
      function sample(stops) {
        let a=stops[0],b=stops.at(-1);
        if(context.altitude<=a[0])b=a;
        else if(context.altitude>=b[0])a=b;
        else for(let i=1;i<stops.length;i++)if(context.altitude<stops[i][0]){a=stops[i-1];b=stops[i];break;}
        const t=a===b?0:smooth(a[0],b[0],context.altitude);
        return a.slice(1).map((color,i)=>mix(rgb(color),rgb(b[i+1]),t));
      }
      const am=sample(AM),pm=sample(PM),t=.5+.5*Math.sin((context.minutes-context.times.noon)*Math.PI/720);
      const sky=am.map((color,i)=>mix(color,pm[i],t));
      const night=1-smooth(-10,4,context.altitude),dark=context.altitude<-8;
      const warmth=Math.exp(-(((context.altitude-1)/10)**2));
      const surface=dark?rgb('202e3d'):mix(rgb('f5f8f3'),rgb('fff6ec'),warmth*.8);
      const sidebar=dark?rgb('1c2c3b'):mix(rgb('edf3ee'),rgb('f4eadd'),warmth*.8);
      const ink=readable(dark?rgb('e3ece5'):rgb('263f49'),sidebar);
      const secondary=readable(dark?rgb('b1c3bd'):rgb('526a73'),sidebar);
      const muted=readable(dark?rgb('96afa9'):rgb('637982'),sidebar);
      const accent=readable(dark?rgb('b9d5c7'):rgb('315d62'),surface);
      const sceneInk=readable(mix(rgb('263f49'),rgb('e3ece5'),night),mix(sky[2],sky[6],.16));
      return {sky,night,dark,warmth,surface,sidebar,ink,secondary,muted,accent,sceneInk};
    }
    function copy(context) {
      if(context.times.polar==='day')return {label:'极昼 · 长长的日光',title:'太阳还在这片天空里。',detail:'今天没有日出日落，太阳整日留在地平线上方。'};
      if(context.times.polar==='night')return {label:'极夜 · 也在流动',title:'长夜里，也有天空。',detail:'今天没有太阳升起。地平线附近仍可能有短暂的暮光。'};
      if(context.altitude<-8)return {label:'月色，安静地陪着',title:'夜深了，天空还在。',detail:'月亮和星星留在这里。想歇一会儿，就看一会儿。'};
      if(context.altitude<7)return context.minutes<context.times.noon
        ?{label:'晨光，慢慢铺开',title:'早安，天空醒来了。',detail:'地平线先亮了起来，云朵也染上一点暖色。'}
        :{label:'晚霞，正在经过',title:'先停一会儿，看看晚霞。',detail:context.altitude<-.833?'太阳已经落下，云上的余晖还会再停留一会儿。':'太阳正慢慢走向地平线，光也变得柔软了。'};
      return {label:'晴空，正好',title:'今天，也抬头看看天。',detail:'云朵走得很慢。你也可以，先不用着急。'};
    }
    function createController(ctx) {
      const STORAGE='dsh-sky-window.preferences.v1';
      const media=matchMedia('(prefers-reduced-motion: reduce)');
      const state={enabled:true,city:'shanghai',custom:null,intensity:75,motion:true,minutes:null,date:null,looking:false,panelOpen:false,playback:null,notice:'',locating:false};
      try {
        const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');
        if(saved) {
          if(saved.custom&&Number.isFinite(saved.custom.latitude)&&Math.abs(saved.custom.latitude)<=90&&Number.isFinite(saved.custom.longitude)&&Math.abs(saved.custom.longitude)<=180&&typeof saved.custom.timeZone==='string') {
            new Intl.DateTimeFormat('en',{timeZone:saved.custom.timeZone});state.custom={...saved.custom,name:'当前位置'};
          }
          if(isCity(saved.city)||(saved.city==='custom'&&state.custom))state.city=saved.city;
          if(typeof saved.enabled==='boolean')state.enabled=saved.enabled;
          if(typeof saved.motion==='boolean')state.motion=saved.motion;
          if(Number.isFinite(saved.intensity))state.intensity=clamp(saved.intensity,25,100);
        }
      } catch { /* A blocked or old local preference must not break native DSH. */ }
      const listeners=new Set(),scenes=new Set(),cache=new Map(),inertBefore=new Map();
      let revision=0,view,background,backgroundDispose,styleNode,timer,previousTheme=ctx.theme.getTheme().preference;
      let overrideDispose=null,overrideSignature='',applyingTheme=false,disposed=false,themeSyncQueued=false,focusBefore=null,offTheme;
      const city=()=>state.city==='custom'?state.custom:CITIES[state.city];
      const persist=()=>{try{localStorage.setItem(STORAGE,JSON.stringify({enabled:state.enabled,city:state.city,custom:state.custom,intensity:state.intensity,motion:state.motion}));}catch{}};
      function context() {
        const location=city(),now=new Date(),local=solar.getZonedDateParts(now,location.timeZone);
        const instant=state.minutes===null&&!state.date?now:solar.dateAtMinutes(state.date||local,state.minutes??(local.hour*60+local.minute+local.second/60),location.timeZone);
        const parts=solar.getZonedDateParts(instant,location.timeZone),minutes=parts.hour*60+parts.minute+parts.second/60;
        const cacheKey=`${location.latitude},${location.longitude},${location.timeZone},${key(parts)}`;
        if(!cache.has(cacheKey)){if(cache.size>40)cache.clear();cache.set(cacheKey,solar.getSunTimes(parts,location.latitude,location.longitude,location.timeZone));}
        const times=cache.get(cacheKey),position=solar.getSunPosition(instant,location.latitude,location.longitude);
        const result={city:location,parts,minutes,instant,times,altitude:position.altitude,preview:state.minutes!==null||!!state.date};
        result.palette=palette(result);result.copy=copy(result);return result;
      }
      function applyTheme() {
        const p=view.palette,scheme=p.dark?'sky-night':'sky-day';
        const line=rgba(p.ink,.14),hover=p.dark?'rgba(205,225,224,.09)':'rgba(255,255,255,.44)';
        const values={
          '--dsw-alias-bg-base':css(p.surface),'--dsw-alias-bg-layer-1':css(p.surface),
          '--dsw-alias-bg-layer-2':css(mix(p.surface,p.sidebar,.5)),'--dsw-alias-bg-layer-3':css(p.surface),
          '--dsw-alias-bg-module-platform':css(p.surface),'--dsw-alias-bg-overlay':css(p.surface),
          '--dsw-specific-sidebar-fill':rgba(p.sidebar,.94),'--dsw-specific-input-major':rgba(p.surface,.96),
          '--dsw-specific-menu':css(p.surface),'--dsw-specific-selector':css(mix(p.surface,p.sidebar,.65)),
          '--dsw-specific-bubble':rgba(p.surface,.90),'--dsw-specific-tip':css(p.surface),
          '--dsw-alias-label-primary':css(p.ink),'--dsw-alias-label-primary-bluish':css(p.ink),
          '--dsw-alias-label-secondary':css(p.secondary),'--dsw-alias-label-tertiary':css(p.muted),
          '--dsw-alias-label-caption':css(p.muted),'--dsw-alias-label-dimmed':css(p.muted),
          '--dsw-alias-label-primary-inverted':css(p.surface),'--dsw-alias-label-primary-foreground':css(p.surface),
          '--dsw-alias-brand-primary':css(p.accent),'--dsw-alias-brand-text':css(p.accent),
          '--dsw-alias-state-business-primary':css(p.accent),'--dsw-alias-border-l1':line,
          '--dsw-alias-border-l2':line,'--dsw-alias-border-l2-darkmode-thin':line,
          '--dsw-alias-border-l3':rgba(p.ink,.24),'--dsw-alias-border-l4':rgba(p.ink,.22),
          '--dsw-alias-border-inverted':line,'--dsw-alias-interactive-bg-hover':hover,
          '--dsw-alias-interactive-bg-hover-solid':css(mix(p.surface,p.sidebar,.65)),
          '--dsw-alias-button-floating-fill':css(p.surface),'--dsw-alias-button-floating-hover':css(p.sidebar),
          '--dsw-alias-markdown-code-block':css(mix(p.surface,p.dark?[0,0,0]:rgb('b7ccc2'),.14)),
          '--dsw-alias-markdown-inline-code':css(mix(p.surface,p.sidebar,.65)),
          '--dsw-specific-sidebar-nav-item-active':hover,'--dsw-specific-sidebar-nav-item-hover':hover,
          '--sw-look-background':css(p.sky[1]),'--sw-look-ink':css(p.sceneInk),
          '--sw-glass-fill':rgba(mix(p.surface,p.sky[1],.48),p.dark?.56:.48),
          '--sw-glass-border':rgba(p.sceneInk,p.dark?.18:.12),
          '--sw-glass-accent':rgba(p.sceneInk,p.dark?.18:.14),
          '--sw-glass-shadow':rgba(p.dark?[0,0,0]:rgb('263f49'),p.dark?.18:.08)
        };
        const signature=JSON.stringify(values);
        applyingTheme=true;
        try {
          if(ctx.theme.getTheme().preference!==scheme)ctx.theme.setTheme(scheme);
          if(signature!==overrideSignature){overrideDispose=ctx.theme.overrideTokens('dsh-sky-window',Object.fromEntries(Object.entries(values).map(([name,value])=>[name,{light:value,dark:value}])));overrideSignature=signature;}
        } finally {applyingTheme=false;}
      }
      function paintScene(scene) {
        const p=view.palette,root=scene.host;
        const keys=['--sky-top','--sky-mid','--sky-low','--cloud','--cloud-top','--hill-far','--hill-mid','--hill-near'];
        keys.forEach((name,i)=>root.style.setProperty(name,css(p.sky[i])));
        const hasEvents=view.times.sunrise!==null&&view.times.sunset!==null&&view.times.sunset>view.times.sunrise;
        const progress=clamp(hasEvents?(view.minutes-view.times.sunrise)/(view.times.sunset-view.times.sunrise):(view.minutes-view.times.noon)/1440+.5,-.12,1.12);
        const angle=Math.PI*(1-progress),polarDay=view.times.polar==='day';
        const x=polarDay?500+270*Math.sin((view.minutes-view.times.noon)*Math.PI/720):500+350*Math.cos(angle);
        const y=polarDay?245-155*clamp(view.altitude/45):315-252*Math.sin(angle);
        scene.sun.style.transform=`translate(${x.toFixed(3)}px,${y.toFixed(3)}px)`;
        scene.progress.style.strokeDasharray=`${clamp(progress)} 1`;
        scene.rise.textContent=solar.formatTime(view.times.sunrise);scene.set.textContent=solar.formatTime(view.times.sunset);
        scene.caption.textContent=view.times.polar==='day'?'极昼 · 全天有光':view.times.polar==='night'?'极夜 · 等待下一次日出':'半圆 · 日出到日落';
        const sidebar=document.querySelector('.pI_x6G_sidebarCol');
        const variables={
          '--scene-ink':css(p.sceneInk),'--intensity':state.intensity/100,'--nightness':p.night,
          '--stars':1-smooth(-14,-5,view.altitude),'--moon-visibility':1-smooth(-10,-4,view.altitude),
          '--sun-visibility':polarDay?1:view.times.polar==='night'?0:smooth(-3,-.7,view.altitude),
          '--warmth':p.warmth*.55,'--light-x':`${x/10}%`,'--reading-veil':css(p.surface),
          '--sw-sidebar':`${sidebar?sidebar.getBoundingClientRect().width:240}px`
        };
        Object.entries(variables).forEach(([name,value])=>root.style.setProperty(name,String(value)));
        root.toggleAttribute('data-preview',view.preview);root.toggleAttribute('data-playing',!!state.playback);
        root.toggleAttribute('data-paused',!state.motion||media.matches||document.hidden);
        root.toggleAttribute('data-polar',!!view.times.polar);
      }
      function attachScene(host) {
        const shadow=host.shadowRoot||host.attachShadow({mode:'open'});
        // All markup is a fixed local build asset; user input never reaches HTML.
        shadow.innerHTML=`<style>${SCENE_CSS}</style>${SCENE_HTML}`;
        const stars=shadow.querySelector('.stars');
        for(let i=0;i<46;i++){
          const star=document.createElement('i');star.className='star';star.style.left=`${(i*61.73+7)%100}%`;star.style.top=`${(i*29.41+11)%87}%`;
          star.style.width=star.style.height=`${i%6===0?2:1}px`;star.style.setProperty('--star-opacity',String(.24+i%5*.12));star.style.setProperty('--delay',`${-i*.7}s`);stars.append(star);
        }
        const scene={host,sun:shadow.querySelector('.sun'),progress:shadow.querySelector('.progress'),rise:shadow.querySelector('.rise'),set:shadow.querySelector('.set'),caption:shadow.querySelector('.center-caption')};
        scenes.add(scene);if(view)paintScene(scene);return()=>scenes.delete(scene);
      }
      function ensureBackground() {
        if(background)return;
        background=document.createElement('div');background.id='dsh-sky-window-background';background.setAttribute('aria-hidden','true');
        Object.assign(background.style,{position:'fixed',inset:'0',zIndex:'-1',pointerEvents:'none'});
        document.body.prepend(background);backgroundDispose=attachScene(background);document.body.setAttribute('data-sky-window','on');
      }
      function restoreInert() {for(const [node,value]of inertBefore)if(node.isConnected)node.inert=value;inertBefore.clear();}
      function clearVisual(restore=true) {
        backgroundDispose?.();backgroundDispose=null;background?.remove();background=null;document.body.removeAttribute('data-sky-window');
        applyingTheme=true;
        try {
          overrideDispose?.();overrideDispose=null;overrideSignature='';
          const selected=ctx.theme.getTheme().preference;
          if(restore&&(selected==='sky-day'||selected==='sky-night')) {
            const themes=ctx.theme.getTheme().themes;
            ctx.theme.setTheme(previousTheme==='system'||themes.some(theme=>theme.id===previousTheme)?previousTheme:'system');
          }
        } finally {applyingTheme=false;}
        restoreInert();
      }
      function emit() {
        if(disposed)return;view=context();
        if(state.enabled){ensureBackground();applyTheme();for(const scene of scenes)paintScene(scene);}
        revision++;for(const listener of listeners)listener();
      }
      function stop() {if(state.playback){cancelAnimationFrame(state.playback.frame);state.playback=null;}}
      function enabled(value) {
        if(state.enabled===value)return;
        if(value){const preference=ctx.theme.getTheme().preference;if(preference!=='sky-day'&&preference!=='sky-night')previousTheme=preference;state.enabled=true;}
        else {stop();state.looking=false;state.enabled=false;clearVisual();}
        persist();emit();
      }
      function looking(value) {
        if(value&&!state.enabled)enabled(true);
        if(value&&!state.looking){
          focusBefore=document.activeElement;
          const overlay=document.querySelector('[data-shell-overlay]');
          if(overlay?.parentElement)for(const node of overlay.parentElement.children)if(node!==overlay){inertBefore.set(node,node.inert);node.inert=true;}
        }
        if(!value){stop();restoreInert();}
        state.looking=value;if(value)state.panelOpen=false;emit();
        if(!value&&focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
      }
      function preview(minutes) {
        if(minutes===null){state.notice='这个日期没有对应的日出或日落。';emit();return;}
        if(!state.enabled)enabled(true);stop();if(!state.date)state.date={...view.parts};state.minutes=clamp(minutes,0,1439);emit();
      }
      function live() {stop();state.minutes=null;state.date=null;emit();}
      function play() {
        if(state.playback){stop();emit();return;}
        if(!state.enabled)enabled(true);state.date={...view.parts};state.minutes=0;
        state.playback={started:performance.now(),frame:0,last:-100};looking(true);
        function tick(now) {
          const playback=state.playback;if(!playback||disposed)return;
          if(now-playback.last>=75){state.minutes=Math.min(1439,(now-playback.started)/24000*1440);playback.last=now;emit();}
          if(state.minutes>=1439){stop();emit();return;}playback.frame=requestAnimationFrame(tick);
        }
        state.playback.frame=requestAnimationFrame(tick);
      }
      function locate() {
        if(!navigator.geolocation){state.notice='此浏览器无法定位，可以直接选择城市。';emit();return;}
        state.locating=true;state.notice='正在等待位置授权…';emit();
        navigator.geolocation.getCurrentPosition(result=>{
          if(disposed)return;state.custom={name:'当前位置',latitude:result.coords.latitude,longitude:result.coords.longitude,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone};
          state.city='custom';state.locating=false;state.minutes=null;state.date=null;stop();
          state.notice='已切换到你的位置。定位时间采用设备时区。';persist();emit();
        },()=>{if(disposed)return;state.locating=false;state.notice='定位未成功，仍保留当前城市；也可以手动选择。';emit();},{enableHighAccuracy:false,timeout:10000,maximumAge:3600000});
      }
      const visibility=()=>{if(document.hidden)stop();emit();};
      const keyboard=event=>{if(event.key==='Escape'){if(state.panelOpen){state.panelOpen=false;emit();}else if(state.looking)looking(false);}};
      const onMotion=()=>emit(),resize=()=>emit();
      return {
        state,get view(){return view;},subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},getSnapshot:()=>revision,
        attachScene,enabled,looking,preview,live,play,locate,
        pause(){stop();emit();},panel(value){stop();state.panelOpen=value;emit();},
        city(value){if(!isCity(value)&&!(value==='custom'&&state.custom))return;stop();state.city=value;state.minutes=null;state.date=null;state.notice='';persist();emit();},
        intensity(value){state.intensity=clamp(Number(value),25,100);persist();emit();},
        motion(value){state.motion=value;persist();emit();},
        date(value){if(!/^\d{4}-\d\d-\d\d$/.test(value))return;const [year,month,day]=value.split('-').map(Number);if(year<1900||year>2100)return;stop();state.date={year,month,day};state.minutes=view.minutes;emit();},
        start(){
          styleNode=document.createElement('style');styleNode.id='dsh-sky-window-style';styleNode.textContent=UI_CSS;document.head.append(styleNode);
          emit();timer=setInterval(()=>{if(!document.hidden&&!state.playback)emit();},15000);
          document.addEventListener('visibilitychange',visibility);document.addEventListener('keydown',keyboard);window.addEventListener('resize',resize);media.addEventListener('change',onMotion);
          offTheme=ctx.on('theme/change',snapshot=>{
            if(disposed||applyingTheme)return;
            if(state.enabled&&snapshot.preference!=='sky-day'&&snapshot.preference!=='sky-night') {
              // Host settings hydrate asynchronously. Preserve the native
              // preference for restoration while the explicit sky switch owns
              // the running palette; reapply outside the current event stack.
              previousTheme=snapshot.preference;
              if(!themeSyncQueued){
                themeSyncQueued=true;
                queueMicrotask(()=>{themeSyncQueued=false;if(!disposed&&state.enabled)applyTheme();});
              }
            }
          });
        },
        dispose(){disposed=true;stop();clearInterval(timer);offTheme?.();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keyboard);window.removeEventListener('resize',resize);media.removeEventListener('change',onMotion);clearVisual();styleNode?.remove();scenes.clear();listeners.clear();}
      };
    }

    function apply(ctx) {
      const registrations=[ctx.theme.register({id:'sky-day',colorScheme:'light',tokens:{}}),ctx.theme.register({id:'sky-night',colorScheme:'dark',tokens:{}})];
      const controller=createController(ctx);
      function useSky() {React.useSyncExternalStore(controller.subscribe,controller.getSnapshot,controller.getSnapshot);return {state:controller.state,view:controller.view};}
      function button(text,onClick,props={}) {return h('button',{type:'button',className:'sw-button sw-small',onClick,...props},text);}
      function Controls({closeNative}) {
        const {state,view}=useSky();if(!view)return null;
        const {times}=view,fmt=solar.formatTime;
        const openLook=()=>{closeNative?.();controller.looking(true);};
        const startDay=()=>{closeNative?.();controller.play();};
        return h('div',{className:'sw-settings'},
          h('p',{className:'sw-description'},'一扇朝向天空的窗。日光跟着当地时间流动，原生对话与工作区都留在这里。'),
          h('section',{className:'sw-section'},h('label',{className:'sw-row'},h('span',null,'启用天空窗'),h('input',{type:'checkbox',className:'sw-checkbox',checked:state.enabled,onChange:event=>controller.enabled(event.target.checked)}))),
          h('section',{className:'sw-section'},h('div',{className:'sw-label'},'天空所在的位置'),
            h('div',{className:'sw-control-row'},h('select',{'aria-label':'天空所在城市',value:state.city,onChange:event=>controller.city(event.target.value)},Object.entries(CITIES).map(([id,city])=>h('option',{key:id,value:id},city.name)),state.custom?h('option',{value:'custom'},'当前位置'):null),button(state.locating?'定位中…':'定位',controller.locate,{disabled:state.locating})),
            h('p',{className:'sw-help'},`${view.city.timeZone} · ${state.city==='custom'?'定位采用设备时区':'按城市当地时间计算'}`),
            h('div',{className:'sw-times'},h('div',null,'日出',h('strong',null,fmt(times.sunrise))),h('div',null,'日落',h('strong',null,fmt(times.sunset))),h('div',null,'今天的日光',h('strong',null,dayLength(times))))),
          h('section',{className:'sw-section'},h('div',{className:'sw-row'},h('label',null,'沿着时间，看看天空'),h('span',{className:'sw-time'},fmt(view.minutes))),
            h('input',{type:'range',min:0,max:1439,step:1,value:Math.floor(view.minutes),'aria-label':'预览当地时间',onChange:event=>controller.preview(Number(event.target.value))}),
            h('div',{className:'sw-range-labels'},h('span',null,'00:00'),h('span',null,'12:00'),h('span',null,'24:00')),
            h('div',{className:'sw-presets'},[['日出',times.sunrise],['正午',times.noon],['日落',times.sunset],['夜空',1320]].map(([label,minutes])=>button(label,()=>controller.preview(minutes),{key:label,disabled:minutes===null}))),
            h('div',{className:'sw-control-row'},h('input',{type:'date',min:'1900-01-01',max:'2100-12-31',value:key(view.parts),'aria-label':'预览日期',onChange:event=>controller.date(event.target.value)}),button(state.playback?'暂停':'看一天',startDay)),
            button(view.preview?'回到此刻的天空':'此刻，正在实时流动',controller.live,{className:`sw-button sw-small sw-live${view.preview?' sw-return-now':''}`,disabled:!view.preview})),
          h('section',{className:'sw-section'},h('div',{className:'sw-row'},h('label',null,'天空浓度'),h('span',{className:'sw-muted'},`${state.intensity}%`)),
            h('input',{type:'range',min:25,max:100,value:state.intensity,'aria-label':'天空浓度',onChange:event=>controller.intensity(event.target.value)}),
            h('div',{className:'sw-range-labels'},h('span',null,'更安静'),h('span',null,'更鲜明')),
            h('label',{className:'sw-row',style:{marginTop:18}},h('span',null,'云朵缓慢飘动'),h('input',{type:'checkbox',className:'sw-checkbox',checked:state.motion,onChange:event=>controller.motion(event.target.checked)})),
            h('p',{className:'sw-help'},'系统开启减少动态效果时，云朵会保持静止。切走页面后动效自动暂停。')),
          h('div',{className:'sw-section'},button('抬头看一会儿 ↗',openLook,{className:'sw-button sw-live'})),
          state.notice?h('p',{className:'sw-alert',role:'status'},state.notice):null,
          h('p',{className:'sw-note'},'半圆表示日出到日落的时间进度。天空为晴天插画，天文时间为估算。位置与偏好仅保存在本机；定位只在点击时请求。')
        );
      }
      function ImmersiveScene() {
        const ref=React.useRef(null);
        React.useLayoutEffect(()=>{if(ref.current)return controller.attachScene(ref.current);},[]);
        return h('div',{className:'sw-immersive-scene',ref,'data-expanded':''});
      }
      function Immersive() {
        const {view,state}=useSky(),ref=React.useRef(null);
        React.useEffect(()=>{ref.current?.focus({preventScroll:true});},[]);
        return h('div',{className:'sw-immersive',role:'dialog','aria-modal':'true','aria-label':'抬头看看天空',tabIndex:-1,ref},h(ImmersiveScene),
          h('div',{className:'sw-look-settings'},
            h('button',{type:'button',className:'sw-sky-action sw-settings-icon',onClick:()=>controller.panel(!state.panelOpen),'aria-label':'天空设置',title:'天空设置'},
              h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none','aria-hidden':'true'},
                h('path',{d:'M4 7h10m4 0h2M4 17h2m4 0h10M14 4v6M7 14v6',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round'})))),
          h('div',{className:'sw-look-copy'},h('h2',null,'抬头，看看天。')),
          h('div',{className:'sw-look-actions'},button('回到工作 ↙',()=>controller.looking(false),{className:'sw-sky-action'}),
            h('button',{type:'button',className:'sw-sky-action sw-day-play',onClick:controller.play,'aria-label':state.playback?'暂停一天预览':'看一天',title:state.playback?'暂停一天预览':'看一天'},
              h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none','aria-hidden':'true'},state.playback?h('path',{d:'M9 5v14M15 5v14',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}):h('path',{d:'M8 5l11 7-11 7Z',stroke:'currentColor',strokeWidth:1.5,strokeLinejoin:'round'})))));
      }
      function Overlay() {
        const {state,view}=useSky();if(!view)return null;
        return h('div',{className:'sw-ui',style:{pointerEvents:'none'}},
          state.looking&&state.enabled?h(Immersive):null,
          !state.looking?h('div',{className:'sw-dock'},
            h('button',{type:'button',className:'sw-pill',onClick:()=>controller.panel(!state.panelOpen),'aria-expanded':state.panelOpen,'aria-label':'打开天空窗设置'},
              h('span',{className:'sw-sun-dot'}),h('span',null,'天空窗'),state.enabled?h(React.Fragment,null,h('span',{className:'sw-dock-divider'}),h('span',{className:'sw-dock-time'},solar.formatTime(view.minutes)),h('span',{className:'sw-dock-city sw-muted'},view.city.name)):h('span',{className:'sw-muted'},'已关闭')),
            state.enabled?button('抬头看看 ↗',()=>controller.looking(true),{className:'sw-pill'}):null):null,
          state.enabled&&state.looking&&view.preview?h('div',{className:'sw-preview sw-over-look'},h('span',null,`${state.playback?'一天掠过':'时间预览'} · ${solar.formatTime(view.minutes)}`),state.playback?button('暂停',controller.pause):null,button('回到此刻',controller.live,{className:'sw-return-now'})):null,
          state.panelOpen?h('div',{className:`sw-popover${state.looking?' sw-over-look':''}`,role:'dialog','aria-label':'天空设置'},h('div',{className:'sw-popover-head'},h('h2',null,'天空设置'),button('×',()=>controller.panel(false),{className:'sw-close','aria-label':'关闭天空设置'})),h(Controls)):null);
      }
      function SettingsSection(props) {return h('section',{className:'sw-settings'},h('h2',null,'天空窗'),h(Controls,{closeNative:props.close}));}
      ctx.effect(()=>{controller.start();return()=>{controller.dispose();registrations.reverse().forEach(dispose=>dispose());};},'sky-window: local sky, theme and lifecycle');
      ctx.slots.inject('shell.overlay',()=>ctx.slots.register({name:'shell.overlay',id:'sky-window',order:40},Overlay));
      ctx.slots.inject('settings.section',()=>ctx.slots.register({name:'settings.section',id:'sky-window',order:40,label:()=> '天空窗'},SettingsSection));
    }
    return {inject:['slots','theme'],apply};
  }
});
