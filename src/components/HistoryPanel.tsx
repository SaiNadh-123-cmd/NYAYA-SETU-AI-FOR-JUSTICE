import { useEffect, useState } from "react";
import { Loader2, History, Scale, FileText, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SavedQuery {
  id: string;
  type: 'translate' | 'summarize' | 'query';
  input_text: string;
  result_data: any;
  created_at: string;
}

const HistoryPanel = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('saved_queries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setHistory(data as SavedQuery[]);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-12 space-y-4">
        <History className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h3 className="text-xl font-heading font-semibold text-foreground">No History Found</h3>
        <p className="text-muted-foreground font-body">
          Any translations, summaries, or legal queries you make will be securely saved here for your future reference.
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'translate': return <Languages className="w-5 h-5 text-primary" />;
      case 'summarize': return <FileText className="w-5 h-5 text-cyan" />;
      case 'query': return <Scale className="w-5 h-5 text-gold" />;
      default: return <History className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'translate': return 'Translation';
      case 'summarize': return 'Simplified Summary';
      case 'query': return 'Legal Query';
      default: return 'Report';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <History className="w-5 h-5 text-gold" />
        <h2 className="text-lg font-heading font-bold text-foreground">Your Saved Context</h2>
      </div>

      <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.id} className="p-5 rounded-xl gradient-card border border-border/50 hover:border-gold/30 transition-colors animate-fade-in group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <span className="text-sm font-semibold text-foreground capitalize tracking-wider">{getTitle(item.type)}</span>
              </div>
              <span className="text-xs text-muted-foreground font-body">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-sm text-foreground/80 font-body line-clamp-2 mb-4 bg-background/50 p-3 rounded-md border border-border/30">
              "{item.input_text}"
            </p>

            <div className="text-sm text-muted-foreground font-body">
              {item.type === 'translate' && (
                <span className="text-primary">{item.result_data.translated_text?.substring(0, 100)}...</span>
              )}
              {item.type === 'summarize' && (
                <span className="text-cyan">{item.result_data.simple_summary?.substring(0, 100)}...</span>
              )}
              {item.type === 'query' && (
                <span className="text-gold">Case Category: {item.result_data.case_category}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
