import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FigmaDesign() {
  return (
    <div className="w-full h-screen bg-slate-950 p-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Figma Design</h1>
          <p className="text-slate-400">
            View the original design mockups and specifications.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Design Prototype</CardTitle>
            <CardDescription>
              Embedded Figma prototype view (Placeholder)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] flex items-center justify-center bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-lg m-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                  <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                  <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                  <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                  <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                </svg>
              </div>
              <p className="text-slate-500">Figma embed will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
