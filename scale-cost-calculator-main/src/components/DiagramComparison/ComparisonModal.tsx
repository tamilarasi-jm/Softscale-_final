import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">AOA vs AON: Complete Guide</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* When to Use AOA */}
          <section>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">When to Use AOA (Activity on Arrow)</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>PERT Focus:</strong> When using Program Evaluation and Review Technique with probabilistic time estimates</li>
              <li>• <strong>Small Projects:</strong> Simple projects with fewer than 20 activities</li>
              <li>• <strong>Event-Based Planning:</strong> When milestones and events are more important than activities</li>
              <li>• <strong>Historical Documentation:</strong> Maintaining legacy project documentation</li>
              <li>• <strong>Academic Teaching:</strong> Teaching network diagram fundamentals</li>
            </ul>
          </section>

          {/* When to Use AON */}
          <section>
            <h3 className="text-xl font-semibold text-green-900 mb-3">When to Use AON (Activity on Node)</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Modern Tools:</strong> Supported by MS Project, Primavera, and all modern PM software</li>
              <li>• <strong>CPM Focus:</strong> Critical Path Method with deterministic scheduling</li>
              <li>• <strong>Complex Dependencies:</strong> Projects with multiple relationship types (FS, SS, FF, SF)</li>
              <li>• <strong>Large Projects:</strong> Projects with 50+ activities and complex interdependencies</li>
              <li>• <strong>Resource Management:</strong> When integrating with resource allocation and leveling</li>
              <li>• <strong>Industry Standard:</strong> Required by organizational or industry standards (PMI, construction)</li>
            </ul>
          </section>

          {/* When NOT to Use AOA */}
          <section>
            <h3 className="text-xl font-semibold text-red-900 mb-3">When NOT to Use AOA</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Large/Complex Projects:</strong> Becomes cluttered and difficult to read with many activities</li>
              <li>• <strong>Dummy Activities Required:</strong> Multiple dependencies create confusing dummy arrows</li>
              <li>• <strong>Software Tool Integration:</strong> Most modern PM tools don't support AOA format</li>
              <li>• <strong>Team Collaboration:</strong> Harder for non-technical stakeholders to understand</li>
              <li>• <strong>Frequent Changes:</strong> Difficult to update and maintain as scope changes</li>
            </ul>
          </section>

          {/* When NOT to Use AON */}
          <section>
            <h3 className="text-xl font-semibold text-red-900 mb-3">When NOT to Use AON</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Historical PERT:</strong> Working with legacy PERT documentation that uses AOA</li>
              <li>• <strong>Extreme Simplicity:</strong> Very simple projects (5-10 activities) where AOA is clearer</li>
              <li>• <strong>Space Constraints:</strong> Limited diagram space where compact AOA works better</li>
            </ul>
          </section>

          {/* Comparison Table */}
          <section>
            <h3 className="text-xl font-semibold text-foreground mb-3">Detailed Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Aspect</th>
                    <th className="border border-border p-3 text-left">AOA (Activity on Arrow)</th>
                    <th className="border border-border p-3 text-left">AON (Activity on Node)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-border p-3 font-semibold">Activities Shown On</td>
                    <td className="border border-border p-3">Arrows (lines)</td>
                    <td className="border border-border p-3">Nodes (boxes)</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Dummy Activities</td>
                    <td className="border border-border p-3">Required for complex dependencies</td>
                    <td className="border border-border p-3">Not needed</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">Complexity</td>
                    <td className="border border-border p-3">Gets complex quickly</td>
                    <td className="border border-border p-3">Scales well to large projects</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Modern Software Support</td>
                    <td className="border border-border p-3">Limited or none</td>
                    <td className="border border-border p-3">Universal support</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">Information Density</td>
                    <td className="border border-border p-3">Lower (less info per element)</td>
                    <td className="border border-border p-3">Higher (all data in one box)</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Ease of Understanding</td>
                    <td className="border border-border p-3">Harder for beginners</td>
                    <td className="border border-border p-3">Easier to read and interpret</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">Best Use Case</td>
                    <td className="border border-border p-3">Simple PERT networks</td>
                    <td className="border border-border p-3">Complex CPM schedules</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Industry Standard</td>
                    <td className="border border-border p-3">Historical (1950s-1980s)</td>
                    <td className="border border-border p-3">Current standard (1990s+)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Final Recommendation */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-900 mb-3">✓ Final Recommendation</h3>
            <p className="text-muted-foreground mb-3">
              <strong>Use AON (Activity on Node)</strong> as your default choice for modern project management. It's the industry standard, 
              supported by all major PM software, and scales better to complex projects.
            </p>
            <p className="text-muted-foreground">
              Only use AOA if you're working with legacy systems, teaching historical methods, or have very simple event-driven projects 
              where the classic PERT approach makes more sense.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
