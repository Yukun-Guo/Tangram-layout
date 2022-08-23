import { customRef } from 'vue';

const focusableElementsSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default () => {
    const trapRef = customRef((track, trigger) => {
        let $trapEl = null;
        return {
            get() {
                track();
                return $trapEl;
            },
            set(value) {
                $trapEl = value;
                value ? initTrapFocus() : clearTrapFocus();
                trigger();
            },
        };
    });
    let focusableElements = [];
    let $firstFocusable;
    let $lastFocusable;

    function keyHandler(e: KeyboardEvent) {
        const isTabPressed = e.key === 'Tab';

        if (!isTabPressed) return;

        if (e.shiftKey) {
            if (document.activeElement === $firstFocusable) {
                $lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === $lastFocusable) {
                $firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    function initTrapFocus() {
        // Bail out if there is no value
        if (!trapRef.value) return;
        focusableElements = trapRef.value.querySelectorAll(
            focusableElementsSelector
        );
        $firstFocusable = focusableElements[0];
        $lastFocusable = focusableElements[focusableElements.length - 1];
        document.addEventListener('keydown', keyHandler);
        $firstFocusable.select();
        $firstFocusable.focus();

    }

    function clearTrapFocus() {
        document.removeEventListener('keydown', keyHandler);
    }

    return {
        trapRef,
        initTrapFocus,
        clearTrapFocus,
    };
};
