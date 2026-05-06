import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
import type { SankeyNode, SankeyLink, Framework } from '../types';

interface SankeyProps {
  data: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
}

const frameworkColors: Record<Framework, string> = {
  PCI: '#3b82f6', // blue-500
  NIST: '#8b5cf6', // violet-500
  ISO: '#10b981', // emerald-500
};

const SankeyDiagram: React.FC<SankeyProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: 450 });
      }
    });

    if (svgRef.current?.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 150, bottom: 20, left: 150 };
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
      .nodePadding(12)
      .nodeAlign(sankeyJustify)
      .extent([[0, 0], [graphWidth, graphHeight]]);

    const { nodes, links } = sankeyLayout(data);

    // Links
    const link = g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
      .selectAll('g')
      .data(links)
      .join('g')
      .style('mix-blend-mode', 'multiply');

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    link.append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => d3.color(frameworkColors[d.source.framework])?.brighter(0.8) as any)
      .attr('stroke-width', d => Math.max(1, d.width || 0));

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);
    
    link.on('mouseover', (event, d) => {
        d3.select(event.currentTarget).select('path').transition().duration(200).attr('stroke-opacity', 0.8);
        tooltip.style('opacity', 1)
               .html(`<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/><em>${d.description}</em>`)
               .style('left', `${event.pageX + 15}px`)
               .style('top', `${event.pageY}px`);
    }).on('mouseout', (event) => {
        d3.select(event.currentTarget).select('path').transition().duration(200).attr('stroke-opacity', 0.5);
        tooltip.style('opacity', 0);
    });

    // Nodes
    const node = g.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0 || 0)
      .attr('y', d => d.y0 || 0)
      .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', d => frameworkColors[d.framework])
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d) => {
        svg.selectAll('path')
          .filter((l: any) => l.source.nodeId !== d.nodeId && l.target.nodeId !== d.nodeId)
          .transition().duration(200)
          .attr('stroke-opacity', 0.1);
      })
      .on('mouseout', () => {
        svg.selectAll('path')
          .transition().duration(200)
          .attr('stroke-opacity', 0.5);
      });

    // Labels
    g.append('g')
      .style('font', '10px sans-serif')
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
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '250px',
          transition: 'opacity 0.2s',
        }}
      ></div>
    </div>
  );
};

export default SankeyDiagram;