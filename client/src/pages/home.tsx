import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Loader2, PlayCircle, Volume2, Expand } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const createCommunitySchema = z.object({
  rename: z.string().min(1, "Rename is required"),
  robuxFund: z.string().min(1, "Robux Fund is required"),
  communitiesMember: z.string().min(1, "Communities Member is required"),
  ownerUsername: z.string().min(1, "Owner Username is required"),
  textContent: z.string().min(1, "Communities text content is required"),
});

type CreateCommunityData = z.infer<typeof createCommunitySchema>;

export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    rename: "",
    robuxFund: "",
    communitiesMember: "",
    ownerUsername: "",
    textContent: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createCommunityMutation = useMutation({
    mutationFn: async (data: CreateCommunityData) => {
      const response = await apiRequest("POST", "/api/communities", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message,
      });
      // Reset form
      setFormData({
        rename: "",
        robuxFund: "",
        communitiesMember: "",
        ownerUsername: "",
        textContent: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      console.error("Error creating community:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create community",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate with zod
      const validatedData = createCommunitySchema.parse(formData);
      createCommunityMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: "Error",
          description: "Failed to process form data",
          variant: "destructive",
        });
      }
    }
  };

  const handleGoBack = () => {
    toast({
      title: "Go Back",
      description: "Go back functionality - implement navigation here",
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-secondary hover:text-white transition-colors p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>GO BACK</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">MAKE COMMUNITIES</h1>
          <p className="text-secondary">Make communities</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Community Form */}
          <Card className="bg-card-bg border-gray-600">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">MAKE COMMUNITIES</h2>
              <p className="text-secondary text-center mb-6">Making communities</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Communities Text Input */}
                <div>
                  <Label htmlFor="textContent" className="sr-only">Enter communities text</Label>
                  <Textarea
                    id="textContent"
                    placeholder="Enter communities file"
                    value={formData.textContent}
                    onChange={(e) => handleInputChange("textContent", e.target.value)}
                    className="bg-input-bg border-gray-600 text-white placeholder:text-secondary focus:border-cyan-accent min-h-[100px] resize-none"
                    rows={4}
                  />
                  {errors.textContent && <p className="text-red-500 text-sm mt-1">{errors.textContent}</p>}
                </div>

                {/* Rename Input */}
                <div>
                  <Label htmlFor="rename" className="sr-only">Rename</Label>
                  <Input
                    id="rename"
                    type="text"
                    placeholder="Rename"
                    value={formData.rename}
                    onChange={(e) => handleInputChange("rename", e.target.value)}
                    className="bg-input-bg border-gray-600 text-white placeholder:text-secondary focus:border-cyan-accent"
                  />
                  {errors.rename && <p className="text-red-500 text-sm mt-1">{errors.rename}</p>}
                </div>

                {/* Robux Fund Input */}
                <div>
                  <Label htmlFor="robuxFund" className="sr-only">Robux Fund</Label>
                  <Input
                    id="robuxFund"
                    type="text"
                    placeholder="Robux Fund"
                    value={formData.robuxFund}
                    onChange={(e) => handleInputChange("robuxFund", e.target.value)}
                    className="bg-input-bg border-gray-600 text-white placeholder:text-secondary focus:border-cyan-accent"
                  />
                  {errors.robuxFund && <p className="text-red-500 text-sm mt-1">{errors.robuxFund}</p>}
                </div>

                {/* Communities Member Input */}
                <div>
                  <Label htmlFor="communitiesMember" className="sr-only">Communities Member</Label>
                  <Input
                    id="communitiesMember"
                    type="text"
                    placeholder="Communities Member"
                    value={formData.communitiesMember}
                    onChange={(e) => handleInputChange("communitiesMember", e.target.value)}
                    className="bg-input-bg border-gray-600 text-white placeholder:text-secondary focus:border-cyan-accent"
                  />
                  {errors.communitiesMember && <p className="text-red-500 text-sm mt-1">{errors.communitiesMember}</p>}
                </div>

                {/* Owner Username Input */}
                <div>
                  <Label htmlFor="ownerUsername" className="sr-only">Owner Username</Label>
                  <Input
                    id="ownerUsername"
                    type="text"
                    placeholder="Owner Username"
                    value={formData.ownerUsername}
                    onChange={(e) => handleInputChange("ownerUsername", e.target.value)}
                    className="bg-input-bg border-gray-600 text-white placeholder:text-secondary focus:border-cyan-accent"
                  />
                  {errors.ownerUsername && <p className="text-red-500 text-sm mt-1">{errors.ownerUsername}</p>}
                </div>



                {/* Start Making Button */}
                <Button
                  type="submit"
                  disabled={createCommunityMutation.isPending}
                  className="w-full bg-cyan-accent text-black font-semibold py-3 hover:bg-cyan-500 transition-colors disabled:opacity-50"
                >
                  {createCommunityMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Making"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Video Tutorial */}
          <Card className="bg-card-bg border-gray-600">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">How to use</h2>
              <p className="text-secondary text-center mb-6">Video Tutorial</p>
              
              {/* Video Player Container */}
              <div className="bg-input-bg rounded-lg overflow-hidden aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-cyan-accent mb-4" />
                    <p className="text-secondary">Tutorial Video</p>
                    <p className="text-sm text-secondary mt-2">Click to play tutorial</p>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:text-cyan-accent p-1">
                    <Play className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 bg-gray-600 h-1 rounded">
                    <div className="bg-cyan-accent h-1 rounded" style={{ width: "0%" }}></div>
                  </div>
                  <span className="text-xs text-secondary">0:00</span>
                  <Button variant="ghost" size="sm" className="text-white hover:text-cyan-accent p-1">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:text-cyan-accent p-1">
                    <Expand className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tutorial Steps */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-sm text-secondary">Upload your communities text file</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-sm text-secondary">Fill in the required information</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-sm text-secondary">Add your Discord webhook URL</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-sm text-secondary">Click "Start Making" to generate and send</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
