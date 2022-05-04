import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";
import { keyBy, omit } from "lodash";

import { Dataset, FiltersState } from "../types";

export interface GraphDataControllerProps { 
  dataset: Dataset; 
  filters: FiltersState;
}

export const GraphDataController: FC<GraphDataControllerProps> = ({ dataset, filters, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  useEffect(() => {
    if (!graph || !dataset) return;

    const clusters = keyBy(dataset.clusters, "key");

    dataset.nodes.forEach((node) =>
      graph.addNode(node.key, {
        ...node,
        ...omit(clusters[node.cluster], "key"),
      }),
    );
    dataset.edges.forEach(([source, target]) => graph.addEdge(source, target, { size: 1 }));

    return () => graph.clear();
  }, [graph, dataset]);

  useEffect(() => {
    const { clusters } = filters;
    graph.forEachNode((node, { cluster }) => {
      graph.setNodeAttribute(node, "hidden", !clusters[cluster]);
    });
  }, [graph, filters]);

  return <>{children}</>;
};
