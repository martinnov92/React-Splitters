export function unselectAll() {
    try {
        window.getSelection().removeAllRanges();
    } catch (e) {
        console.warn(e);
    }
}

export function getPrimaryPaneWidth
    (
    position: string, lastX: number, lastY: number,
    maxMousePosition: number, handleBarOffsetFromParent: number,
    primaryPaneMinHeight: number, primaryPaneMinWidth: number
    ): number {

    let primaryPanePosition;

    switch (position) {
        case 'horizontal': {
            if (lastY > maxMousePosition) {
                primaryPanePosition = maxMousePosition - handleBarOffsetFromParent;
            } else if ((lastY - handleBarOffsetFromParent) <= primaryPaneMinHeight) {
                primaryPanePosition = primaryPaneMinHeight + 0.001;
            } else {
                primaryPanePosition = lastY - handleBarOffsetFromParent;
            }
            break;
        }
        case 'vertical':
        default: {
            if (lastX >= maxMousePosition) {
                primaryPanePosition = maxMousePosition - handleBarOffsetFromParent;
            } else if ((lastX - handleBarOffsetFromParent) <= primaryPaneMinWidth) {
                primaryPanePosition = primaryPaneMinWidth + 0.001;
            } else {
                primaryPanePosition = lastX - handleBarOffsetFromParent;
            }
            break;
        }
    }

    return primaryPanePosition;
}