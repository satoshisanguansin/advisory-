import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { NetworkGraphData, NetworkNode } from '../../types';

interface NodeWithPosition extends NetworkNode {
    x: number;
    y: number;
    radius: number;
}

interface NetworkGraphProps {
    graphData: NetworkGraphData;
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

const NetworkGraph: React.FC<NetworkGraphProps> = ({ graphData }) => {
    const [nodes, setNodes] = useState<NodeWithPosition[]>([]);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [highlightedType, setHighlightedType] = useState<string | null>(null);
    
    // State for pan and zoom
    const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });

    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const isDraggingNode = useRef(false);
    const isPanning = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

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

    useEffect(() => {
        const worker = new Worker(new URL('../../services/networkWorker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;
        const width = containerRef.current?.clientWidth || 800;
        const height = containerRef.current?.clientHeight || 600;

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
    }, [graphData, getNodeRadius]);

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
        isDraggingNode.current = false;
    }, []);

    const handleBackgroundMouseDown = (e: React.MouseEvent) => {
        isPanning.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = useCallback(() => {
        if (draggedNodeId) {
            if (!isDraggingNode.current) { // Click, not drag
                setFocusedNodeId(prev => prev === draggedNodeId ? null : draggedNodeId);
            }
            workerRef.current?.postMessage({
                type: 'dragend',
                payload: { id: draggedNodeId },
            });
        }
        setDraggedNodeId(null);
        isDraggingNode.current = false;
        isPanning.current = false;
    }, [draggedNodeId]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (draggedNodeId) {
            isDraggingNode.current = true;
            const { x, y } = getSVGPoint(e);
            workerRef.current?.postMessage({
                type: 'drag',
                payload: { id: draggedNodeId, x, y },
            });
        } else if (isPanning.current) {
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
            lastPos.current = { x: e.clientX, y: e.clientY };
        }
    }, [draggedNodeId, getSVGPoint]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const svg = svgRef.current;
        if (!svg) return;
        
        const { x, y } = getSVGPoint(e);
        const scaleFactor = 1.1;
        const newScale = e.deltaY < 0 ? transform.k * scaleFactor : transform.k / scaleFactor;
        
        setTransform({
            k: newScale,
            x: x - (x - transform.x) * (newScale / transform.k),
            y: y - (y - transform.y) * (newScale / transform.k),
        });
    };

    useEffect(() => {
        const svgElement = svgRef.current;
        svgElement?.addEventListener('mousemove', handleMouseMove);
        svgElement?.addEventListener('mouseup', handleMouseUp);
        svgElement?.addEventListener('mouseleave', handleMouseUp);
        return () => {
            svgElement?.removeEventListener('mousemove', handleMouseMove);
            svgElement?.removeEventListener('mouseup', handleMouseUp);
            svgElement?.removeEventListener('mouseleave', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);


    if (!graphNodes || !graphEdges || nodes.length === 0) {
        return <p className="text-center p-4">No network data available to display.</p>;
    }

    const isNodeFocused = focusedNodeId !== null;
    const focusedNeighbors = isNodeFocused ? neighbors.get(focusedNodeId!) : null;

    return (
        <div ref={containerRef} className="relative w-full h-[600px] bg-zinc-800/30 rounded-lg overflow-hidden">
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
                        aria-label={`Highlight ${type} nodes`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <svg 
                ref={svgRef} 
                className={`w-full h-full cursor-grab ${isPanning.current ? 'cursor-grabbing' : ''}`}
                onWheel={handleWheel}
                onMouseDown={handleBackgroundMouseDown}
                aria-label="Interactive network graph of stakeholders"
            >
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
                </defs>
                <rect width="100%" height="100%" fill="url(#svg-bg-gradient)" onClick={() => setFocusedNodeId(null)} />
                <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
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
                                    strokeWidth={isEdgeFocused ? 2 / transform.k : 1.5 / transform.k}
                                    markerEnd={isEdgeFocused ? 'url(#arrow-highlight)' : 'url(#arrow)'}
                                />
                            </g>
                        );
                    })}
                    {nodes.map((node: NodeWithPosition) => {
                        const isNodeHovered = hoveredNodeId === node.id;
                        const isFocused = focusedNodeId === node.id;
                        const isNeighbor = focusedNeighbors?.has(node.id);
                        const isDimmed = (isNodeFocused && !isFocused && !isNeighbor) || (highlightedType && node.type !== highlightedType);
                        
                        return (
                            <g
                                key={`node-g-${node.id}`}
                                transform={`translate(${node.x}, ${node.y})`}
                                className={`${draggedNodeId === node.id ? 'cursor-grabbing' : 'cursor-pointer'}`}
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onMouseEnter={() => setHoveredNodeId(node.id)}
                                onMouseLeave={() => setHoveredNodeId(null)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <circle
                                    r={node.radius / transform.k}
                                    fill={nodeColors[node.type] || '#A0AEC0'}
                                    strokeWidth={(isFocused ? 3 : 2) / transform.k}
                                    stroke={isFocused || isNodeHovered ? '#F58220' : '#2D3748'}
                                    className={`transition-all duration-200 ${isDimmed ? 'opacity-10' : 'opacity-100'}`}
                                />
                                <text
                                    y={-(node.radius / transform.k) - 5}
                                    fill="white"
                                    fontSize={12 / transform.k}
                                    textAnchor="middle"
                                    className={`font-bold transition-opacity duration-300 ${isDimmed || (!isFocused && !isNodeHovered) ? 'opacity-0' : 'opacity-100'}`}
                                    paintOrder="stroke"
                                    stroke="#212529"
                                    strokeWidth={`${5 / transform.k}px`}
                                    strokeLinejoin="round"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default NetworkGraph;