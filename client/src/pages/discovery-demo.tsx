/**
 * AutonomOS Discovery Demo - Standalone UI for Replit Designer
 * 
 * This is a complete, self-contained UI component with no backend dependencies.
 * All data is mock/inline. Ready for visual design work in Replit Designer.
 * 
 * Dependencies needed:
 * - react
 * - reactflow
 * - framer-motion
 * - lucide-react
 * - clsx
 * - tailwind-merge
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  Handle, 
  Position,
  NodeProps,
  Edge,
  Node,
  MarkerType,
  EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Zap,
  Database, 
  FileText, 
  Globe, 
  Server, 
  Plug, 
  Network, 
  Sparkles, 
  Search,
  AlertTriangle,
  HelpCircle,
  Table2,
  RotateCcw,
  Brain
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import dynamicsLogo from '../assets/logos/dynamics_1763689304027.png';
import hubspotLogo from '../assets/logos/hubspot_1763689304027.png';
import legacyLogo from '../assets/logos/legacy_sql_1763689304028.png';
import mongoLogo from '../assets/logos/mongodb_1763689304028.png';
import netsuiteLogo from '../assets/logos/Netsuite_1763689304029.png';
import salesforceLogo from '../assets/logos/salesforce_1763689304029.png';
import sapLogo from '../assets/logos/sap_1763689304029.png';
import snowflakeLogo from '../assets/logos/snowflake_1763689304030.png';
import supabaseLogo from '../assets/logos/supabase_1763689304030.png';

import dclVideo from '../assets/dcl-video.mp4';
import dclGraph from '../assets/dcl-graph.png';
import catalogueImage from '../assets/catalogue-dashboard.png';

// Utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type Stage = 0 | 1 | 2 | 3 | 4;

// ============================================================================
// MOCK DATA
// ============================================================================

const mockAssets = [
  { id: '1', name: 'Salesforce Production Instance', vendor: 'salesforce', kind: 'saas', environment: 'PROD', state: 'READY_FOR_CONNECT' },
  { id: '2', name: 'Salesforce Accounts API', vendor: 'salesforce', kind: 'service', environment: 'PROD', state: 'READY_FOR_CONNECT' },
  { id: '3', name: 'Salesforce Opportunities', vendor: 'salesforce', kind: 'db', environment: 'PROD', state: 'READY_FOR_CONNECT' },
  { id: '4', name: 'Salesforce Contacts API', vendor: 'salesforce', kind: 'service', environment: 'PROD', state: 'READY_FOR_CONNECT' },
  { id: '5', name: 'MongoDB Users Collection', vendor: 'mongodb', kind: 'db', environment: 'PROD', state: 'READY_FOR_CONNECT' },
  { id: '6', name: 'MongoDB Events', vendor: 'mongodb', kind: 'db', environment: 'PROD', state: 'READY_FOR_CONNECT' },
  { id: '7', name: 'Supabase Customers Table', vendor: 'supabase', kind: 'db', environment: 'PROD', state: 'PARKED' },
  { id: '8', name: 'Supabase Invoices', vendor: 'supabase', kind: 'db', environment: 'PROD', state: 'PARKED' },
  { id: '9', name: 'Legacy Customer Export', vendor: 'legacy', kind: 'file', environment: 'PROD', state: 'UNKNOWN' },
  { id: '10', name: 'Legacy Backup Files', vendor: 'legacy', kind: 'file', environment: 'PROD', state: 'UNKNOWN' },
];

const getTotalCounts = () => ({
  total: 35,
  ready: 22,
  parked: 7,
  shadowIT: 3,
});

const getVendorDisplayName = (vendor: string) => {
  const map: Record<string, string> = {
    salesforce: 'Salesforce',
    mongodb: 'MongoDB',
    supabase: 'Supabase',
    legacy: 'Legacy Files',
  };
  return map[vendor] || vendor;
};

const getVendorColor = (vendor: string) => {
  const map: Record<string, string> = {
    salesforce: '#0BCAD9',
    mongodb: '#10B981',
    supabase: '#A855F7',
    legacy: '#F97316',
  };
  return map[vendor] || '#94a3b8';
};

const demoCustomer360Mappings = [
  { canonicalField: 'customer_id', type: 'UUID', sources: 'Salesforce.Id, MongoDB._id, Supabase.id' },
  { canonicalField: 'email', type: 'String', sources: 'Salesforce.Email, MongoDB.email, Legacy.customer_email' },
  { canonicalField: 'full_name', type: 'String', sources: 'Salesforce.Name, MongoDB.fullName' },
  { canonicalField: 'company', type: 'String', sources: 'Salesforce.Account.Name, MongoDB.company' },
  { canonicalField: 'created_at', type: 'Timestamp', sources: 'Salesforce.CreatedDate, MongoDB.createdAt' },
  { canonicalField: 'total_revenue', type: 'Decimal', sources: 'Salesforce.TotalRevenue, Supabase.revenue_sum' },
  { canonicalField: 'account_status', type: 'Enum', sources: 'Salesforce.Status, MongoDB.accountStatus' },
  { canonicalField: 'last_login', type: 'Timestamp', sources: 'MongoDB.lastLogin, Supabase.last_seen' },
  { canonicalField: 'subscription_tier', type: 'String', sources: 'Salesforce.Tier, MongoDB.subscription' },
];

// ============================================================================
// GRAPH COMPONENTS
// ============================================================================

const DataFlowEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.active && !data?.biDirectional && (
        <circle r="4" fill="#0bcad9">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Bi-directional pulse (Forward + Backward) */}
      {data?.active && data?.biDirectional && (
        <>
          <circle r="4" fill="#0bcad9">
            <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
          </circle>
          <circle r="4" fill="#a855f7">
             <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
          </circle>
        </>
      )}
      {data?.scanning && (
        <circle r="3" fill="#ffffff">
          <animateMotion 
            dur="0.8s" 
            repeatCount="indefinite" 
            path={edgePath} 
            keyPoints="1;0" 
            keyTimes="0;1" 
            calcMode="linear" 
          />
        </circle>
      )}
      
      {/* Normal forward pulse */}
      {data?.active && !data?.biDirectional && (
        <circle r="4" fill="#0bcad9">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Bi-directional pulse (Forward + Backward) */}
      {data?.active && data?.biDirectional && (
        <>
          <circle r="4" fill="#0bcad9">
            <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
          </circle>
          <circle r="4" fill="#a855f7">
             <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
          </circle>
        </>
      )}

      {data?.beaming && (
        <circle r="3" fill="#ffffff">
          <animateMotion 
            dur="1.5s" 
            repeatCount="indefinite" 
            path={edgePath} 
            keyPoints="0;1;0" 
            keyTimes="0;0.5;1" 
            calcMode="linear" 
          />
        </circle>
      )}
      {data?.beaming && (
        <path 
          d={edgePath} 
          stroke="#ffffff" 
          strokeWidth="4"
          fill="none"
          strokeDasharray="10,10"
          className="animate-[dash_0.5s_linear_infinite]"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }}
        />
      )}
    </>
  );
};

