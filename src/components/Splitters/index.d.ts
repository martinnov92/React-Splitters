// ------ Splitter interfaces
export type handlePositionType = 'vertical' | 'horizontal'; 

export interface SplitterProps {
    children?: {} | any;
    position: handlePositionType;
    hasDetailPane?: boolean;
    primaryPaneMinWidth?: number | any; 
    primaryPaneWidth?: string | any; 
    primaryPaneMaxWidth?: string | any;
    primaryPaneMinHeight?: number | any; 
    primaryPaneHeight?: string | any; 
    primaryPaneMaxHeight?: string | any;
    className?: string; 
    primaryPaneClassName?: string; 
    secondaryPaneClassName?: string;
    dispatchResize?: Boolean;
    maximizedPrimaryPane?: Boolean;
    minimalizedPrimaryPane?: Boolean;
}

export interface SplitterState {
    isDragging?: boolean;
    maxMousePosInSplitterFromPercentage?: number | any;
    handleBarOffsetFromParent?: number | any;
    primaryPane?: number | any;
    lastX?: number | any;
    lastY?: number | any;
}

// ------ Pane interfaces
export interface PaneProps {
    position: handlePositionType;
    hasDetailPane?: boolean;
    id?: string;
    style?: CSSStyleRule | any;
    className?: string;
}

// ------ Handlebar interfaces
export interface HandleBarProps {
    position: handlePositionType;
    handleMouseDown: Function;
}