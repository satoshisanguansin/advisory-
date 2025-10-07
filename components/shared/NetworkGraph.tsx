import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { NetworkGraphData, NetworkNode } from '../../types';

interface NodeWithPosition extends NetworkNode {
    x: number;
    y: number;
    radius: number;
}

interface NetworkGraphProps {
    graphData: NetworkGraphData;
    width?: number;
    height?: number;
}

const nodeColors: { [key: string]: string } = {
    Person: '#63B3ED', // Blue
    Organization: '#68D391', // Green
    Location: '#F56565', // Red
    Concept: '#F6AD55', // Orange
    Event: '#B794F4', // Purple
    Legislation: '#F6E05E', // Yellow
    PoliticalParty: '#A0AEC0' // Gray
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ graphData, width = 800, height = 600 }) => {
    const [nodes, setNodes] = useState<NodeWithPosition[]>([]);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [highlightedType, setHighlightedType] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const isDraggingRef = useRef(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const workerRef = useRef<Worker | null>(null);

    const { nodes: graphNodes, edges: graphEdges } = graphData || { nodes: [], edges: [] };

    const { neighbors, degrees } = useMemo(() => {
        const adg = new Map<string, Set<string>>();
        const deg = new Map<string, number>();
        if (!graphEdges || !graphNodes) return { neighbors: adg, degrees: deg };

        graphNodes.forEach(node => {
            adg.set(node.id, new Set());
            deg.set(node.id, 0);
        });
        graphEdges.forEach(edge => {
            adg.get(edge.from)?.add(edge.to);
            adg.get(edge.to)?.add(edge.from);
            deg.set(edge.from, (deg.get(edge.from) || 0) + 1);
            deg.set(edge.to, (deg.get(edge.to) || 0) + 1);
        });
        return { neighbors: adg, degrees: deg };
    }, [graphNodes, graphEdges]);
    
    const getNodeRadius = useCallback((nodeId: string) => 8 + Math.log2((degrees.get(nodeId) || 0) + 1) * 2.5, [degrees]);

    // Effect for managing the Web Worker lifecycle
    useEffect(() => {
        const worker = new Worker(new URL('../../services/networkWorker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;

        worker.onmessage = (event: MessageEvent) => {
            if (event.data.type === 'tick') {
                const workerNodes: {id: string, x: number, y: number}[] = event.data.nodes;
                setNodes(prevNodes => {
                    const nodeMap = new Map(workerNodes.map(n => [n.id, {x: n.x, y: n.y}]));
                    return prevNodes.map(p => ({...p, ...nodeMap.get(p.id)}));
                });
            }
        };

        if (graphNodes && graphEdges) {
            const initialNodes = graphNodes.map(n => ({
                ...n,
                radius: getNodeRadius(n.id)
            }));
            setNodes(initialNodes.map(n => ({...n, x: Math.random() * width, y: Math.random() * height})));
            worker.postMessage({
                type: 'init',
                payload: {
                    nodes: initialNodes,
                    edges: graphEdges,
                    width: width,
                    height: height,
                },
            });
        }

        return () => {
            worker.postMessage({ type: 'stop' });
            worker.terminate();
            workerRef.current = null;
        };
    }, [graphData, width, height, getNodeRadius]); // Re-create worker if data changes


    const getSVGPoint = useCallback((e: React.MouseEvent | MouseEvent) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (ctm) {
            return pt.matrixTransform(ctm.inverse());
        }
        return { x: 0, y: 0 };
    }, []);

    const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setDraggedNodeId(nodeId);
        isDraggingRef.current = false;
        const { x, y } = getSVGPoint(e);
        dragStartPos.current = { x, y };
    }, [getSVGPoint]);
    
    const handleMouseUp = useCallback(() => {
        if (draggedNodeId) {
            if (!isDraggingRef.current) { // Click, not drag
                setFocusedNodeId(prev => prev === draggedNodeId ? null : draggedNodeId);
            }
            workerRef.current?.postMessage({
                type: 'dragend',
                payload: { id: draggedNodeId },
            });
        }
        setDraggedNodeId(null);
        isDraggingRef.current = false;
    }, [draggedNodeId]);

    const handleBackgroundClick = () => {
        setFocusedNodeId(null);
    };

    // Effect for handling mouse move for dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!draggedNodeId || !workerRef.current) return;
            
            isDraggingRef.current = true;
            const { x, y } = getSVGPoint(e);
            workerRef.current.postMessage({
                type: 'drag',
                payload: { id: draggedNodeId, x, y },
            });
        };

        const svgElement = svgRef.current;
        svgElement?.addEventListener('mousemove', handleMouseMove);
        svgElement?.addEventListener('mouseup', handleMouseUp);
        svgElement?.addEventListener('mouseleave', handleMouseUp);

        return () => {
            svgElement?.removeEventListener('mousemove', handleMouseMove);
            svgElement?.removeEventListener('mouseup', handleMouseUp);
            svgElement?.removeEventListener('mouseleave', handleMouseUp);
        };
    }, [draggedNodeId, getSVGPoint, handleMouseUp]);

    const orderedNodes = useMemo(() => {
        if (!focusedNodeId) return nodes;
        const focused = nodes.find(n => n.id === focusedNodeId);
        return focused ? [...nodes.filter(n => n.id !== focusedNodeId), focused] : nodes;
    }, [nodes, focusedNodeId]);

    if (!graphNodes || !graphEdges || nodes.length === 0) {
        return <p className="text-center p-4">No network data available to display.</p>;
    }

    const isNodeFocused = focusedNodeId !== null;
    const focusedNeighbors = isNodeFocused ? neighbors.get(focusedNodeId!) : null;

    return (
        <div className="relative w-full">
            <div className="absolute top-2 left-2 flex flex-wrap gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-lg z-10">
                {Object.entries(nodeColors).map(([type, color]) => (
                    <button 
                        key={type}
                        onClick={() => setHighlightedType(prev => prev === type ? null : type)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 border-2 ${highlightedType === type ? 'shadow-lg scale-110' : 'opacity-70 hover:opacity-100'}`}
                        style={{
                            backgroundColor: `${color}40`,
                            borderColor: highlightedType === type ? color : 'transparent',
                            color: 'white'
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-transparent rounded-lg cursor-grab" onClick={handleBackgroundClick}>
                <defs>
                    <radialGradient id="svg-bg-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{stopColor: '#343a40'}} />
                        <stop offset="100%" style={{stopColor: '#212529'}} />
                    </radialGradient>
                    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5A6578" />
                    </marker>
                    <marker id="arrow-highlight" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#F58220" />
                    </marker>
                    <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
                         <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                </defs>
                <rect width={width} height={height} fill="url(#svg-bg-gradient)" />
                {graphEdges.map((edge: any) => {
                    const source = nodes.find((n: any) => n.id === edge.from);
                    const target = nodes.find((n: any) => n.id === edge.to);
                    if (!source || !target) return null;

                    const isEdgeFocused = isNodeFocused && (focusedNodeId === source.id || focusedNodeId === target.id);
                    const isDimmed = (isNodeFocused && !isEdgeFocused) || (highlightedType && (source.type !== highlightedType && target.type !== highlightedType));

                    return (
                        <g key={`edge-${edge.from}-${edge.to}`} className={`transition-opacity duration-300 ${isDimmed ? 'opacity-10' : 'opacity-80'}`} style={{ pointerEvents: 'none' }}>
                            <line
                                x1={source.x} y1={source.y}
                                x2={target.x} y2={target.y}
                                stroke={isEdgeFocused ? '#F58220' : '#5A6578'}
                                strokeWidth={isEdgeFocused ? 2 : 1.5}
                                markerEnd={isEdgeFocused ? 'url(#arrow-highlight)' : 'url(#arrow)'}
                            />
                             <text
                                x={(source.x + target.x) / 2}
                                y={(source.y + target.y) / 2}
                                fill={isEdgeFocused ? '#fff' : '#A0AEC0'}
                                fontSize="9"
                                textAnchor="middle"
                                dy="-5"
                                className="font-semibold transition-colors"
                                paintOrder="stroke"
                                stroke="#212529"
                                strokeWidth="3px"
                                strokeLinejoin="round"
                            >
                                {edge.label}
                            </text>
                        </g>
                    );
                })}
                {orderedNodes.map((node: NodeWithPosition) => {
                    const isNodeHovered = hoveredNodeId === node.id;
                    const isFocused = focusedNodeId === node.id;
                    const isNeighbor = focusedNeighbors?.has(node.id);
                    const isDimmed = (isNodeFocused && !isFocused && !isNeighbor) || (highlightedType && node.type !== highlightedType);
                    const showLabel = isFocused || isNodeHovered;
                    
                    return (
                        <g
                            key={`node-g-${node.id}`}
                            transform={`translate(${node.x}, ${node.y})`}
                            className={`transition-opacity duration-300 ${draggedNodeId === node.id ? 'cursor-grabbing' : 'cursor-pointer'}`}
                            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                            onMouseEnter={() => setHoveredNodeId(node.id)}
                            onMouseLeave={() => setHoveredNodeId(null)}
                            onClick={(e) => e.stopPropagation()}
                            onMouseUp={handleMouseUp}
                        >
                            <circle
                                r={node.radius}
                                fill={nodeColors[node.type] || '#A0AEC0'}
                                strokeWidth={isFocused ? 3 : 2}
                                stroke={isFocused || isNodeHovered ? '#F58220' : '#2D3748'}
                                className={`transition-all duration-200 ${isDimmed ? 'opacity-10' : 'opacity-100'}`}
                                style={{ filter: 'url(#node-shadow)' }}
                            />
                            {(showLabel || !isNodeFocused) && (
                                <text
                                    y={-node.radius - 5}
                                    fill="white"
                                    fontSize={isFocused ? 14 : 12}
                                    textAnchor="middle"
                                    className={`font-bold transition-all duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'} ${!showLabel && 'opacity-70'}`}
                                    paintOrder="stroke"
                                    stroke="#212529"
                                    strokeWidth={showLabel ? "5px" : "4px"}
                                    strokeLinejoin="round"
                                >
                                    {node.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default NetworkGraph;