const edgeTypes = {
  dataflow: DataFlowEdge,
};

const VendorNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border bg-slate-900/90 w-52 transition-all shadow-lg relative",
      selected ? "border-primary shadow-[0_0_15px_-3px_rgba(11,202,217,0.4)]" : "border-slate-800 hover:border-slate-700",
      data.active ? "border-primary/50 shadow-[0_0_10px_-3px_rgba(11,202,217,0.3)]" : "",
      data.flash ? "ring-4 ring-white shadow-[0_0_40px_rgba(255,255,255,0.9)] z-50 scale-105 duration-75" : "duration-500",
      data.glowRed ? "border-red-500 shadow-[0_0_20px_-3px_rgba(239,68,68,0.6)]" : "",
      data.glowGreen ? "border-green-500 shadow-[0_0_20px_-3px_rgba(34,197,94,0.6)]" : ""
    )}>
      <Handle type="target" position={Position.Top} className="!bg-slate-600 !w-2 !h-2 !-top-1" />
      <Handle type="target" position={Position.Bottom} className="!bg-slate-600 !w-2 !h-2 !-bottom-1" />
      
      <Handle type="source" position={Position.Right} className="!bg-slate-600 !w-2 !h-2" />
      <div className={cn("p-2 rounded bg-slate-950/50", data.color)}>
        {data.icon}
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-slate-200">{data.label}</div>
        <div className="text-[10px] text-slate-500">{data.sub}</div>
      </div>
    </div>
  );
};

const ProcessingNode = ({ data, selected }: NodeProps) => {
  const isHex = data.shape === 'hexagon';
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Top Source Handle for AAM -> Logos */}
      {data.label === 'AAM' && (
         <Handle type="source" position={Position.Top} id="top-source" className="!bg-slate-600 !w-2 !h-2 !-top-1" />
      )}

      {/* Explicit Right Source Handle for AAM -> DCL */}
      {data.label === 'AAM' && (
         <Handle type="source" position={Position.Right} id="right-source" className="!bg-slate-600 !w-2 !h-2 !-right-1" />
      )}

      <Handle type="target" position={Position.Left} className="!bg-slate-600 !w-2 !h-2 -ml-1" />
      <div 
        className={cn(
          "flex flex-col items-center justify-center gap-2 transition-all bg-slate-900/90 border-2 shadow-xl backdrop-blur-md relative z-10",
          isHex ? "w-32 h-32" : "w-32 h-32 rounded-full",
          selected ? "border-primary shadow-[0_0_20px_-5px_rgba(11,202,217,0.5)]" : "border-slate-700",
          // Enhanced glow for AOD and AAM (persisting)
          data.active ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)] bg-cyan-950/30" : "",
          data.complete ? "border-green-500 shadow-[0_0_15px_-5px_rgba(34,197,94,0.5)]" : ""
        )}
        style={isHex ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" } : {}}
      >
        <div className={cn(
            "transition-colors duration-300",
            data.active ? "text-cyan-200 scale-110" : "text-slate-400",
            data.complete ? "text-green-400" : ""
        )}>
          {data.icon}
        </div>
        <div className="text-center z-10">
          <div className={cn("text-xs font-bold", data.active ? "text-cyan-100" : "text-slate-200")}>{data.label}</div>
          <div className={cn("text-[9px] uppercase tracking-wider", data.active ? "text-cyan-300/70" : "text-slate-500")}>{data.sub}</div>
        </div>
        
        {data.active && (
           <div className={cn(
             "absolute inset-0 z-0 animate-ping opacity-20 bg-cyan-400",
             isHex ? "" : "rounded-full"
           )} style={isHex ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" } : {}} />
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-slate-600 !w-2 !h-2 -mr-1" />
      
      {/* Bottom Source Handle for AOD -> Catalogue */}
      {data.label === 'AOD' && (
         <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-slate-600 !w-2 !h-2 !-bottom-1" />
      )}

      {/* Bottom Attachments (Label & Media) */}
      {(data.bottomLabel || data.bottomMedia || (data.bottomImage && data.showBottom)) && (
        <div className="absolute top-full mt-4 flex flex-col items-center gap-2 z-20">
          {data.bottomLabel && data.showBottom && (
            <div className="whitespace-nowrap px-4 py-2 rounded-md bg-slate-900/90 border border-slate-700 text-lg font-medium text-cyan-300 shadow-lg backdrop-blur-sm">
              {data.bottomLabel}
            </div>
          )}
          
          {data.bottomMedia && (
            <div className="w-32 h-20 bg-slate-900/80 rounded-lg border border-slate-700 overflow-hidden shadow-lg backdrop-blur-sm">
              <video 
                src={data.bottomMedia} 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                autoPlay 
                loop 
                muted 
                playsInline
              />
            </div>
          )}

          {data.bottomImage && data.showBottom && (
            <div className="w-48 h-28 bg-slate-900/80 rounded-lg border border-slate-700 overflow-hidden shadow-lg backdrop-blur-sm">
              <img 
                src={data.bottomImage} 
                alt="Ontology Graph" 
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ImageNode = ({ data }: NodeProps) => {
  return (
    <div className={cn(
      "relative flex items-center justify-center w-10 h-10 rounded-full border border-slate-600 bg-slate-900/50 p-1.5 transition-all duration-700 ease-out",
      data.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-50"
    )}>
      {/* Connect from Bottom (since they are above AAM) */}
      <Handle type="target" position={Position.Bottom} className="!bg-transparent !w-1 !h-1 !-bottom-1 border-none" />
      <img src={data.image} alt="Logo" className="w-full h-full object-contain" />
    </div>
  );
};

const PillLabelNode = ({ data }: NodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/50 text-xl font-bold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-sm transition-all duration-500",
      data.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
    )}>
      {data.label}
    </div>
  );
};

const CatalogueNode = ({ data }: NodeProps) => {
  return (
    <div className="flex flex-col items-center gap-2 relative">
      {/* Pill Label - Placed above to match Ontology Graph style */}
      <div className="whitespace-nowrap px-4 py-2 rounded-md bg-slate-900/90 border border-slate-700 text-lg font-medium text-purple-300 shadow-lg backdrop-blur-sm relative">
        <Handle type="target" position={Position.Top} id="top" className="!bg-purple-500 !w-3 !h-3 !-top-1.5" />
        Asset Catalogue
      </div>

      <div className={cn(
        "relative w-48 h-32 rounded-lg overflow-hidden shadow-2xl transition-all duration-500 bg-slate-900 border-2 border-purple-500/50 cursor-pointer",
        data.flash ? "ring-4 ring-white shadow-[0_0_50px_rgba(168,85,247,0.8)] scale-105" : "hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105",
        "group"
      )}>
        <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm z-0"></div>
        <img src={catalogueImage} alt="Asset Catalogue" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity z-10" />
      </div>
    </div>
  );
};

const OntologyNode = ({ data }: NodeProps) => {
  return (
    <div className={cn(
      "relative w-48 h-32 rounded-lg overflow-hidden shadow-2xl transition-all duration-500 bg-slate-900 border-2 border-cyan-500/50 cursor-pointer",
      // Modified active state to be less aggressive so hover effects can show
      data.active ? "shadow-[0_0_30px_rgba(6,182,212,0.4)] border-cyan-400" : "border-cyan-500/50",
      "hover:border-cyan-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105",
      "group"
    )}>
      {/* Handles for DCL */}
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3 !-left-1.5" />
      <Handle type="source" position={Position.Right} className="!bg-cyan-500 !w-3 !h-3 !-right-1.5" />
      
      <div className="absolute inset-0 bg-cyan-900/20 backdrop-blur-sm z-0"></div>
      <img src={dclGraph} alt="Ontology Graph" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity z-10" />
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent z-20">
        <div className="text-lg font-bold text-cyan-200">Ontology Graph</div>
        <div className="text-[9px] text-cyan-400/80">Connectivity Layer</div>
      </div>
    </div>
  );
};

const PromptNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "relative flex flex-col items-start justify-center w-64 p-4 rounded-xl bg-slate-900/95 border-2 shadow-xl backdrop-blur-md transition-all duration-300",
      selected ? "border-primary shadow-[0_0_20px_-5px_rgba(11,202,217,0.5)]" : "border-slate-700",
      data.active ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]" : ""
    )}>
      <Handle type="target" position={Position.Left} className="!bg-slate-600 !w-2 !h-2 !-left-1" />
      
      <div className="flex items-center gap-2 mb-2 w-full">
        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Natural Language Query</span>
      </div>
      
      <div className="w-full bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
        <div className="flex items-center gap-2 text-xs text-slate-400 italic">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse"></span>
          Ask a question...
        </div>
      </div>

      {data.active && (
        <div className="absolute -top-2 -right-2">
          <span className="flex h-4 w-4 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};

const AnalyticsNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "relative w-80 h-60 transition-all duration-700 ease-out",
      data.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
    )}>
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3 !-left-4 !top-1/2" />
      
      {/* Card 1: Document/Report (Back Left) */}
      <div className="absolute top-4 left-0 w-48 h-36 bg-slate-800 border border-slate-600 rounded-lg shadow-lg transform -rotate-6 hover:rotate-0 hover:z-40 transition-all duration-500 p-3 flex flex-col gap-2 group/card1 cursor-pointer">
         <div className="w-1/3 h-2 bg-slate-600 rounded mb-1"></div>
         <div className="w-full h-1 bg-slate-700 rounded"></div>
         <div className="w-full h-1 bg-slate-700 rounded"></div>
         <div className="w-3/4 h-1 bg-slate-700 rounded"></div>
         <div className="w-full h-1 bg-slate-700 rounded"></div>
         <div className="w-5/6 h-1 bg-slate-700 rounded"></div>
         <div className="mt-auto flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
               <FileText className="w-2 h-2 text-orange-500" />
            </div>
            <div className="text-[8px] text-slate-400">RISK_AUDIT.PDF</div>
         </div>
      </div>

      {/* Card 2: Data Table (Back Right/Middle) */}
      <div className="absolute top-0 right-4 w-48 h-36 bg-slate-900 border border-slate-600 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 hover:z-40 transition-all duration-500 p-0 overflow-hidden flex flex-col group/card2 cursor-pointer">
         <div className="h-6 bg-slate-800 border-b border-slate-700 flex items-center px-2">
            <div className="text-[9px] font-bold text-slate-400">DATA_EXPORT_V4</div>
         </div>
         <div className="p-2 grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-800/50 rounded border border-slate-700/30"></div>
            ))}
         </div>
         <div className="mt-auto p-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
               <div className="text-[8px] text-green-500">READY</div>
            </div>
            <Table2 className="w-3 h-3 text-slate-500" />
         </div>
      </div>

      {/* Card 3: Analytics Dashboard (Front Center) */}
      <div className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-40 bg-slate-950 border-2 border-cyan-500/30 rounded-xl shadow-2xl z-30 transform hover:scale-105 transition-all duration-300 group/card3 cursor-pointer overflow-hidden",
        selected ? "border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]" : ""
      )}>
        {/* Header */}
        <div className="h-8 bg-cyan-950/30 border-b border-cyan-900/50 flex items-center px-3 justify-between">
           <span className="text-[10px] font-bold text-cyan-400 tracking-wider">LIVE METRICS</span>
           <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-3 grid grid-cols-2 gap-3 h-full">
           {/* Donut Chart */}
           <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-12 h-12 rotate-[-90deg]">
                 <circle cx="16" cy="16" r="14" fill="none" stroke="#1e293b" strokeWidth="4" />
                 <circle cx="16" cy="16" r="14" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="70 100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                 78%
              </div>
           </div>
           
           {/* Bar Chart */}
           <div className="flex items-end justify-between gap-1 pb-4">
              <div className="w-2 bg-slate-700 h-[40%] rounded-t-[1px]"></div>
              <div className="w-2 bg-cyan-800 h-[60%] rounded-t-[1px]"></div>
              <div className="w-2 bg-cyan-600 h-[80%] rounded-t-[1px]"></div>
              <div className="w-2 bg-cyan-400 h-[100%] rounded-t-[1px]"></div>
           </div>
        </div>
      </div>

    </div>
  );
};

