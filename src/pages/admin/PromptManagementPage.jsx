
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

const initialPrompts = [
  { id: 'prm_1', name: 'Idea Validation Query', category: 'Validation', content: 'Analyze the viability of a startup idea focusing on [topic] for [targetAudience]. Provide potential challenges and market opportunities.', created: '2023-05-10', lastUpdated: '2023-05-15' },
  { id: 'prm_2', name: 'Marketing Slogan Generator', category: 'Marketing', content: 'Generate 5 catchy slogans for a new product in the [industry] sector called [productName].', created: '2023-06-01', lastUpdated: '2023-06-02' },
  { id: 'prm_3', name: 'Business Plan Outline', category: 'Strategy', content: 'Create a comprehensive business plan outline for a [businessType] targeting [marketSegment].', created: '2023-07-20', lastUpdated: '2023-07-20' },
];

const PromptManagementPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [promptName, setPromptName] = useState('');
  const [promptCategory, setPromptCategory] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedPrompts = localStorage.getItem('admin_prompts');
    if (storedPrompts) {
      setPrompts(JSON.parse(storedPrompts));
    } else {
      setPrompts(initialPrompts);
      localStorage.setItem('admin_prompts', JSON.stringify(initialPrompts));
    }
  }, []);

  const savePrompts = (updatedPrompts) => {
    setPrompts(updatedPrompts);
    localStorage.setItem('admin_prompts', JSON.stringify(updatedPrompts));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchTerm) ||
    prompt.category.toLowerCase().includes(searchTerm) ||
    prompt.content.toLowerCase().includes(searchTerm)
  );

  const resetForm = () => {
    setCurrentPrompt(null);
    setPromptName('');
    setPromptCategory('');
    setPromptContent('');
  };

  const openFormDialog = (prompt = null) => {
    if (prompt) {
      setCurrentPrompt(prompt);
      setPromptName(prompt.name);
      setPromptCategory(prompt.category);
      setPromptContent(prompt.content);
    } else {
      resetForm();
    }
    setIsFormDialogOpen(true);
  };
  
  const handleSubmitPrompt = () => {
    if (!promptName || !promptCategory || !promptContent) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required." });
      return;
    }

    if (currentPrompt) { // Editing existing prompt
      const updatedPrompts = prompts.map(p => 
        p.id === currentPrompt.id 
        ? { ...p, name: promptName, category: promptCategory, content: promptContent, lastUpdated: new Date().toISOString().split('T')[0] } 
        : p
      );
      savePrompts(updatedPrompts);
      toast({ title: "Success", description: "Prompt updated successfully." });
    } else { // Adding new prompt
      const newPrompt = {
        id: `prm_${Date.now()}`,
        name: promptName,
        category: promptCategory,
        content: promptContent,
        created: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      const updatedPrompts = [...prompts, newPrompt];
      savePrompts(updatedPrompts);
      toast({ title: "Success", description: "Prompt added successfully." });
    }
    setIsFormDialogOpen(false);
    resetForm();
  };

  const handleDeletePrompt = (promptId) => {
    const updatedPrompts = prompts.filter(prompt => prompt.id !== promptId);
    savePrompts(updatedPrompts);
    toast({ title: "Success", description: "Prompt deleted successfully." });
  };


  return (
    <>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Prompt Management</h1>
        <Button size="sm" onClick={() => openFormDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Prompt
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prompts..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[40%]">Content (Preview)</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.name}</TableCell>
                  <TableCell>{prompt.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-xs">{prompt.content}</TableCell>
                  <TableCell>{prompt.created}</TableCell>
                  <TableCell>{prompt.lastUpdated}</TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openFormDialog(prompt)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeletePrompt(prompt.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentPrompt ? 'Edit Prompt' : 'Add New Prompt'}</DialogTitle>
            <DialogDescription>
              {currentPrompt ? 'Update the details of this prompt.' : 'Fill in the details to create a new prompt.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prompt-name" className="text-right">Name</Label>
              <Input id="prompt-name" value={promptName} onChange={(e) => setPromptName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prompt-category" className="text-right">Category</Label>
              <Input id="prompt-category" value={promptCategory} onChange={(e) => setPromptCategory(e.target.value)} className="col-span-3" placeholder="e.g., Marketing, Strategy" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="prompt-content" className="text-right pt-2">Content</Label>
              <Textarea 
                id="prompt-content" 
                value={promptContent} 
                onChange={(e) => setPromptContent(e.target.value)} 
                className="col-span-3 min-h-[150px]"
                placeholder="Enter the full prompt content here. Use placeholders like [topic] or [productName] where dynamic input is needed."
              />
            </div>
             <p className="col-span-4 text-xs text-muted-foreground px-1">
                Use bracketed placeholders like `[variableName]` for dynamic parts of your prompt.
              </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsFormDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmitPrompt}>{currentPrompt ? 'Save Changes' : 'Add Prompt'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptManagementPage;
