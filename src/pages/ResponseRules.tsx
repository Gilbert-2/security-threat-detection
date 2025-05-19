
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { responseRuleService, ResponseRule } from "@/services/responseRuleService";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Plus, 
  Search, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  AlertOctagon  
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function to format the timestamp
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const ResponseRules = () => {
  const [rules, setRules] = useState<ResponseRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ResponseRule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    severity: "MEDIUM",
    requiresApproval: false,
    conditions: [],
    actions: []
  });
  
  const { toast } = useToast();

  // Condition and action types
  const conditionTypes = ["motion", "time", "object", "duration"];
  const actionTypes = ["notify", "alarm", "record", "lock", "block"];

  // Fetch rules when component mounts
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await responseRuleService.getResponseRules();
      setRules(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch response rules');
      console.error('Error fetching response rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    try {
      // Add default conditions and actions if none provided
      const ruleData = {
        ...formData,
        conditions: formData.conditions.length ? formData.conditions : [{ type: "motion", value: "detected" }],
        actions: formData.actions.length ? formData.actions : [{ type: "notify", target: "security-team" }],
        status: "Active" as const
      };
      
      await responseRuleService.createResponseRule(ruleData);
      toast({ title: "Success", description: "Response rule created successfully" });
      setCreateDialogOpen(false);
      fetchRules();
      resetForm();
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to create response rule", 
        variant: "destructive" 
      });
    }
  };

  const handleUpdateRule = async () => {
    if (!selectedRule) return;
    
    try {
      await responseRuleService.updateResponseRule(selectedRule.id, formData);
      toast({ title: "Success", description: "Response rule updated successfully" });
      setEditDialogOpen(false);
      fetchRules();
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to update response rule", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteRule = async () => {
    if (!selectedRule) return;
    
    try {
      await responseRuleService.deleteResponseRule(selectedRule.id);
      toast({ title: "Success", description: "Response rule deleted successfully" });
      setDeleteDialogOpen(false);
      fetchRules();
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to delete response rule", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleStatus = async (rule: ResponseRule) => {
    try {
      if (rule.status === "Active") {
        await responseRuleService.deactivateRule(rule.id);
        toast({ title: "Success", description: "Rule deactivated successfully" });
      } else {
        await responseRuleService.activateRule(rule.id);
        toast({ title: "Success", description: "Rule activated successfully" });
      }
      fetchRules();
    } catch (err) {
      toast({ 
        title: "Error", 
        description: `Failed to ${rule.status === "Active" ? "deactivate" : "activate"} rule`, 
        variant: "destructive" 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      severity: "MEDIUM",
      requiresApproval: false,
      conditions: [],
      actions: []
    });
  };

  const editRule = (rule: ResponseRule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      severity: rule.severity,
      requiresApproval: rule.requiresApproval,
      conditions: [...rule.conditions],
      actions: [...rule.actions]
    });
    setEditDialogOpen(true);
  };

  const confirmDeleteRule = (rule: ResponseRule) => {
    setSelectedRule(rule);
    setDeleteDialogOpen(true);
  };

  // Filter rules based on search query
  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      : "bg-red-500/10 text-red-500 hover:bg-red-500/20";
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-500";
      case "HIGH":
        return "bg-orange-500/10 text-orange-500";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-500";
      case "LOW":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>Loading response rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Response Rules</h2>
            <p className="text-muted-foreground">Configure automated responses to security events</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Rule
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Response Rules
            </CardTitle>
            <CardDescription>
              Configure automated responses to security events
            </CardDescription>
            <div className="mt-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rules..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.length > 0 ? (
                    filteredRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {rule.description}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(rule.severity)}>{rule.severity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rule.lastTriggered ? formatDate(rule.lastTriggered) : "Never"}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(rule)}
                            title={rule.status === "Active" ? "Deactivate Rule" : "Activate Rule"}
                          >
                            {rule.status === "Active" ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editRule(rule)}
                            title="Edit Rule"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDeleteRule(rule)}
                            title="Delete Rule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="py-6 flex flex-col items-center justify-center text-muted-foreground">
                          <AlertOctagon className="h-10 w-10 mb-2" />
                          <h3 className="font-medium">No rules found</h3>
                          <p className="text-sm">
                            {searchQuery
                              ? "Try adjusting your search query"
                              : "Create your first response rule by clicking 'New Rule'"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Rule Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Response Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="requiresApproval"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                />
                <Label htmlFor="requiresApproval">Requires Approval</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule}>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Rule Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Response Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Rule Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger id="edit-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-requiresApproval"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                />
                <Label htmlFor="edit-requiresApproval">Requires Approval</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRule}>Update Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the response rule "{selectedRule?.name}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRule}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ResponseRules;
