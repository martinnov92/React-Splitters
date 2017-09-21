export function unselectAll() {
    try {
        window.getSelection().removeAllRanges();
    } catch (e) {
        console.warn(e);
    }
}

interface GetPrimaryPaneWidthArgs {
    position: string;
    clientX: number;
    clientY: number;
    maxMousePosition: number;
    handleBarOffsetFromParent: number;
    primaryPaneMinHeight: number;
    primaryPaneMinWidth: number;
}

export function getPrimaryPaneWidth(args: GetPrimaryPaneWidthArgs): number {
    const {
        position, clientX, clientY,
        maxMousePosition, handleBarOffsetFromParent,
        primaryPaneMinHeight, primaryPaneMinWidth
    } = args;
    let primaryPaneWidth;

    switch (position) {
        case 'horizontal': {
            if (clientY > maxMousePosition) {
                primaryPaneWidth = maxMousePosition - handleBarOffsetFromParent;
            } else if ((clientY - handleBarOffsetFromParent) <= primaryPaneMinHeight) {
                primaryPaneWidth = primaryPaneMinHeight + 0.001;
            } else {
                primaryPaneWidth = clientY - handleBarOffsetFromParent;
            }
            break;
        }
        case 'vertical':
        default: {
            if (clientX >= maxMousePosition) {
                primaryPaneWidth = maxMousePosition - handleBarOffsetFromParent;
            } else if ((clientX - handleBarOffsetFromParent) <= primaryPaneMinWidth) {
                primaryPaneWidth = primaryPaneMinWidth + 0.001;
            } else {
                primaryPaneWidth = clientX - handleBarOffsetFromParent;
            }
            break;
        }
    }

    return primaryPaneWidth;
}