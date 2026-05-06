import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';

interface SankeyNode {
  nodeId: string;
  name: string;
  type: 'domain' | 'framework';
  value?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLink {
  source: string | any; // d3-sankey mutates this to be the full node object
  target: string | any; // d3-sankey mutates this to be the full node object
  value: number;
  width?: number;
}

interface SankeyProps {
  data: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
}

const EvidenceSankeyDiagram: React.FC<SankeyProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 350 });

  const domainColors = d3.scaleOrdinal([
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd' // Tableau10
  ]);
  
  const frameworkColors: Record<string, string> = {
    'PCI DSS': '#3b82f6', // blue-500
    'ISO 27001': '#10b981', // emerald-500
    'APAC Regulations': '#8b5cf6' // violet-500
  };

  const getColor = (d: SankeyNode) => {
    if (d.type === 'framework') {
      return frameworkColors[d.name] || '#6b7280';
    }
    return domainColors(d.name);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: 350 });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !data.nodes.length) return;

    const { width, height } = dimensions;
    const margin = { top: 10, right: 150, bottom: 10, left: 150 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .html(''); // Clear previous renders

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const sankeyLayout = sankey<SankeyNode, SankeyLink>()
      .nodeId(d => d.nodeId)
      .nodeWidth(15)
      .nodePadding(15)
      .nodeAlign(sankeyJustify)
      .extent([[0, 0], [graphWidth, graphHeight]]);

    // Need to clone data to avoid mutation issues on re-renders
    const graphData = {
        nodes: data.nodes.map(d => ({...d})),
        links: data.links.map(d => ({...d}))
    };
    
    const { nodes, links } = sankeyLayout(graphData);

    // Links
    g.append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => {
          const color = d3.color(getColor(d.source));
          if (color) {
            color.opacity = 0.5;
            return color.toString();
          }
          return '#000';
      })
      .attr('stroke-width', d => Math.max(1, d.width || 0))
      .sort((a, b) => (b.width || 0) - (a.width || 0));

    // Nodes
    g.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0 || 0)
      .attr('y', d => d.y0 || 0)
      .attr('height', d => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
      .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', d => getColor(d));

    // Labels
    g.append('g')
      .style('font', '11px sans-serif')
      .style('fill', '#111827') // text-gray-900
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => (d.x0 || 0) < graphWidth / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6)
      .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 || 0) < graphWidth / 2 ? 'start' : 'end')
      .text(d => d.name)
      .append('tspan')
      .attr('fill-opacity', 0.7)
      .text(d => ` (${d.value?.toLocaleString()})`);

  }, [data, dimensions]);

  return (
    <div ref={containerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};
export default EvidenceSankeyDiagram;
