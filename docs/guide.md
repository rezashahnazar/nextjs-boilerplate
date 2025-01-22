# AI Agent Flow Framework

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites & Assumptions](#prerequisites--assumptions)
3. [Key Features & Goals](#key-features--goals)
4. [High-Level Architecture](#high-level-architecture)
5. [Detailed Design & Core Components](#detailed-design--core-components)
   1. [Flow Definition](#51-flow-definition)
   2. [Node Types](#52-node-types)
   3. [Flow Execution State](#53-flow-execution-state)
   4. [Flow Execution Manager](#54-flow-execution-manager)
   5. [Concurrency & Parallel Execution](#55-concurrency--parallel-execution)
6. [Data Streaming & SSE Integration](#data-streaming--sse-integration)
7. [Retries, Timeouts, and Error Handling](#retries-timeouts-and-error-handling)
8. [Persistence, Scalability & Resilience](#persistence-scalability--resilience)
   1. [Example: Redis Integration](#81-example-redis-integration)
9. [Security & Access Control](#security--access-control)
10. [Observability & Logging](#observability--logging)
11. [Additional Considerations](#additional-considerations)
    1. [Human-in-the-Loop Steps](#111-human-in-the-loop-steps)
    2. [Structured Outputs & Tool Calls](#112-structured-outputs--tool-calls)
    3. [Cost & Rate Limiting](#113-cost--rate-limiting)
    4. [Large State Objects](#114-large-state-objects)
    5. [Local Debugging & CLI Options](#115-local-debugging--cli-options)
    6. [Edge Runtime vs. Node.js Environment](#116-edge-runtime-vs-nodejs-environment)
12. [Sample Real-Life Use Cases](#sample-real-life-use-cases)
13. [Complete Framework Implementation](#complete-framework-implementation)
    1. [1. Flow Schema & Node Definitions](#131-flow-schema--node-definitions)
    2. [2. Flow Execution Manager](#132-flow-execution-manager)
    3. [3. Example Next.js Application](#133-example-nextjs-application)
       1. [3.1 API Routes](#1331-api-routes)
       2. [3.2 Client-Side Demo Page](#1332-client-side-demo-page)
14. [Conclusion & Next Steps](#conclusion--next-steps)

---

## 1. Overview

This **AI Agent Flow Framework** aims to orchestrate **multi-step AI workflows** on top of the **Vercel AI SDK**. It addresses common challenges such as:

- Complex branching and parallelization.
- Tool calls and structured outputs.
- Human-in-the-loop approvals (flow pausing and resuming).
- Retries, error handling, and timeouts.
- Partial data streaming to the client (SSE).
- Persistence and scalability for production environments.

By defining **nodes** in a **flow graph** (Agent, Branch, Parallel, Human, Wait, Loop, etc.), developers can compose advanced AI-driven processes—ranging from a few steps to large enterprise workflows.

---

## 2. Prerequisites & Assumptions

1. **Familiarity with the Vercel AI SDK** – Understanding how `generateText`, `streamText`, tool calling, and structured outputs work.
2. **Next.js 13+** – The examples use Next.js App Router endpoints (`app/api/...`) and React server/client components.
3. **Node.js Environment** – We assume that the environment can run Node.js or is closely compatible (e.g., Node-based serverless).
4. **SSE Support** – SSE (Server-Sent Events) is used for partial data streaming. On some serverless platforms, you may need to confirm SSE support or a fallback.
5. **Basic Database or Redis knowledge** – For production, ephemeral in-memory storage must be replaced with a persistent store (examples provided).

---

## 3. Key Features & Goals

1. **Node-Based Workflow**  
   Each step is encapsulated as a **node** in a directed graph:

   - **AgentNode** calls an LLM.
   - **BranchNode** handles conditional logic.
   - **ParallelNode** spawns multiple nodes concurrently.
   - **HumanNode** pauses flow until user input is provided.
   - etc.

2. **Shared Flow State**  
   A single `flowState` object is carried across nodes, enabling them to share data and partial results.

3. **Partial Streaming (SSE)**  
   Leveraging the **Vercel AI SDK**, partial LLM tokens/deltas can be streamed to the client in real-time.

4. **Retries & Timeouts**  
   Each node can set a maximum retry count and define timeouts, ensuring robust error handling.

5. **Human-in-the-Loop**  
   The flow can pause on a **HumanNode**, awaiting external (user) input.

6. **Parallel Execution with Concurrency Limits**  
   Flows can run multiple nodes in parallel. Concurrency is capped globally or at the node level.

7. **Persistence & Scalability**  
   The framework can store flow states (active nodes, partial outputs, logs) in a persistent store like Redis or SQL DB. This enables horizontal scaling in production.

8. **Security Hooks**  
   Each execution can store an `ownerId` or `tenantId`. We can validate requests against user auth or tokens.

---

## 4. High-Level Architecture

Below is a simplified diagram showing how a **FlowDefinition**, **FlowExecutionManager**, and **FlowExecution** interact:

```
 ┌───────────────────────┐     ┌─────────────────────────────────────────┐
 │   FlowDefinition      │     │ FlowExecutionManager (in-memory or DB) │
 │ (Nodes & Graph Logic) │ <-- │  - Orchestrates Node Execution         │
 └─────────────┬─────────┘     └─────────────────────────────┬─────────┘
               │ Start Execution                              │
               │                                             │
               │                    ┌─────────────────────────▼───────────────────────┐
               │                    │FlowExecution (State + status + concurrency)    │
               │                    │ - status: running|paused|completed|failed      │
               │                    │ - activeNodes: string[]                         │
               │                    │ - flowState: { ... }                            │
               │                    └────────────┬────────────────────────────────────┘
               │                                 │ Node Execution
               │                                 ▼
               │                         ┌─────────────────┐
               └────────────────────────>│   NodeExecutor   │
                                         └─────────────────┘
```

1. Define a **FlowDefinition** with a list of **nodes**.
2. The **FlowExecutionManager** creates a **FlowExecution** (with unique ID).
3. The manager orchestrates the active nodes, concurrency, SSE streaming, etc.
4. **Nodes** update the `flowState`, branching to other nodes or pausing if needed.
5. When no further nodes are active (or an unhandled error occurs), the flow ends.

---

## 5. Detailed Design & Core Components

### 5.1 Flow Definition

A **FlowDefinition** includes:

- **id**: A unique string identifier.
- **startNode**: The ID of the first node to run.
- **nodes**: A list of typed node objects (`AgentNode`, `BranchNode`, etc.).
- **initialState**: Optional object with initial data or context.

### 5.2 Node Types

Below are the main node types supported:

1. **AgentNode**

   - Executes an LLM call via the Vercel AI SDK.
   - Can return results immediately (promise) or stream partial tokens (async generator).
   - Has `onSuccess` and `onError` transitions.

2. **BranchNode**

   - Contains an ordered list of `(condition, targetNode)`.
   - Evaluates each condition; if matched, adds `targetNode` to `activeNodes`.
   - If none match, goes to `default` if present.

3. **ParallelNode**

   - Spawns multiple child node executions simultaneously (up to a global or node-level concurrency limit).

4. **HumanNode**

   - Pauses execution with `status = 'paused'`.
   - Awaits a resume call, which typically includes user feedback in `flowState`.

5. **WaitNode**

   - Delays for `durationMs` or continuously polls a function `pollCondition`.
   - Commonly used for waiting on external events.

6. **LoopNode**
   - Repeatedly executes another node (`loopNodeId`) until `continueCondition` is false.
   - The sub-node’s results each iteration can be stored or aggregated.

### 5.3 Flow Execution State

A running flow has:

- **`flowState`**: A mutable record storing intermediate data, user inputs, or references to external objects.
- **`activeNodes`**: An array of node IDs currently queued for execution.
- **`status`**: `running`, `paused`, `completed`, or `failed`.
- **`attempts`**: A record of how many times each node has been retried.

### 5.4 Flow Execution Manager

Responsible for:

- **Orchestrating** the node queue and concurrency.
- **Launching** nodes in parallel or sequence.
- **Handling** timeouts, retries, and errors.
- **Streaming** partial LLM outputs via SSE.
- **Storing** and **retrieving** the flow state from a store (in-memory, DB, etc.).
- **Pausing** flows at Human nodes and resuming them upon user input.

### 5.5 Concurrency & Parallel Execution

- **ParallelNode** triggers multiple child nodes. Each child is pushed into `exec.activeNodes`.
- A **global concurrency** limit can be enforced in the manager’s main loop. If `globalMaxParallel = 3`, we only pick 3 from `activeNodes` at a time.
- This ensures we don’t exceed our LLM or system’s maximum concurrency capacity.
- In complex or large-scale deployments, you may push these node executions to a job queue (e.g., bullmq, RabbitMQ) to handle concurrency reliably across multiple servers.

---

## 6. Data Streaming & SSE Integration

1. **Async Generators** from the Vercel AI SDK or custom LLM calls stream partial tokens or chunks.
2. The manager intercepts these chunks and writes SSE messages:
   ```json
   {
     "type": "agentDelta",
     "nodeId": "agent1",
     "delta": "... partial token ..."
   }
   ```
3. The client listens on an SSE endpoint (e.g., `/api/flows/{id}/events`) and updates the UI in real-time.
4. When the node finishes, the manager emits a final “agentResult” SSE.

> **Note**: SSE can be sensitive in serverless environments due to function timeouts or streaming constraints. If SSE is not supported, you may adopt WebSockets or a polling strategy.

---

## 7. Retries, Timeouts, and Error Handling

- **Retries**: Each node can specify `maxRetries` and a `retryIf` function that checks the thrown error or result.
- **Timeouts**: A node-level `timeoutMs` can abort an LLM call or logic if it takes too long.
- **Error Handling**: On final error (exceeding retries), flow transitions to `failed` unless a fallback node (`onError`) is specified.

---

## 8. Persistence, Scalability & Resilience

In **production**:

1. **Persistent Store**

   - Maintain `FlowExecution` objects in a DB or Redis, not just in memory.
   - On server restart, you can resume flows by reloading from the store.

2. **Horizontal Scaling**

   - Use a distributed locking or queue system so two servers don’t pick up the same node execution.
   - Alternatively, store flows in a single job queue that processes tasks in FIFO or concurrency-limited manner.

3. **Cleanup & Idle Flows**
   - If a flow remains paused or idle for too long, you might mark it as expired, send notifications, or auto-cancel.

### 8.1 Example: Redis Integration

Below is a **pseudo-code** snippet for using Redis to store the `FlowExecution` and SSE data:

```ts
// Pseudo-code only, not complete:
import { createClient } from "redis";
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

function saveExecutionToRedis(exec: FlowExecution) {
  const key = `flowExec:${exec.executionId}`;
  return redis.set(key, JSON.stringify(exec));
}

async function loadExecutionFromRedis(
  executionId: string
): Promise<FlowExecution | null> {
  const data = await redis.get(`flowExec:${executionId}`);
  return data ? (JSON.parse(data) as FlowExecution) : null;
}

function deleteExecutionFromRedis(executionId: string) {
  return redis.del(`flowExec:${executionId}`);
}
```

- You’d replace all in-memory read/writes (`Map<string, FlowExecution>`) with these Redis calls.
- For SSE event states, you can store open connections in an in-memory map on each server, or also store them in a distributed pub-sub if you want cross-server event streaming.

---

## 9. Security & Access Control

- Attach an `ownerId` or `tenantId` to each `FlowExecution`.
- When the user connects to SSE or tries to resume a flow, validate that they own the execution.
- For ephemeral flows (where no user session is needed), you may store a temporary `executionToken` that must be included in the SSE or resume calls.

---

## 10. Observability & Logging

1. **Logs & Metrics**

   - `onNodeStart` / `onNodeFinish` / `onNodeError` hooks can push structured logs to a logging system.
   - You can gather usage metrics (like total tokens used, number of calls, etc.).

2. **External Monitoring**
   - Use solutions like Datadog, New Relic, or OpenTelemetry to gather traces and performance data.
   - Expose endpoints for collecting real-time flow statuses or logs.

---

## 11. Additional Considerations

### 11.1 Human-in-the-Loop Steps

- On a **HumanNode**, `status` becomes `paused`. The SSE sends a message that user input is required.
- The user then calls a `resume` endpoint with the relevant `nodeId` (and any feedback data).
- The manager updates `flowState` and sets `status = 'running'`, continuing execution.

### 11.2 Structured Outputs & Tool Calls

- The Vercel AI SDK can parse structured JSON from the LLM or automatically handle function/tool calls.
- Example:
  ```ts
  const schema = z.object({ name: z.string(), age: z.number() });
  const { object } = await generateObject({
    model: openai("gpt-4"),
    schema,
    prompt: "Give me name/age in JSON only.",
  });
  ```
- Agents can also call external tools like a search API. Node-level logic can handle these calls and incorporate results.

### 11.3 Cost & Rate Limiting

- Enforce daily usage budgets, track token usage.
- Rate limit certain node types if LLM calls can get expensive.

### 11.4 Large State Objects

- If the `flowState` becomes large (e.g., storing entire documents), you might store big blobs in S3 or a DB.
- Store references in `flowState` instead of the actual data to keep memory usage smaller.

### 11.5 Local Debugging & CLI Options

- You can build a small CLI tool or script that runs a flow definition locally, logs node transitions to the console, and helps debug or test.
- This can be especially helpful during development.

### 11.6 Edge Runtime vs. Node.js Environment

- This framework typically expects a Node.js environment (for SSE, setTimeout, streaming, etc.).
- Vercel’s Edge Runtime has constraints that may limit or complicate SSE or certain libraries.
- If Edge usage is required, test thoroughly or consider a fallback approach (e.g., queue + short-polling).

---

## 12. Sample Real-Life Use Cases

1. **Customer Support Workflow**

   - **HumanNode** for agent approvals.
   - **ParallelNode** for fetching data from multiple APIs simultaneously.
   - **BranchNode** for deciding if a question is shipping, billing, or technical.

2. **Document Generation & Approval**

   - **WaitNode** that polls for a finished external data fetch.
   - **HumanNode** to finalize the text before sending to the user.
   - **AgentNode** to generate summaries or transformations.

3. **Data Processing with Loop**
   - **LoopNode** iterates over an array of items, calling an LLM per item.
   - **ParallelNode** within the loop for concurrency-limited batch processing.
   - **BranchNode** to handle edge cases differently.

---

## 13. Complete Framework Implementation

Below is a **full reference implementation** using TypeScript. For demonstration, it uses **in-memory** storage. In production, adapt it to your chosen database or Redis store.

### 13.1 Flow Schema & Node Definitions

```ts
// File: my-framework/flow-schema.ts

import { z } from "zod";

/** Base interface for any node. */
export interface BaseNode {
  id: string;
  label?: string;
  metadata?: Record<string, any>;

  // Transitions
  onSuccess?: string | null;
  onError?: string | null;

  // Retries
  maxRetries?: number;
  retryIf?: (errorOrResult: any) => boolean;

  // Timeouts
  timeoutMs?: number;

  // Adapters
  inputAdapter?: (flowState: Record<string, any>) => any;
  outputAdapter?: (nodeResult: any, flowState: Record<string, any>) => void;
}

/** Agent node calls LLM or multi-step logic. */
export interface AgentNode extends BaseNode {
  type: "agent";
  executeLLM: (input: any) => Promise<any> | AsyncGenerator<string, void, void>;
}

/** Branch node picks next node based on conditions. */
export interface BranchCase {
  condition: (flowState: Record<string, any>) => boolean;
  targetNode: string;
}
export interface BranchNode extends BaseNode {
  type: "branch";
  cases: BranchCase[];
  default?: string | null;
}

/** Parallel node runs multiple children concurrently. */
export interface ParallelNode extends BaseNode {
  type: "parallel";
  children: string[];
  maxConcurrency?: number; // override global concurrency if desired
}

/** Human node: requires user input to resume. */
export interface HumanNode extends BaseNode {
  type: "human";
  message: string;
}

/** Wait node: timed or condition-based delay. */
export interface WaitNode extends BaseNode {
  type: "wait";
  durationMs?: number;
  pollCondition?: (flowState: Record<string, any>) => Promise<boolean>;
}

/** Loop node: repeats a sub-node until condition fails. */
export interface LoopNode extends BaseNode {
  type: "loop";
  loopNodeId: string;
  continueCondition: (flowState: Record<string, any>) => boolean;
}

/** Union of all node types. */
export type FlowNode =
  | AgentNode
  | BranchNode
  | ParallelNode
  | HumanNode
  | WaitNode
  | LoopNode;

/** Full definition of a flow graph. */
export interface FlowDefinition {
  id: string;
  startNode: string;
  nodes: FlowNode[];
  initialState?: Record<string, any>;
}
```

### 13.2 Flow Execution Manager

```ts
// File: my-framework/flow-execution.ts

import {
  FlowDefinition,
  FlowNode,
  AgentNode,
  BranchNode,
  ParallelNode,
  HumanNode,
  WaitNode,
  LoopNode,
} from "./flow-schema";
import { StreamData } from "ai"; // from Vercel AI SDK

export type FlowStatus = "running" | "paused" | "completed" | "failed";

export interface FlowExecution {
  executionId: string;
  definition: FlowDefinition;
  status: FlowStatus;
  flowState: Record<string, any>;
  activeNodes: string[];
  attempts: Record<string, number>;
  ownerId?: string; // optional for security use
}

/** In-memory store for demonstration. Replace with DB or Redis in production. */
const executionStore = new Map<string, FlowExecution>();
/** SSE store: each execution ID -> SSE object. */
const sseStore = new Map<string, StreamData>();

export interface FlowManagerConfig {
  globalMaxParallel?: number;
  onNodeStart?: (exec: FlowExecution, nodeId: string) => void;
  onNodeFinish?: (exec: FlowExecution, nodeId: string, result: any) => void;
  onNodeError?: (exec: FlowExecution, nodeId: string, error: any) => void;
  onFlowComplete?: (exec: FlowExecution) => void;
  onFlowPause?: (exec: FlowExecution, nodeId: string) => void;
}

export class FlowExecutionManager {
  private config: FlowManagerConfig;

  constructor(config?: FlowManagerConfig) {
    this.config = config || {};
  }

  /**
   * Creates a new flow execution from a given definition.
   * (Optional) ownerId for security contexts.
   */
  public createExecution(def: FlowDefinition, ownerId?: string): FlowExecution {
    const executionId = "exec-" + Math.floor(Math.random() * 1e8);
    const exec: FlowExecution = {
      executionId,
      definition: def,
      status: "running",
      flowState: { ...def.initialState },
      activeNodes: [def.startNode],
      attempts: {},
      ownerId,
    };
    executionStore.set(executionId, exec);

    // Create a new SSE object for partial streaming
    const dataStream = new StreamData();
    sseStore.set(executionId, dataStream);

    // Start the flow execution asynchronously
    this.runFlow(exec).catch((err) => {
      this.markFailed(exec, err);
    });

    return exec;
  }

  /**
   * Retrieves the FlowExecution object from store. (Production: use DB/Redis)
   */
  public getExecution(executionId: string): FlowExecution | undefined {
    return executionStore.get(executionId);
  }

  /**
   * Retrieves the SSE StreamData for the given execution ID.
   */
  public getSSE(executionId: string): StreamData | undefined {
    return sseStore.get(executionId);
  }

  /**
   * Resume a paused flow at a specific HumanNode with user-provided input.
   */
  public async resume(executionId: string, nodeId: string, userInput: any) {
    const exec = this.getExecution(executionId);
    if (!exec) {
      throw new Error(`Flow not found: ${executionId}`);
    }
    if (exec.status !== "paused") {
      throw new Error(`Flow is not paused. Current status=${exec.status}`);
    }

    // Put user input into flowState under the nodeId or a custom key
    exec.flowState[nodeId] = userInput;

    // Set status back to running
    exec.status = "running";
    // Continue execution
    await this.runFlow(exec);
  }

  /**
   * Core driver: repeatedly consume activeNodes (up to concurrency) until flow completes.
   */
  private async runFlow(exec: FlowExecution): Promise<void> {
    while (exec.status === "running" && exec.activeNodes.length > 0) {
      const concurrency = this.config.globalMaxParallel ?? 2;
      // Slice up to concurrency items from activeNodes
      const slice = exec.activeNodes.splice(0, concurrency);

      // Execute them in parallel
      await Promise.all(slice.map((nodeId) => this.runNode(exec, nodeId)));
    }

    // If no active nodes left and still 'running', mark as completed
    if (exec.status === "running" && exec.activeNodes.length === 0) {
      exec.status = "completed";
      this.config.onFlowComplete?.(exec);
      // Close SSE
      const ds = sseStore.get(exec.executionId);
      ds?.close();
    }
  }

  /**
   * Executes a single node, handling retries, timeouts, success/error transitions.
   */
  private async runNode(exec: FlowExecution, nodeId: string) {
    const node = exec.definition.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }
    this.config.onNodeStart?.(exec, nodeId);

    const attemptsSoFar = exec.attempts[nodeId] || 0;
    if (attemptsSoFar > (node.maxRetries ?? 0)) {
      // Exhausted retries
      if (node.onError) {
        exec.activeNodes.push(node.onError);
      } else {
        this.markFailed(exec, new Error(`Node ${nodeId} exhausted retries.`));
      }
      return;
    }
    exec.attempts[nodeId] = attemptsSoFar + 1;

    // Prepare input
    const input = node.inputAdapter
      ? node.inputAdapter(exec.flowState)
      : { ...exec.flowState };

    // SSE reference
    const ds = sseStore.get(exec.executionId);

    let timeoutRef: NodeJS.Timeout | null = null;
    let timedOut = false;

    try {
      // If there's a timeout, race the node execution vs. a timeout promise
      if (node.timeoutMs) {
        await Promise.race([
          (async () => {
            const result = await this.executeNode(exec, node, input, ds);
            if (!timedOut) {
              this.onNodeSuccess(exec, node, result);
            }
          })(),
          new Promise((_, reject) => {
            timeoutRef = setTimeout(() => {
              timedOut = true;
              reject(new Error(`Node ${nodeId} timed out.`));
            }, node.timeoutMs);
          }),
        ]);
      } else {
        // No timeout, just execute
        const result = await this.executeNode(exec, node, input, ds);
        this.onNodeSuccess(exec, node, result);
      }
    } catch (err) {
      if (timeoutRef) clearTimeout(timeoutRef);
      this.onNodeError(exec, node, err);
    } finally {
      if (timeoutRef) clearTimeout(timeoutRef);
    }
  }

  /**
   * Called when a node completes successfully.
   */
  private onNodeSuccess(exec: FlowExecution, node: FlowNode, result: any) {
    // If there's an output adapter, let it update flowState
    if (node.outputAdapter) {
      node.outputAdapter(result, exec.flowState);
    } else {
      exec.flowState[node.id] = result;
    }
    this.config.onNodeFinish?.(exec, node.id, result);

    // Move to onSuccess node if specified
    if (node.onSuccess) {
      exec.activeNodes.push(node.onSuccess);
    }
  }

  /**
   * Called when a node fails or throws error.
   */
  private onNodeError(exec: FlowExecution, node: FlowNode, err: any) {
    this.config.onNodeError?.(exec, node.id, err);

    // If the node has a custom retryIf function, check if we should retry
    if (node.retryIf && node.retryIf(err)) {
      exec.activeNodes.push(node.id);
      return;
    }

    // Otherwise, if there's an onError node, push that
    if (node.onError) {
      exec.activeNodes.push(node.onError);
      return;
    }

    // Else mark the entire flow as failed
    this.markFailed(exec, err);
  }

  /**
   * Mark the flow as failed and close SSE.
   */
  private markFailed(exec: FlowExecution, err: any) {
    exec.status = "failed";
    const ds = sseStore.get(exec.executionId);
    ds?.writeError(err);
    ds?.close();
  }

  /**
   * Execute the actual node logic based on its type.
   */
  private async executeNode(
    exec: FlowExecution,
    node: FlowNode,
    input: any,
    ds?: StreamData
  ): Promise<any> {
    switch (node.type) {
      case "agent":
        return await this.executeAgentNode(node, input, ds);
      case "branch":
        return this.executeBranchNode(exec, node as BranchNode);
      case "parallel":
        return this.executeParallelNode(exec, node as ParallelNode);
      case "human":
        return this.executeHumanNode(exec, node as HumanNode, ds);
      case "wait":
        return this.executeWaitNode(node as WaitNode);
      case "loop":
        return this.executeLoopNode(exec, node as LoopNode, ds);
      default:
        throw new Error(`Unsupported node type: ${(node as any).type}`);
    }
  }

  /**
   * AgentNode logic: can handle streaming or immediate responses.
   */
  private async executeAgentNode(
    node: AgentNode,
    input: any,
    ds?: StreamData
  ): Promise<string> {
    const resultOrGen = node.executeLLM(input);

    // If it's an async generator, stream partial tokens
    if (isAsyncGenerator(resultOrGen)) {
      let finalText = "";
      for await (const chunk of resultOrGen) {
        finalText += chunk;
        ds?.writeData({
          type: "agentDelta",
          nodeId: node.id,
          delta: chunk,
        });
      }
      ds?.writeData({
        type: "agentResult",
        nodeId: node.id,
        content: finalText,
      });
      return finalText;
    } else {
      // Otherwise, it's a Promise returning the entire text
      const result = await resultOrGen;
      ds?.writeData({
        type: "agentResult",
        nodeId: node.id,
        content: result,
      });
      return result;
    }
  }

  /**
   * BranchNode: check each condition in order, push the first match into activeNodes.
   */
  private executeBranchNode(exec: FlowExecution, node: BranchNode) {
    for (const c of node.cases) {
      if (c.condition(exec.flowState)) {
        exec.activeNodes.push(c.targetNode);
        return null;
      }
    }
    if (node.default) {
      exec.activeNodes.push(node.default);
    }
    return null;
  }

  /**
   * ParallelNode: push all children to the activeNodes queue at once.
   * Note that concurrency is still capped globally in runFlow().
   */
  private executeParallelNode(exec: FlowExecution, node: ParallelNode) {
    node.children.forEach((childId) => {
      exec.activeNodes.push(childId);
    });
    return null;
  }

  /**
   * HumanNode: set flow to paused, notify SSE, wait for user input via resume().
   */
  private executeHumanNode(
    exec: FlowExecution,
    node: HumanNode,
    ds?: StreamData
  ) {
    exec.status = "paused";
    this.config.onFlowPause?.(exec, node.id);
    ds?.writeData({
      type: "human-prompt",
      nodeId: node.id,
      message: node.message,
    });
    return null;
  }

  /**
   * WaitNode: either wait for durationMs or poll a condition function.
   */
  private async executeWaitNode(node: WaitNode) {
    if (node.durationMs) {
      await new Promise((resolve) => setTimeout(resolve, node.durationMs));
    }
    if (node.pollCondition) {
      while (true) {
        const done = await node.pollCondition({});
        if (done) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return null;
  }

  /**
   * LoopNode: executes a sub-node repeatedly until continueCondition is false.
   * This runs sequentially. For parallel loops, you might do something more advanced.
   */
  private async executeLoopNode(
    exec: FlowExecution,
    node: LoopNode,
    ds?: StreamData
  ) {
    while (node.continueCondition(exec.flowState)) {
      const subNode = exec.definition.nodes.find(
        (n) => n.id === node.loopNodeId
      );
      if (!subNode) {
        throw new Error(`Loop sub-node not found: ${node.loopNodeId}`);
      }
      // Prepare sub-node input
      const input = subNode.inputAdapter
        ? subNode.inputAdapter(exec.flowState)
        : { ...exec.flowState };
      await this.executeNode(exec, subNode, input, ds);
    }
    return null;
  }
}

/** Helper to detect async generators. */
function isAsyncGenerator(obj: any): obj is AsyncGenerator {
  return obj && typeof obj[Symbol.asyncIterator] === "function";
}
```

### 13.3 Example Next.js Application

Below is a **Next.js (13+ App Router)** application that demonstrates how to use the framework.  
It shows:

1. A **POST** route to **start** a new flow.
2. A **GET** route that provides **SSE** events.
3. A **resume** route to handle **HumanNode** steps.
4. A simple **client-side page** to start flows, connect SSE, and provide user feedback.

#### 13.3.1 API Routes

```ts
// File: app/api/flows/complex/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FlowDefinition } from "@/my-framework/flow-schema";
import { FlowExecutionManager } from "@/my-framework/flow-execution";
import { openai, streamText } from "ai"; // From Vercel AI SDK

// We create a single manager instance here.
// In production, you might keep it in a shared module or with DB-based store logic.
const manager = new FlowExecutionManager({
  globalMaxParallel: 3,
  onFlowComplete(exec) {
    console.log(
      `Flow [${exec.executionId}] completed. Final state:`,
      exec.flowState
    );
  },
  onNodeError(exec, nodeId, err) {
    console.error(`Node [${nodeId}] error:`, err);
  },
  onFlowPause(exec, nodeId) {
    console.log(`Flow [${exec.executionId}] paused at node [${nodeId}].`);
  },
});

/**
 * A sample flow definition to demonstrate multiple node types.
 */
const complexFlowDefinition: FlowDefinition = {
  id: "complexFlow",
  startNode: "agentIntro",
  initialState: {}, // Will be dynamically set at runtime
  nodes: [
    {
      id: "agentIntro",
      type: "agent",
      async executeLLM(input) {
        const userPrompt = input.userPrompt || "Hello default.";
        const { text } = await streamText({
          model: openai("gpt-3.5-turbo"),
          prompt: `You are a helpful planner. User's prompt: "${userPrompt}". Provide a short plan:`,
        });
        return text;
      },
      onSuccess: "branchCheck",
    },
    {
      id: "branchCheck",
      type: "branch",
      cases: [
        {
          condition: (st) => st.agentIntro?.includes("technical"),
          targetNode: "parallelExploration",
        },
      ],
      default: "approvalWait",
    },
    {
      id: "parallelExploration",
      type: "parallel",
      children: ["agentDetailsA", "agentDetailsB"],
      onSuccess: "finalSummary",
    },
    {
      id: "agentDetailsA",
      type: "agent",
      async executeLLM(input) {
        const plan = input.agentIntro;
        const { text } = await streamText({
          model: openai("gpt-3.5-turbo"),
          prompt: `Elaborate with a technical explanation: ${plan}`,
        });
        return text;
      },
      inputAdapter(flowState) {
        return { agentIntro: flowState.agentIntro };
      },
    },
    {
      id: "agentDetailsB",
      type: "agent",
      async executeLLM(input) {
        const plan = input.agentIntro;
        const { text } = await streamText({
          model: openai("gpt-3.5-turbo"),
          prompt: `Elaborate with a casual summary: ${plan}`,
        });
        return text;
      },
      inputAdapter(flowState) {
        return { agentIntro: flowState.agentIntro };
      },
    },
    {
      id: "approvalWait",
      type: "human",
      message: "Please approve or revise the plan. Input your feedback:",
      onSuccess: "finalSummary",
    },
    {
      id: "finalSummary",
      type: "agent",
      async executeLLM(input) {
        // Combine prior results
        return `Flow completed. Aggregated data: ${JSON.stringify(input)}`;
      },
    },
  ],
};

/**
 * POST => Start a new flow execution with the user's prompt.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userPrompt = body?.prompt ?? "No prompt.";
    // Clone the definition so we don't mutate global references.
    const defCopy = JSON.parse(
      JSON.stringify(complexFlowDefinition)
    ) as FlowDefinition;
    defCopy.initialState = { userPrompt };

    const exec = manager.createExecution(defCopy);

    return NextResponse.json({
      executionId: exec.executionId,
      status: exec.status,
    });
  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}

/**
 * GET => Provide SSE events for a specific flow execution.
 * e.g.  GET /api/flows/complex?executionId=exec-123
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const executionId = url.searchParams.get("executionId");
  if (!executionId) {
    return new NextResponse("Missing executionId", { status: 400 });
  }

  const ds = manager.getSSE(executionId);
  if (!ds) {
    return new NextResponse("No such flow execution", { status: 404 });
  }

  // Return SSE response
  return ds.toResponse();
}

// In production, you might separate these endpoints into different files,
// or place them in /flows/[id]/ route group, etc.
```

**Resume Endpoint** (for the human approval node):

```ts
// File: app/api/flows/[executionId]/resume/route.ts

import { NextRequest, NextResponse } from "next/server";
import { FlowExecutionManager } from "@/my-framework/flow-execution";
import { manager } from "../../complex/route"; // Reuse the same manager or create a new instance

export async function POST(
  req: NextRequest,
  { params }: { params: { executionId: string } }
) {
  const execId = params.executionId;
  try {
    const body = await req.json();
    const { nodeId, userInput } = body;
    if (!nodeId) {
      return new NextResponse("Missing nodeId", { status: 400 });
    }

    await manager.resume(execId, nodeId, userInput || {});
    return new NextResponse("Flow resumed.", { status: 200 });
  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}
```

> Note: Ensure that you have a consistent approach to importing or creating the `manager`. In a real app, you’d likely have a shared module that exports a singleton manager or a DB-based approach.

#### 13.3.2 Client-Side Demo Page

```tsx
// File: app/complex-flow-demo/page.tsx
"use client";

import React, { useState } from "react";

export default function ComplexFlowDemoPage() {
  const [prompt, setPrompt] = useState("");
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [flowStatus, setFlowStatus] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Start new flow
  async function startFlow() {
    setMessages([]);
    setFlowStatus("starting...");

    try {
      const res = await fetch("/api/flows/complex", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }

      setExecutionId(data.executionId);
      setFlowStatus(data.status);
      subscribeSSE(data.executionId);
    } catch (err: any) {
      console.error("Error starting flow:", err);
      setFlowStatus(`error: ${err.message}`);
    }
  }

  // Subscribe to SSE
  function subscribeSSE(execId: string) {
    const es = new EventSource(`/api/flows/complex?executionId=${execId}`);
    es.onmessage = (evt) => {
      if (!evt.data || evt.data === "[DONE]") {
        // SSE might send [DONE] to signal closure
        es.close();
        setFlowStatus("completed");
        return;
      }
      // For simplicity, assume messages are JSON-serialized or plain text.
      setMessages((prev) => [...prev, evt.data]);
    };
    es.onerror = () => {
      es.close();
      setFlowStatus("errored");
    };
  }

  // Provide human feedback if the flow is paused at a HumanNode
  async function provideFeedback() {
    if (!executionId) return;
    // We assume the nodeId is 'approvalWait' in our sample flow
    try {
      const res = await fetch(`/api/flows/${executionId}/resume`, {
        method: "POST",
        body: JSON.stringify({
          nodeId: "approvalWait",
          userInput: `User approval: ${prompt}`,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setFlowStatus("resumed");
    } catch (err: any) {
      console.error("Error resuming flow:", err);
      setFlowStatus(`error: ${err.message}`);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Complex Flow Demo</h1>
      <div>
        <label>Prompt:</label>{" "}
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "300px" }}
        />
        <button onClick={startFlow}>Start Flow</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={provideFeedback} disabled={!executionId}>
          Provide Human Feedback
        </button>
      </div>

      <h4>Status: {flowStatus}</h4>
      <div>
        <h5>Messages</h5>
        <ul>
          {messages.map((m, i) => (
            <li key={i} style={{ whiteSpace: "pre-wrap" }}>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

> You can refine the SSE **onmessage** handler to parse JSON if you’re emitting structured messages.

---

## 14. Conclusion & Next Steps

This **AI Agent Flow Framework** allows teams to build robust, multi-step AI workflows with:

- **Branching**, **parallel** tasks, **tool usage**, **error handling**, and **human approval** steps.
- **Partial streaming** to end-users.
- **Retry policies** and **timeouts** per node.
- **Scalability** and **persistence** in a database or Redis.
- **Security** hooks and concurrency controls.

### Potential Future Extensions

1. **Graphical Builder** – A React-based UI for designing flows visually.
2. **Extended Node Types** – E.g., Slack approval node, email triggers, or schedule-based nodes.
3. **Advanced Observability** – Full integration with logs, metrics, and distributed tracing.
4. **Multi-LLM Support** – Orchestration across different LLM providers or versions.

With this blueprint, you can confidently adapt the framework to your organization’s environment, ensuring a **production-grade** orchestration layer for AI-driven applications.

---

**End of Document**.
