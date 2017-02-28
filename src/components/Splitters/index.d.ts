// ------ Splitter interfaces
export type handlePositionType = 'vertical' | 'horizontal'; 

export interface SplitterProps {
    children?: {};
    position: handlePositionType;
    hasDetailPane?: boolean;
    primaryPaneMinWidth?: number; 
    primaryPaneWidth?: string; 
    primaryPaneMaxWidth?: string;
    primaryPaneMinHeight?: number; 
    primaryPaneHeight?: string; 
    primaryPaneMaxHeight?: string;
    className?: string; 
    primaryPaneClassName?: string; 
    secondaryPaneClassName?: string;
    dispatchResize?: Boolean;
    maximizedPrimaryPane?: Boolean;
    minimalizedPrimaryPane?: Boolean;
}

export interface SplitterState {
    isDragging?: boolean;
    maxMousePosInSplitterFromPercentage?: number;
    handleBarOffsetFromParent?: number;
    primaryPane?: number;
    lastX?: number;
    lastY?: number;
}

// ------ Pane interfaces
export interface PaneProps {
    position: handlePositionType;
    hasDetailPane?: boolean;
    id?: string;
    style?: CSSStyleRule;
    className?: string;
}

// ------ Handlebar interfaces
export interface HandleBarProps {
    position: handlePositionType;
    handleMouseDown: Function;
}