const nodeTypes = {
  vendor: VendorNode,
  processing: ProcessingNode,
  image: ImageNode,
  pill: PillLabelNode,
  catalogue: CatalogueNode,
  ontology: OntologyNode,
  prompt: PromptNode,
  analytics: AnalyticsNode,
};

const initialNodes: Node[] = [
  { id: 'salesforce', type: 'vendor', position: { x: 50, y: 50 }, data: { label: 'Salesforce', sub: '35 Assets', icon: <Globe className="w-5 h-5" />, color: 'text-blue-400' } },
  { id: 'mongodb', type: 'vendor', position: { x: 50, y: 150 }, data: { label: 'MongoDB', sub: '28 Assets', icon: <Database className="w-5 h-5" />, color: 'text-green-500' } },
  { id: 'supabase', type: 'vendor', position: { x: 50, y: 250 }, data: { label: 'Supabase', sub: '42 Assets', icon: <Server className="w-5 h-5" />, color: 'text-emerald-400' } },
  { id: 'legacy', type: 'vendor', position: { x: 50, y: 350 }, data: { label: 'Legacy Files', sub: '12 Assets', icon: <FileText className="w-5 h-5" />, color: 'text-orange-400' } },
  { id: 'shadow1', type: 'vendor', position: { x: 50, y: 450 }, data: { label: 'Shadow IT', sub: 'Dropbox Personal', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-500' } },
  { id: 'shadow2', type: 'vendor', position: { x: 50, y: 550 }, data: { label: 'Shadow IT', sub: 'Unknown AWS Acct', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-500' } },
  { id: 'unknown', type: 'vendor', position: { x: 50, y: 650 }, data: { label: '????', sub: 'Unidentified Protocol', icon: <HelpCircle className="w-5 h-5" />, color: 'text-slate-400' } },
  { id: 'aod', type: 'processing', position: { x: 350, y: 350 }, data: { label: 'AOD', sub: 'Discovery', icon: <Search className="w-6 h-6" />, shape: 'circle' } },
  { id: 'catalogue', type: 'catalogue', position: { x: 326, y: 550 }, hidden: true, style: { opacity: 0 }, data: { label: 'Asset Catalogue' } },
  { id: 'aam', type: 'processing', position: { x: 600, y: 350 }, data: { label: 'AAM', sub: 'API Mesh', icon: <Plug className="w-6 h-6" />, shape: 'circle' } },
  { id: 'dcl', type: 'processing', position: { x: 850, y: 350 }, data: { label: 'DCL', sub: 'Connectivity', icon: <Network className="w-6 h-6" />, shape: 'circle', bottomImage: dclGraph, bottomLabel: 'Ontology Graph' } },
  { id: 'agents', type: 'processing', position: { x: 1150, y: 350 }, data: { label: 'Agents', sub: 'Intelligence', icon: <Sparkles className="w-6 h-6" />, shape: 'circle' } },
  { id: 'nlp', type: 'prompt', position: { x: 1150, y: 150 }, data: { label: 'NLP / Intent', sub: 'Understanding', icon: <Brain className="w-6 h-6" />, shape: 'circle' } },
  { id: 'analytics', type: 'analytics', position: { x: 1150, y: 550 }, data: { visible: false } },
  
  // API Mesh Label
  { id: 'lbl-mesh', type: 'pill', position: { x: 565, y: 280 }, data: { label: 'API Mesh', visible: false }, zIndex: 10 },

  // Logo Array Nodes (Moved Above AAM)
  { id: 'logo-1', type: 'image', position: { x: 520, y: 220 }, data: { image: dynamicsLogo, visible: false } },
  { id: 'logo-2', type: 'image', position: { x: 600, y: 220 }, data: { image: hubspotLogo, visible: false } },
  { id: 'logo-3', type: 'image', position: { x: 680, y: 220 }, data: { image: legacyLogo, visible: false } },
  { id: 'logo-4', type: 'image', position: { x: 520, y: 150 }, data: { image: mongoLogo, visible: false } },
  { id: 'logo-5', type: 'image', position: { x: 600, y: 150 }, data: { image: netsuiteLogo, visible: false } },
  { id: 'logo-6', type: 'image', position: { x: 680, y: 150 }, data: { image: salesforceLogo, visible: false } },
  { id: 'logo-7', type: 'image', position: { x: 520, y: 80 }, data: { image: sapLogo, visible: false } },
  { id: 'logo-8', type: 'image', position: { x: 600, y: 80 }, data: { image: snowflakeLogo, visible: false } },
  { id: 'logo-9', type: 'image', position: { x: 680, y: 80 }, data: { image: supabaseLogo, visible: false } },
];

const initialEdges: Edge[] = [
  { id: 'e-sf-aod', source: 'salesforce', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-mg-aod', source: 'mongodb', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-sb-aod', source: 'supabase', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-lg-aod', source: 'legacy', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-sh1-aod', source: 'shadow1', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-sh2-aod', source: 'shadow2', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-unk-aod', source: 'unknown', target: 'aod', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-aod-cat', source: 'aod', sourceHandle: 'bottom-source', target: 'catalogue', targetHandle: 'top', type: 'dataflow', hidden: true, animated: false, style: { stroke: '#334155', strokeWidth: 2 }, zIndex: 5 },
  { id: 'e-aod-aam', source: 'aod', target: 'aam', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-aam-dcl', source: 'aam', sourceHandle: 'right-source', target: 'dcl', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-dcl-ag', source: 'dcl', target: 'agents', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-dcl-nlp', source: 'dcl', target: 'nlp', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e-dcl-an', source: 'dcl', target: 'analytics', type: 'dataflow', animated: false, style: { stroke: '#334155', strokeWidth: 2 }, hidden: true },
  // Logo Connections (From AAM Top to Logos Bottom)
  { id: 'e-aam-l1', source: 'aam', sourceHandle: 'top-source', target: 'logo-1', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l2', source: 'aam', sourceHandle: 'top-source', target: 'logo-2', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l3', source: 'aam', sourceHandle: 'top-source', target: 'logo-3', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l4', source: 'aam', sourceHandle: 'top-source', target: 'logo-4', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l5', source: 'aam', sourceHandle: 'top-source', target: 'logo-5', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l6', source: 'aam', sourceHandle: 'top-source', target: 'logo-6', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l7', source: 'aam', sourceHandle: 'top-source', target: 'logo-7', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l8', source: 'aam', sourceHandle: 'top-source', target: 'logo-8', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-aam-l9', source: 'aam', sourceHandle: 'top-source', target: 'logo-9', type: 'default', hidden: true, style: { stroke: '#475569', strokeWidth: 1, opacity: 0.5 } },
];

interface GraphViewProps {
  pipelineStep: number;
  pipelineState: "idle" | "running" | "complete";
  onNodeClick?: (nodeId: string, type: string) => void;
}

function GraphView({ pipelineStep, pipelineState, onNodeClick }: GraphViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    const isRunning = pipelineState === 'running';
    const isComplete = pipelineState === 'complete';

    setNodes((nds) => 
      nds.map((node) => {
        let active = false;
        let complete = false;

        if (isComplete) {
           complete = true;
        } else if (isRunning) {
           // AOD remains active throughout the pipeline run
           if (node.id === 'aod') {
             active = true;
           }
           
           if (pipelineStep >= 1 && node.id === 'aam') active = true; // Keep AAM active
           if (pipelineStep >= 2 && node.id === 'dcl') active = true; // Keep DCL active (requested "glow like AOD and DCL glow")
           if (pipelineStep === 3 && (node.id === 'agents' || node.id === 'nlp')) active = true;
           if (pipelineStep === 3 && node.id === 'analytics') {
             // Logic to handle analytics active state will be in effect hook or simpler here:
             // Actually we want it to be revealed during stage 4.
           }
           
           // AOD and AAM are never marked complete while running to keep them lit/glowing
           // if (pipelineStep > 1 && node.id === 'aam') complete = true; // REMOVED to keep glow
           // if (pipelineStep > 2 && node.id === 'dcl') complete = true; // REMOVED to keep glow
        }

        // Handle transformations
        if (pipelineStep > 0) {
            if (node.id === 'catalogue') {
              return { ...node, hidden: false, style: { ...node.style, opacity: 1 } };
            }
            if (node.id === 'dcl' && pipelineStep >= 2) {
               return { ...node, data: { ...node.data, active, complete, showBottom: true } };
            }
            if (node.id === 'analytics' && pipelineStep >= 3) {
               // Ensure visible if we are at or past stage 4 (index 3) and not running (completed step)
               // But if running, the effect below handles the sequence.
               if (pipelineState === 'complete' || (pipelineStep > 3)) {
                 return { ...node, data: { ...node.data, visible: true } };
               }
            }
        }

        return { ...node, data: { ...node.data, active, complete } };
      })
    );

    setEdges((eds) => 
      eds.map((edge) => {
         let active = false;
         let scanning = false;
         let beaming = false;
         let stroke = '#334155';
         
         if (isComplete) {
            stroke = '#0bcad9';
         } else if (isRunning) {
            // Check for beaming edges
            if (pipelineStep === 0) {
              // Staggered beaming logic based on timing handled in useEffect mostly, 
              // but here we can use a temporary state or rely on the useEffect to update edge data directly.
              // Actually, let's just use the data property set by the separate useEffect for beaming
              if (edge.data?.beaming) beaming = true;
            }

            if (pipelineStep === 0 && edge.target === 'aod') { 
              active = true; 
              scanning = true; 
              stroke = '#0bcad9'; 
            }
            if (pipelineStep === 1 && edge.source === 'aod' && edge.target === 'aam') { active = true; stroke = '#0bcad9'; }
            if (pipelineStep === 2 && edge.source === 'aam' && edge.target === 'dcl') { active = true; stroke = '#0bcad9'; }
            if (pipelineStep === 3 && (
                (edge.source === 'dcl' && edge.target === 'agents') || 
                (edge.source === 'dcl' && edge.target === 'nlp')
              )) { 
                active = true; 
                stroke = '#0bcad9'; 
                // Add bi-directional flag
                edge.data = { ...edge.data, biDirectional: true };
              }
            
            if (pipelineStep === 3 && edge.source === 'agents' && edge.target === 'analytics') {
               // This edge activates later in the sequence, handled by effect
            }

            if (pipelineStep > 0 && edge.target === 'aod') stroke = '#0bcad9';
            if (pipelineStep > 1 && edge.target === 'aam') stroke = '#0bcad9';
            if (pipelineStep > 2 && edge.target === 'dcl') stroke = '#0bcad9';
            if (pipelineStep >= 3 && edge.target === 'analytics') stroke = '#0bcad9';
         }

         return { ...edge, data: { ...edge.data, active, scanning, beaming }, style: { stroke, strokeWidth: 2 } };
      })
    );
  }, [pipelineStep, pipelineState, setNodes, setEdges]);

  // Effect to handle node transformation during discovery
  useEffect(() => {
    if (pipelineState === 'running' && pipelineStep === 0) {
      // Reset edges beaming and hidden state for catalogue AND LOGOS AND ANALYTICS
      setEdges((eds) => eds.map(e => {
        if (e.id === 'e-aod-cat') return { ...e, hidden: true, data: { ...e.data, beaming: false } };
        if (e.id === 'e-ag-an') return { ...e, hidden: true, data: { ...e.data, active: false } };
        if (e.id.startsWith('e-aam-l')) return { ...e, hidden: true };
        return { ...e, data: { ...e.data, beaming: false } };
      }));
      
      // Reset catalogue node visibility AND LOGOS AND LABEL AND ANALYTICS
      setNodes((currentNodes) => 
        currentNodes.map((node) => {
          if (node.id === 'catalogue') {
            return { ...node, hidden: true, style: { ...node.style, opacity: 0 } };
          }
          if (node.id === 'analytics') {
            return { ...node, data: { ...node.data, visible: false } };
          }
          if (node.type === 'image') {
            return { ...node, data: { ...node.data, visible: false } };
          }
          if (node.id === 'lbl-mesh') {
            return { ...node, data: { ...node.data, visible: false } };
          }
          const initial = initialNodes.find((n) => n.id === node.id);
          if (initial && (node.id === 'unknown' || node.id === 'shadow1' || node.id === 'shadow2')) {
            return {
              ...node,
              data: {
                ...node.data,
                label: initial.data.label,
                sub: initial.data.sub,
                icon: initial.data.icon,
                color: initial.data.color,
                flash: false,
                glowRed: false,
                glowGreen: false
              }
            };
          }
          return { ...node, data: { ...node.data, flash: false } };
        })
      );

      const sequence = [
        { id: 'unknown', delay: 3000, newLabel: 'SAP', newSub: 'ERP System', newIcon: <Database className="w-5 h-5" />, newColor: 'text-blue-600' },
        { id: 'shadow1', delay: 4000, newLabel: 'Hubspot', newSub: 'Marketing CRM', newIcon: <Globe className="w-5 h-5" />, newColor: 'text-orange-500' },
        { id: 'shadow2', delay: 5000, newLabel: 'Oracle', newSub: 'Financial DB', newIcon: <Database className="w-5 h-5" />, newColor: 'text-red-600' },
      ];

      const timeouts: NodeJS.Timeout[] = [];

      sequence.forEach((item) => {
        // Start Red Glow (1s before transform)
        timeouts.push(setTimeout(() => {
          setNodes((currentNodes) => 
            currentNodes.map((node) => {
              if (node.id === item.id) {
                return { ...node, data: { ...node.data, glowRed: true } };
              }
              return node;
            })
          );
        }, item.delay - 1000));

        // Start Beam (500ms before transform)
        timeouts.push(setTimeout(() => {
          setEdges((eds) => eds.map(e => {
             if (e.source === item.id && e.target === 'aod') {
               return { ...e, data: { ...e.data, beaming: true } };
             }
             return e;
          }));
        }, item.delay - 500));

        // Transform & Flash & Stop Beam & Switch to Green Glow
        timeouts.push(setTimeout(() => {
          setEdges((eds) => eds.map(e => {
             if (e.source === item.id && e.target === 'aod') {
               return { ...e, data: { ...e.data, beaming: false } };
             }
             return e;
          }));

          setNodes((currentNodes) => 
            currentNodes.map((node) => {
              if (node.id === item.id) {
                return { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    label: item.newLabel, 
                    sub: item.newSub, 
                    icon: item.newIcon, 
                    color: item.newColor,
                    flash: true,
                    glowRed: false,
                    glowGreen: true
                  } 
                };
              }
              return node;
            })
          );
          
          // Turn off flash after 500ms (keep green glow)
          setTimeout(() => {
            setNodes((currentNodes) => 
              currentNodes.map((node) => {
                if (node.id === item.id) {
                  return { ...node, data: { ...node.data, flash: false } };
                }
                return node;
              })
            );
          }, 500);

        }, item.delay));
      });

      // NEW: Green Glow Sequence for existing nodes (Legacy -> Supabase -> MongoDB -> Salesforce)
      const greenSequence = [
        { id: 'legacy', delay: 5500 },
        { id: 'supabase', delay: 6000 },
        { id: 'mongodb', delay: 6500 },
        { id: 'salesforce', delay: 7000 },
      ];

      greenSequence.forEach((item) => {
        // Flash & turn Green
        timeouts.push(setTimeout(() => {
          setNodes((currentNodes) => 
            currentNodes.map((node) => {
              if (node.id === item.id) {
                return { ...node, data: { ...node.data, flash: true, glowGreen: true } };
              }
              return node;
            })
          );

          // Turn off flash
          setTimeout(() => {
             setNodes((currentNodes) => 
               currentNodes.map((node) => {
                 if (node.id === item.id) {
                   return { ...node, data: { ...node.data, flash: false } };
                 }
                 return node;
               })
             );
          }, 500);
        }, item.delay));
      });

      // Materialize Catalogue (after 7.5s now to allow sequence to finish)
      timeouts.push(setTimeout(() => {
        setNodes((currentNodes) => 
          currentNodes.map((node) => {
            if (node.id === 'catalogue') {
              return { 
                ...node, 
                hidden: false, 
                style: { ...node.style, opacity: 1 },
                data: { ...node.data, flash: true } // Flash on appear
              };
            }
            return node;
          })
        );
        
        setEdges((eds) => eds.map(e => {
          if (e.id === 'e-aod-cat') {
            return { ...e, hidden: false, data: { ...e.data, active: true } }; // Reveal edge and make it active
          }
          return e;
        }));

        // Turn off flash for catalogue
        setTimeout(() => {
          setNodes((currentNodes) => 
            currentNodes.map((node) => {
              if (node.id === 'catalogue') {
                return { ...node, data: { ...node.data, flash: false } };
              }
              return node;
            })
          );
        }, 500);

      }, 7500));

      // Safety check: Ensure catalogue edge is visible if catalogue is visible (in case of race conditions)
      // This is just a precaution, the main logic is above.
      
      return () => timeouts.forEach(clearTimeout);
    } else if (pipelineStep > 0) {
        // Force ensure catalogue edge is visible if we are past step 0
        setEdges((eds) => eds.map(e => {
          if (e.id === 'e-aod-cat') {
            return { ...e, hidden: false, data: { ...e.data, active: true } };
          }
          return e;
        }));
    }
  }, [pipelineState, pipelineStep, setNodes, setEdges]);

  useEffect(() => {
    if (pipelineState === 'running' && pipelineStep > 0) {
      // When entering a new step (other than discovery), trigger beam effect
      let sourceId = '';
      let targetId = '';
      
      if (pipelineStep === 1) { sourceId = 'aod'; targetId = 'aam'; }
      if (pipelineStep === 2) { sourceId = 'aam'; targetId = 'dcl'; }
      if (pipelineStep === 3) { sourceId = 'dcl'; targetId = 'agents'; } // Trigger for agents, we'll handle NLP manually or together

      if (sourceId && targetId) {
        // 1. Start Beam
        setEdges((eds) => eds.map(e => {
           if (e.source === sourceId && e.target === targetId) {
             return { ...e, data: { ...e.data, beaming: true } };
           }
           // Also beam to NLP if stepping to 3
           if (pipelineStep === 3 && e.source === 'dcl' && e.target === 'nlp') {
              return { ...e, data: { ...e.data, beaming: true } };
           }
           // Also beam to Analytics if stepping to 3
           if (pipelineStep === 3 && e.source === 'dcl' && e.target === 'analytics') {
              return { ...e, hidden: false, data: { ...e.data, beaming: true } };
           }
           return e;
        }));

        // 2. After 500ms, Stop Beam & Flash Target Node
        const timer = setTimeout(() => {
          setEdges((eds) => eds.map(e => {
             if (e.source === sourceId && e.target === targetId) {
               return { ...e, data: { ...e.data, beaming: false } };
             }
             if (pipelineStep === 3 && e.source === 'dcl' && e.target === 'nlp') {
                return { ...e, data: { ...e.data, beaming: false } };
             }
             if (pipelineStep === 3 && e.source === 'dcl' && e.target === 'analytics') {
                return { ...e, data: { ...e.data, beaming: false, active: true } };
             }
             return e;
          }));

          setNodes((nds) => nds.map(n => {
            if (n.id === targetId) {
              return { ...n, data: { ...n.data, flash: true } };
            }
            if (pipelineStep === 3 && n.id === 'nlp') {
               return { ...n, data: { ...n.data, flash: true } };
            }
            if (pipelineStep === 3 && n.id === 'analytics') {
               return { ...n, data: { ...n.data, visible: true, flash: true } };
            }
            return n;
          }));

          // 3. Turn off flash
          setTimeout(() => {
            setNodes((nds) => nds.map(n => {
              if (n.id === targetId) {
                return { ...n, data: { ...n.data, flash: false } };
              }
              if (pipelineStep === 3 && n.id === 'nlp') {
                 return { ...n, data: { ...n.data, flash: false } };
              }
              if (pipelineStep === 3 && n.id === 'analytics') {
                 return { ...n, data: { ...n.data, flash: false } };
              }
              return n;
            }));
          }, 500);
          
          // (Removed old delayed logic for analytics)


          // SPECIAL: If target is AAM (Step 1), reveal logos 1s after flash starts
          if (targetId === 'aam') {
            setTimeout(() => {
              // Reveal edges
              setEdges((eds) => eds.map(e => {
                if (e.id.startsWith('e-aam-l')) {
                  return { ...e, hidden: false, animated: true };
                }
                return e;
              }));
              
              // Reveal Label
              setNodes((nds) => nds.map(n => {
                if (n.id === 'lbl-mesh') {
                  return { ...n, data: { ...n.data, visible: true } };
                }
                return n;
              }));

              // Reveal nodes (staggered)
              const logoIds = ['logo-1', 'logo-2', 'logo-3', 'logo-4', 'logo-5', 'logo-6', 'logo-7', 'logo-8', 'logo-9'];
              
              logoIds.forEach((id, index) => {
                setTimeout(() => {
                  setNodes((nds) => nds.map(n => {
                    if (n.id === id) {
                      return { ...n, data: { ...n.data, visible: true } };
                    }
                    return n;
                  }));
                }, index * 50); // Quick stagger
              });

            }, 1000);
          }

        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [pipelineState, pipelineStep, setEdges, setNodes]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const target = event.target as HTMLElement;
    
    // Check if click was on the Ontology Graph image (now part of OntologyNode or standalone check)
    if ((target.tagName === 'IMG' && target.getAttribute('alt') === 'Ontology Graph') || node.id === 'dcl') {
       setExpandedImage(dclGraph);
       return;
    }

    // Check if click was on the Asset Catalogue image OR the AOD node
    if ((target.tagName === 'IMG' && target.getAttribute('alt') === 'Asset Catalogue') || node.type === 'catalogue' || node.id === 'aod') {
      setExpandedImage(catalogueImage);
      return;
    }

    if (onNodeClick) onNodeClick(node.id, node.type || 'default');
  }, [onNodeClick]);

  // Reset function
  const resetNodes = () => {
    // Only reset positions, keep data intact
    setNodes((currentNodes) => 
      initialNodes.map((initialNode) => {
        const currentNode = currentNodes.find(n => n.id === initialNode.id);
        if (currentNode) {
          return {
             ...currentNode,
             position: initialNode.position
          };
        }
        return initialNode;
      })
    );
  };

  return (
    <div className="w-full h-full bg-slate-950/50 rounded-xl border border-slate-800/50 overflow-hidden relative">
      {/* Expanded Image Modal */}
      {expandedImage && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-full max-h-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            <img 
              src={expandedImage} 
              alt="Expanded View" 
              className="max-w-full max-h-[85vh] object-contain"
            />
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white/70 hover:text-white">
              <RotateCcw className="w-4 h-4 rotate-45" />
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{ type: 'dataflow', markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' } }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        
        {/* Reset Button */}
        <div className="absolute top-4 right-4 z-10">
           <button 
             onClick={resetNodes}
             className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors shadow-lg backdrop-blur-sm"
           >
             <RotateCcw className="w-3 h-3" />
             Reset Layout
           </button>
        </div>
      </ReactFlow>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DiscoveryDemoStandalone() {
  const [currentStage, setCurrentStage] = useState<Stage>(0);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  useEffect(() => {
    if (isRunningPipeline) {
      // No auto-advancement. The user must manually click "Continue" to proceed to the next stage.
      // This ensures we pause at each stage (AOD, AAM, DCL, Agents) as requested.
    }
  }, [isRunningPipeline, currentStage]);

  const handleRunFullPipeline = () => {
    setCurrentStage(1);
    setIsRunningPipeline(true);
  };

  const handleContinuePipeline = () => {
    if (currentStage < 4) {
      setCurrentStage((prev) => (prev + 1) as Stage);
    } else {
      setIsRunningPipeline(false);
    }
  };

  const handleEndDemo = () => {
    setIsRunningPipeline(false);
    setCurrentStage(0);
  };

  const handleNext = () => {
    if (currentStage < 4) {
      setCurrentStage((prev) => (prev + 1) as Stage);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => (prev - 1) as Stage);
    } else if (currentStage === 1) {
      setCurrentStage(0);
    }
  };

  const handleStageClick = (stage: Stage) => {
    setCurrentStage(stage);
    setIsRunningPipeline(true);
  };

  const totalCounts = getTotalCounts();
  const pipelineStep = currentStage - 1;
  const pipelineState = isRunningPipeline ? "running" : "idle";

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white" style={{ fontFamily: 'Quicksand, sans-serif' }}>
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">AutonomOS – Discovery & Mesh Demo</h1>
          <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-400 font-semibold">
            Demo Tenant
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentStage > 0 && (
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
              Stage {currentStage} of 4
            </span>
          )}
          {isRunningPipeline && (
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400 flex items-center gap-2">
              <Zap className="w-3 h-3 animate-pulse" />
              Running Pipeline
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area - Relative container for absolute children */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        
        {/* Graph Layer - Absolute Full */}
        <div className="absolute inset-0 z-0">
            <GraphView 
              pipelineStep={pipelineStep} 
              pipelineState={pipelineState}
              onNodeClick={(id) => console.log("Clicked:", id)} 
            />
        </div>

        {/* Details Overlay - Toggled */}
        {showDetails && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[600px] max-h-[60vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl z-10 flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in">
             <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Stage Details</h3>
                  <button onClick={() => setShowDetails(false)} className="text-slate-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                {currentStage === 1 && <Stage1Content totalCounts={totalCounts} />}
                {currentStage === 2 && <Stage2Content />}
                {currentStage === 3 && <Stage3Content />}
                {currentStage === 4 && <Stage4Content />}
                {currentStage === 0 && (
                  <div className="text-slate-400 text-sm text-center py-4">
                    Select a stage or run the pipeline to see details.
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Floating Controls - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl z-20 px-6 py-3 w-auto max-w-[90vw]">
            <StepperNavigation
              currentStage={currentStage}
              onStageClick={handleStageClick}
              onBack={handleBack}
              onNext={handleNext}
              onRunFullPipeline={handleRunFullPipeline}
              onContinuePipeline={handleContinuePipeline}
              onEndDemo={handleEndDemo}
              isRunningPipeline={isRunningPipeline}
              showDetails={showDetails}
              onToggleDetails={() => setShowDetails(!showDetails)}
            />
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// STAGE CONTENT COMPONENTS
// ============================================================================

function Stage1Content({ totalCounts }: { totalCounts: any }) {
  const demoAssets = mockAssets.slice(0, 10);

  const getRiskLevel = (state: string) => {
    if (state === 'UNKNOWN') return 'High';
    if (state === 'PARKED') return 'Medium';
    return 'Low';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'High') return 'text-red-400';
    if (risk === 'Medium') return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">AOD Discovery — Assets & Risk</h2>
          <p className="text-xs text-slate-400">Automatically discovered assets across the demo tenant</p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-1.5 bg-slate-800 rounded border border-slate-700">
            <span className="text-slate-400 mr-2">Assets:</span>
            <span className="text-white font-bold">{totalCounts.total}</span>
          </div>
          <div className="px-3 py-1.5 bg-green-500/10 rounded border border-green-500/30">
             <span className="text-slate-400 mr-2">Ready:</span>
             <span className="text-green-400 font-bold">{totalCounts.ready}</span>
          </div>
          <div className="px-3 py-1.5 bg-orange-500/10 rounded border border-orange-500/30">
             <span className="text-slate-400 mr-2">Parked:</span>
             <span className="text-orange-400 font-bold">{totalCounts.parked}</span>
          </div>
          <div className="px-3 py-1.5 bg-red-500/10 rounded border border-red-500/30">
             <span className="text-slate-400 mr-2">Shadow:</span>
             <span className="text-red-400 font-bold">{totalCounts.shadowIT}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full min-w-max">
              <thead className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Asset</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Vendor</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Kind</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Env</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {demoAssets.map((asset) => {
                  const risk = getRiskLevel(asset.state);
                  const vendorName = getVendorDisplayName(asset.vendor);
                  
                  return (
                    <tr key={asset.id} className="hover:bg-slate-700/50">
                      <td className="px-3 py-2 text-xs text-white truncate max-w-[180px]" title={asset.name}>{asset.name}</td>
                      <td className="px-3 py-2 text-xs">
                        <span style={{ color: getVendorColor(asset.vendor) }}>{vendorName}</span>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-300 capitalize">{asset.kind}</td>
                      <td className="px-3 py-2 text-xs text-slate-300 uppercase">{asset.environment}</td>
                      <td className={`px-3 py-2 text-xs font-semibold ${getRiskColor(risk)}`}>{risk}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-64 bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col justify-center gap-4 h-fit">
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-orange-400 block mb-1">Normally:</span> 
            Spreadsheets, interviews, and guesswork to find what's running.
          </div>
          <div className="h-px bg-slate-700"></div>
          <div className="text-xs text-cyan-400 leading-relaxed">
            <span className="font-semibold block mb-1">With AOS:</span> 
            Uses log & config telemetry and AI classifiers to discover and risk-score assets.
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage2Content() {
  const connectors = [
    {
      vendor: 'Salesforce',
      color: '#0BCAD9',
      auth: 'OAuth2, scopes: api, refresh_token',
      contract: 'API v59.0, /sobjects/Account',
      details: '100 req/s, exp. backoff',
    },
    {
      vendor: 'MongoDB',
      color: '#10B981',
      auth: 'TLS SRV, vault credentials',
      contract: 'Collections: users, events',
      details: 'Pool: max 20, timeout 30s',
    },
    {
      vendor: 'Supabase',
      color: '#A855F7',
      auth: 'Postgres URL, RLS aware',
      contract: 'PgBouncer session mode',
      details: 'Tables: customers, invoices',
    },
    {
      vendor: 'Legacy Files',
      color: '#F97316',
      auth: 'S3 bucket, IAM role',
      contract: '*.csv, daily at 02:00 UTC',
      details: 'Retention: 90 days',
    },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">AAM Connections — Connectors</h2>
          <p className="text-xs text-slate-400">Adaptive API Mesh connector configurations</p>
        </div>
        <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="text-xs text-cyan-300">
            <span className="font-semibold mr-1">AI Config:</span> 
            Auto-selects auth flows, scopes, timeouts.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto">
        {connectors.map((connector) => (
          <div key={connector.vendor} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: connector.color }} />
              <h3 className="text-sm font-bold" style={{ color: connector.color }}>
                {connector.vendor}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <div className="text-slate-500 font-semibold text-[10px] uppercase">Auth</div>
                <div className="text-slate-300 truncate" title={connector.auth}>{connector.auth}</div>
              </div>
              
              <div>
                <div className="text-slate-500 font-semibold text-[10px] uppercase">Contract</div>
                <div className="text-slate-300 truncate" title={connector.contract}>{connector.contract}</div>
              </div>
              
              <div className="col-span-2">
                <div className="text-slate-500 font-semibold text-[10px] uppercase">Details</div>
                <div className="text-slate-300 truncate" title={connector.details}>{connector.details}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stage3Content() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">DCL Mapping — Unified Entity</h2>
          <p className="text-xs text-slate-400">Schema mappings from multiple sources</p>
        </div>
        <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
           <div className="text-xs text-purple-300">
             Unified <span className="font-mono font-bold">customer_360</span> entity created
           </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full min-w-max">
            <thead className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Canonical Field</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Type</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-900">Source Mappings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {demoCustomer360Mappings.slice(0, 8).map((mapping) => (
                <tr key={mapping.canonicalField} className="hover:bg-slate-700/50">
                  <td className="px-3 py-2">
                    <code className="text-cyan-400 font-mono text-xs font-bold">{mapping.canonicalField}</code>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">{mapping.type}</td>
                  <td className="px-3 py-2 text-xs text-slate-500 truncate max-w-[300px]" title={mapping.sources}>{mapping.sources}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stage4Content() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-white">Agent Execution — Query Results</h2>
        <p className="text-xs text-slate-400">AI agent analyzing unified data</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Natural Language Query</div>
          <code className="text-sm text-cyan-400 font-mono bg-slate-900 p-3 rounded border border-slate-700 block">
            "Show me high-risk services with annual revenue &gt; $1M"
          </code>
        </div>

        <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex flex-col justify-center gap-2">
          <div className="text-xs text-green-400 uppercase font-semibold">Analysis Result</div>
          <div className="text-lg font-bold text-white">
            Found <span className="text-green-400">4 high-risk services</span>
          </div>
          <div className="text-sm text-slate-300">
            Total Revenue Impact: <span className="text-white font-bold">$8.5M ARR</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-y-auto">
         <div className="text-xs text-slate-400 uppercase font-semibold mb-2">Agent Reasoning</div>
         <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
           <p>1. <span className="text-cyan-400">Identified Intent:</span> Risk analysis filtered by revenue threshold.</p>
           <p>2. <span className="text-cyan-400">Queried Ontology:</span> `customer_360` entity joined with `service_registry`.</p>
           <p>3. <span className="text-cyan-400">Filter Applied:</span> `risk_score == 'High'` AND `revenue &gt; 1000000`.</p>
           <p>4. <span className="text-cyan-400">Aggregation:</span> Summed revenue for matching records.</p>
         </div>
      </div>
    </div>
  );
}

function StepperNavigation({
  currentStage,
  onStageClick,
  onBack,
  onNext,
  onRunFullPipeline,
  onContinuePipeline,
  onEndDemo,
  isRunningPipeline,
  showDetails,
  onToggleDetails,
}: {
  currentStage: Stage;
  onStageClick: (stage: Stage) => void;
  onBack: () => void;
  onNext: () => void;
  onRunFullPipeline: () => void;
  onContinuePipeline: () => void;
  onEndDemo: () => void;
  isRunningPipeline: boolean;
  showDetails: boolean;
  onToggleDetails: () => void;
}) {
  const stages = [
    { num: 1, label: 'AOD' },
    { num: 2, label: 'AAM' },
    { num: 3, label: 'DCL' },
    { num: 4, label: 'Agents' },
  ];

  return (
    <div className="flex items-center gap-6">
      {/* Stages List - Horizontal */}
      <div className="flex items-center gap-2">
        {stages.map((stage) => (
          <button
            key={stage.num}
            onClick={() => onStageClick(stage.num as Stage)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all group ${
              currentStage === stage.num
                ? 'bg-cyan-500/20 border border-cyan-500/50'
                : 'hover:bg-slate-800 border border-transparent'
            } ${isRunningPipeline ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
              currentStage === stage.num
                ? 'bg-cyan-500 text-white'
                : currentStage > stage.num && currentStage !== 0
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
            }`}>
              {currentStage > stage.num && currentStage !== 0 ? '✓' : stage.num}
            </div>
            <div className={`text-xs font-medium whitespace-nowrap ${
              currentStage === stage.num ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-300'
            }`}>
              {stage.label}
            </div>
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-slate-700"></div>

      {/* Action Buttons - Horizontal */}
      <div className="flex items-center gap-3">
        {/* Details Toggle */}
        <button
           onClick={onToggleDetails}
           className={`p-2 rounded-md transition-colors text-xs font-semibold flex items-center justify-center gap-2 ${
             showDetails ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
           }`}
           title="Toggle Details"
        >
          <FileText className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-700"></div>
        {isRunningPipeline ? (
          <>
            <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse px-2 whitespace-nowrap">
              <Zap className="w-3 h-3" />
              <span className="font-bold">Running...</span>
            </div>
            
            {currentStage < 4 ? (
              <button
                onClick={onContinuePipeline}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors text-xs font-bold flex items-center gap-2 whitespace-nowrap"
              >
                Continue
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={onRunFullPipeline}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors text-xs font-bold flex items-center gap-2 whitespace-nowrap"
              >
                <Play className="w-3 h-3" />
                Restart
              </button>
            )}
            
            <button
              onClick={onEndDemo}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs font-semibold whitespace-nowrap"
            >
              End Demo
            </button>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <button
                onClick={onBack}
                disabled={currentStage <= 1}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors text-xs font-semibold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={onNext}
                disabled={currentStage === 4}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors text-xs font-semibold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <button
              onClick={onRunFullPipeline}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors text-xs font-bold flex items-center gap-2 whitespace-nowrap"
            >
              <Play className="w-3 h-3" />
              Run Pipeline
            </button>

            <button
              onClick={onEndDemo}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md transition-colors text-xs font-semibold hover:text-white whitespace-nowrap"
            >
              End Demo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
