"use client";

import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { LED } from "./LED";
import { Buzzer } from "./Buzzer";
import { Motor } from "./Motor";

// Define the data types for our nodes
type LEDNodeData = Node<{ isEnabled: boolean; color: string; pin: number }>;
type BuzzerNodeData = Node<{ isEnabled: boolean; pin: number }>;
type MotorNodeData = Node<{ isEnabled: boolean; pin: number }>;

export function LEDNode({ data }: NodeProps<LEDNodeData>) {
	return (
		<div className="relative">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<LED isEnabled={data.isEnabled} color={data.color} pin={data.pin} />
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
		</div>
	);
}

export function BuzzerNode({ data }: NodeProps<BuzzerNodeData>) {
	return (
		<div className="relative">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<Buzzer isEnabled={data.isEnabled} pin={data.pin} />
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
		</div>
	);
}

export function MotorNode({ data }: NodeProps<MotorNodeData>) {
	return (
		<div className="relative">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<Motor isEnabled={data.isEnabled} pin={data.pin} />
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
		</div>
	);
}
