// services/networkWorker.ts

// This script runs in a separate thread and handles the physics simulation for the graph.

interface NetworkNode {
    id: string;
    label: string;
    type: string;
    stance?: 'Pro' | 'Con' | 'Neutral';
    influenceLevel?: 'High' | 'Medium' | 'Low';
}

interface NodeWithPhysics extends NetworkNode {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    isDragged?: boolean;
    fx?: number;
    fy?: number;
}

interface NetworkEdge {
    from: string;
    to: string;
    label: string;
}

let nodes: NodeWithPhysics[] = [];
let edges: NetworkEdge[] = [];
let width = 800;
let height = 600;
let animationFrameId: number | null = null;

// Simulation constants
const K_REPEL = -6000;
const K_ATTRACT = 0.05;
const DAMPING = 0.95;
const CENTER_GRAVITY = 0.0008;
const COLLISION_STRENGTH = 0.7;

function simulationLoop() {
    if (nodes.length === 0) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
    }
    
    // Reset forces
    for (const node of nodes) {
        node.fx = 0;
        node.fy = 0;
    }

    // Calculate repulsion forces
    for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            let distSq = dx * dx + dy * dy;
            if (distSq === 0) {
                distSq = 0.1; // Prevent division by zero
            }
            if (distSq < 100000) { // Optimization: only calculate for nearby nodes
                const force = K_REPEL / distSq;
                const forceX = (dx / Math.sqrt(distSq)) * force;
                const forceY = (dy / Math.sqrt(distSq)) * force;
                n1.fx += forceX;
                n1.fy += forceY;
                n2.fx -= forceX;
                n2.fy -= forceY;
            }
        }
    }

    // Calculate attraction forces for edges
    for (const edge of edges) {
        const source = nodes.find(n => n.id === edge.from);
        const target = nodes.find(n => n.id === edge.to);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const force = K_ATTRACT * (dist - 150); // Ideal edge length 150
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            source.fx += fx;
            source.fy += fy;
            target.fx -= fx;
            target.fy -= fy;
        }
    }

    // Apply center gravity
    for (const node of nodes) {
        const dx = width / 2 - node.x;
        const dy = height / 2 - node.y;
        node.fx += dx * CENTER_GRAVITY;
        node.fy += dy * CENTER_GRAVITY;
    }

    // Update positions
    for (const node of nodes) {
        if (node.isDragged) continue;
        node.vx = (node.vx + (node.fx || 0)) * DAMPING;
        node.vy = (node.vy + (node.fy || 0)) * DAMPING;
        node.x += node.vx;
        node.y += node.vy;
    }

    // Collision detection
    for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const min_dist = n1.radius + n2.radius;
            if (dist < min_dist) {
                const overlap = (min_dist - dist) / dist * COLLISION_STRENGTH;
                const fx = dx * overlap;
                const fy = dy * overlap;
                if(!n1.isDragged) { n1.x -= fx; n1.y -= fy; }
                if(!n2.isDragged) { n2.x += fx; n2.y += fy; }
            }
        }
    }

    // Boundary collision
    for (const node of nodes) {
        node.x = Math.max(node.radius + 10, Math.min(width - node.radius - 10, node.x));
        node.y = Math.max(node.radius + 10, Math.min(height - node.radius - 10, node.y));
    }

    // Send updated node positions back to the main thread
    // We send a stripped-down version for performance
    const positions = nodes.map(n => ({ id: n.id, x: n.x, y: n.y }));
    self.postMessage({ type: 'tick', nodes: positions });

    animationFrameId = requestAnimationFrame(simulationLoop);
}

self.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'init':
            nodes = payload.nodes.map((n: any) => ({
                ...n,
                x: Math.random() * payload.width,
                y: Math.random() * payload.height,
                vx: 0,
                vy: 0,
            }));
            edges = payload.edges;
            width = payload.width;
            height = payload.height;

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            simulationLoop();
            break;
        
        case 'drag':
            const draggedNode = nodes.find(n => n.id === payload.id);
            if(draggedNode) {
                draggedNode.x = payload.x;
                draggedNode.y = payload.y;
                draggedNode.vx = 0;
                draggedNode.vy = 0;
                draggedNode.isDragged = true;
            }
            break;

        case 'dragend':
            const releasedNode = nodes.find(n => n.id === payload.id);
            if(releasedNode) {
                 releasedNode.isDragged = false;
            }
            break;

        case 'stop':
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            break;
    }
};
