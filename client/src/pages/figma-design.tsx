import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function FigmaDesign() {
  const figmaUrl = "https://www.figma.com/design/kHV2ii8DKlS5EhIk5ShDqd/ic-mock-for-export?node-id=1-67&t=fqILDKJLi3NrNsNq-4";
  const embedUrl = "https://www.figma.com/embed?embed_host=share&url=" + encodeURIComponent(figmaUrl);
  
  return (
    <div className="w-full h-full bg-slate-950 text-slate-200 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">Figma Design</h1>
            <p className="text-sm text-slate-400">
              Original design mockups and specifications
            </p>
          </div>
          <a 
            href={figmaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/20"
          >
            <span className="text-sm font-medium">Open in Figma</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardContent className="p-0 h-full">
              <iframe 
                src={embedUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Figma Design"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
