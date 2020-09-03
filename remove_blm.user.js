// ==UserScript==
// @name         Remove BLM Banner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/scripts.php
// @match        *://reactjs.org/*
// @match        *://*.reactjs.org/*
// @match        *://it.reactjs.org/*
// @match        *://final-form.org/*
// @match        *://www.khanacademy.org/*
// @match        *://styled-components.com/*
// @match        *://styled-components.org/*
// @match        *://docusaurus.io/*
// @match        *://react-redux.js.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let locked = false;

    const run = () => {
        // Constants
        const NODE_TYPE = {
            ELEMENT: 1,
            ATTRIBUTE: 2,
            TEXT: 3,
            COMMENT: 4
        }

        // Utils
        const isElement = node => node.nodeType === NODE_TYPE.ELEMENT;
        const isAttribute = node => node.nodeType === NODE_TYPE.ATTRIBUTE;
        const isText = node => node.nodeType === NODE_TYPE.TEXT;
        const isComment = node => node.nodeType === NODE_TYPE.COMMENT;

        const list = (array=[]) => array.split("\n").map(s => s.trim()).filter(s => s.length > 0);
        const type = t => (t => t.substring(0, t.length - 1))(Object.prototype.toString.call(t).split(" ")[1].trim());
        const content = document.documentElement.textContent || document.documentElement.innerText;
        const hasTxt = (txt=null) => txt == null ? false : content.indexOf(txt) > -1;
        const isTextMatch = (node, txt) => node == null || txt == null ? false : node.nodeValue.substring(0, txt.length) === txt;
        const useNode = (node, callback) => {
            if (node != null) {
                const children = node.childNodes;
                for (const child of children)
                    callback(child);
            }
        }

        // Remove the element from the DOM.
        const removeTxt = txt => {
            if (txt != null) {
                const elements = document.getElementsByTagName("*");

                for (let node of elements)
                    useNode(node, el => {
                        if (isText(el) && isTextMatch(el, txt))
                            el.parentNode.remove();
                    });
            }
        }

        // Blacklist of phrases and keywords to find and remove.
        const blacklist = list(`
            blm
            blm.
            BLM
            BLM.
            black lives matter
            black lives matter.
            Black Lives Matter
            Black Lives Matter.
            Black Lives Matter. Support the Equal Justice Initiative.
            #BlackLivesMatter
        `);

        for (const el of blacklist)
            if (hasTxt(el))
                removeTxt(el);
    };

    const iterate = (unlock=true) => {
        let interval = setInterval(() => { run(); }, 500);

        setTimeout(() => {
            clearInterval(interval);

            if (unlock)
                locked = false;
        }, 5000);
    }

    // Initial removal.
    setTimeout(() => { run(); }, 100);

    // Initial 5 second process.
    iterate(false);

    // Repeat a 5 second removing process every time the window is clicked.
    window.addEventListener("click", () => {
        if (!locked) {
            locked = true;
            iterate();
        }
    });
})();
