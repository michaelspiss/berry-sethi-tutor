export default function ArrowMarker() {


    return <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: "hidden", }}>
            <marker
                id="arrowMarker"
                viewBox="0 0 10 10"
                markerWidth="8"
                markerHeight="6"
                orient="auto"
                refX={15}
                refY={5}
            >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" stroke="context-stroke" />
            </marker>
    </svg>
}
